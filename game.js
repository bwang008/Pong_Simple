const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const PADDLE_WIDTH = 10, PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;

let leftPaddle = { x: 10, y: canvas.height / 2 - PADDLE_HEIGHT / 2, speed: 0 };
let rightPaddle = { x: canvas.width - 20, y: canvas.height / 2 - PADDLE_HEIGHT / 2, speed: 4 };
let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    vx: 4 * (Math.random() > 0.5 ? 1 : -1),
    vy: 2 * (Math.random() > 0.5 ? 1 : -1)
};

let leftScore = 0, rightScore = 0;

// Mouse controls for left paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - PADDLE_HEIGHT / 2;
    // Clamp inside canvas
    leftPaddle.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, leftPaddle.y));
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Net
    for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#555');
    }

    // Paddles
    drawRect(leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    drawRect(rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');

    // Ball
    drawBall(ball.x, ball.y, BALL_SIZE, '#fff');

    // Score
    ctx.font = '32px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(leftScore, canvas.width / 2 - 50, 40);
    ctx.fillText(rightScore, canvas.width / 2 + 50, 40);
}

function update() {
    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball wall collision
    if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
        ball.vy *= -1;
    }

    // Ball left paddle collision
    if (
        ball.x <= leftPaddle.x + PADDLE_WIDTH &&
        ball.y + BALL_SIZE > leftPaddle.y &&
        ball.y < leftPaddle.y + PADDLE_HEIGHT
    ) {
        ball.vx = Math.abs(ball.vx);
        // Add some "spin" based on where it hit
        let collidePoint = (ball.y + BALL_SIZE / 2) - (leftPaddle.y + PADDLE_HEIGHT / 2);
        ball.vy += collidePoint * 0.1;
    }

    // Ball right paddle collision
    if (
        ball.x + BALL_SIZE >= rightPaddle.x &&
        ball.y + BALL_SIZE > rightPaddle.y &&
        ball.y < rightPaddle.y + PADDLE_HEIGHT
    ) {
        ball.vx = -Math.abs(ball.vx);
        let collidePoint = (ball.y + BALL_SIZE / 2) - (rightPaddle.y + PADDLE_HEIGHT / 2);
        ball.vy += collidePoint * 0.1;
    }

    // Ball out of bounds (score)
    if (ball.x < 0) {
        rightScore++;
        resetBall();
    } else if (ball.x > canvas.width) {
        leftScore++;
        resetBall();
    }

    // AI for right paddle (simple tracking)
    let target = ball.y - PADDLE_HEIGHT / 2 + BALL_SIZE / 2;
    if (rightPaddle.y + PADDLE_HEIGHT / 2 < ball.y + BALL_SIZE / 2) {
        rightPaddle.y += rightPaddle.speed;
    } else if (rightPaddle.y + PADDLE_HEIGHT / 2 > ball.y + BALL_SIZE / 2) {
        rightPaddle.y -= rightPaddle.speed;
    }
    // Clamp AI paddle
    rightPaddle.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, rightPaddle.y));
}

function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 2 * (Math.random() > 0.5 ? 1 : -1);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();