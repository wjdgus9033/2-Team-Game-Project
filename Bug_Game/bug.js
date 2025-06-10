const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const restartBtn = document.getElementById("restartBtn");


let bugs = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLeft = 60;
let timerInterval;
let gameInterval;
let isGameOver = false;


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

            if(bug.x<0 || bug.x+bug.size>canvas.width){
                bug.vx*= -1;
            }
            if(bug.y<0 || bug.y + bug.size > canvas.height){
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

    ctx.fillText(`점수 : ${score}`, canvas.width -10,30);
    ctx.fillText(`최고점수 : ${highScore}`, canvas.width -10,60);
    ctx.fillText(`남은시간 : ${timeLeft}`, canvas.width -10,90);

    ctx.restore();

    requestAnimationFrame(draw);
}

canvas.addEventListener("click", (e) => {
    if (isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    bugs.forEach((bug) => {
        if (
            bug.state === "alive" && mouseX >= bug.x && mouseX <= bug.x + bug.size && mouseY >= bug.y && mouseY <= bug.y + bug.size
        ) {
            bug.state = "hit";
            bug.opacity = 1;
            score++;

            setTimeout(() => {
                bug.state = "dead";

            }, 300);
        }
    });
});

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
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
}

function startGame() {
    score = 0;
    timeLeft = 60;
    isGameOver = false;
    bugs = [];

  
    gameInterval = setInterval(spawnBug, 1000);
    startTimer();
    draw();
}

restartBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    startGame();
});

startGame();

