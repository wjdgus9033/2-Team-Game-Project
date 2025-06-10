const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const restartBtn = document.getElementById("restartBtn");
const restartBtn1 = document.getElementById("restartBtn1");
const backgroundSound = new Audio("./sound/background.mp3");
const hitSound = new Audio("./sound/hitsound.mp3");
const failhitSound = new Audio("./sound/failhit.mp3");
backgroundSound.loop = true;


let bugs = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLeft = 60;
let timerInterval;
let gameInterval;
let isGameOver = false;
let gameOverText = "";

let lives = 5;
const maxLives = 5;

const heartImage = new Image();
heartImage.src = "./img/heart.png";

document.getElementById("playBtn").addEventListener("click", () => {
    document.getElementById("startOverlay").style.display = "none";
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    startGame();
});


function spawnBug() {
    if (isGameOver) return;

    const bug = {
        x: Math.random() * (canvas.width - 100),
        y: Math.random() * (canvas.height - 100),
        size: 100,
        state: "alive",
        opacity: 1,
        image: new Image(),
        hitImage: new Image(),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4
    };

    bug.image.src = "img/bug1.png";
    bug.hitImage.src = "img/d_bug.png";

    bugs.push(bug);

    setTimeout(() => {
        if (bug.state === "alive") bug.state = "dead";
    }, 2000);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bugs = bugs.filter((bug) => bug.state !== "dead");

    bugs.forEach((bug) => {
        ctx.globalAlpha = bug.opacity;

        if (bug.state === "alive") {

            bug.x += bug.vx;
            bug.y += bug.vy;

            if (bug.x < 0 || bug.x + bug.size > canvas.width) {
                bug.vx *= -1;
            }
            if (bug.y < 0 || bug.y + bug.size > canvas.height) {
                bug.vy *= -1;
            }

            ctx.drawImage(bug.image, bug.x, bug.y, bug.size, bug.size);
        } else if (bug.state === "hit") {
            ctx.drawImage(bug.hitImage, bug.x, bug.y, bug.size, bug.size);
            bug.opacity -= 0.05;
        }

        ctx.restore();

    });

    ctx.save();
    ctx.font = "22px 'Bagel Fat One', sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";

    ctx.fillText(`모기 퇴치 : ${score} 마리`, canvas.width - 10, 30);
    ctx.fillText(`최고점수 : ${highScore}`, canvas.width - 10, 60);
    ctx.fillText(`남은시간 : ${timeLeft}`, canvas.width - 10, 90);

    ctx.restore();

    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, 10 + i * 40, 10, 50, 50);
    }

    if (!isGameOver) {
        requestAnimationFrame(draw);
    }
}

canvas.addEventListener("click", (e) => {
    hitSound.currentTime = 0;
    hitSound.play();
    if (isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    let hit = false;

    bugs.forEach((bug) => {
        if (
            bug.state === "alive" && mouseX >= bug.x && mouseX <= bug.x + bug.size && mouseY >= bug.y && mouseY <= bug.y + bug.size
        ) {
            bug.state = "hit";
            bug.opacity = 1;
            score++;
            hit = true;
            setTimeout(() => {
                bug.state = "dead";

            }, 300);
        }
    });

    if (!hit) {
        lives--;
        failhitSound.currentTime = 0;
        failhitSound.play();
        if (lives <= 0) {
            gameOverText = "Game Over!";
            endGame();

        }
    }


});

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            gameOverText = "TimeOut!";
            endGame();
        }
    }, 1000);
}

function endGame() {
    isGameOver = true;
    clearInterval(timerInterval);
    clearInterval(gameInterval);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    backgroundSound.pause();
    document.getElementById("gameOverText").textContent = `${gameOverText}`;
    document.getElementById("finalScoreText").textContent = `모기 퇴치 : ${score} 마리`;
    document.getElementById("gameOverOverlay").style.display = "flex";



}

function startGame() {
    score = 0;
    timeLeft = 60;
    lives = maxLives;
    isGameOver = false;
    bugs = [];

    document.getElementById("gameOverOverlay").style.display = "none"; 

    gameInterval = setInterval(spawnBug, 1000);
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    startTimer();
    draw();
}

restartBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    startGame();
});
