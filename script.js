const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Make the canvas size dynamic
const gridSize = 20;
let tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

let apple = { x: 15, y: 15 };
let dx = 1;
let dy = 0;
let score = 0;
let gameRunning = true;

document.getElementById('upButton').addEventListener('click', () => changeDirection(38));
document.getElementById('downButton').addEventListener('click', () => changeDirection(40));
document.getElementById('leftButton').addEventListener('click', () => changeDirection(37));
document.getElementById('rightButton').addEventListener('click', () => changeDirection(39));
document.getElementById('quitButton').addEventListener('click', quitGame);
document.getElementById('refreshButton').addEventListener('click', refreshGame);
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.9, 400);
    canvas.height = canvas.width;
    tileCount = canvas.width / gridSize;
}

function gameLoop() {
    if (!gameRunning) return;

    setTimeout(function() {
        clearCanvas();
        drawApple();
        moveSnake();
        drawSnake();
        gameLoop();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(function(part) {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
}

function moveSnake() {
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wrap around logic
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score += 10;
        createApple();
    } else {
        snake.pop();
    }

    if (collisionWithSelf()) {
        gameRunning = false;
        alert("Game Over! Your score: " + score);
    }
}

function changeDirection(keyCode) {
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyCode === leftKey && !goingRight) {
        dx = -1;
        dy = 0;
    }

    if (keyCode === upKey && !goingDown) {
        dx = 0;
        dy = -1;
    }

    if (keyCode === rightKey && !goingLeft) {
        dx = 1;
        dy = 0;
    }

    if (keyCode === downKey && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function createApple() {
    apple = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    snake.forEach(function(part) {
        const appleIsOnSnake = part.x === apple.x && part.y === apple.y;
        if (appleIsOnSnake) createApple();
    });
}

function collisionWithSelf() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

function quitGame() {
    gameRunning = false;
    alert("You quit the game. Your score: " + score);
}

function refreshGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    apple = { x: 15, y: 15 };
    dx = 1;
    dy = 0;
    score = 0;
    gameRunning = true;
    gameLoop();
}

// Initialize the canvas size
resizeCanvas();
gameLoop();
