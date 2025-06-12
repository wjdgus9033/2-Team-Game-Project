const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const restartBtn = document.getElementById("restartBtn");
const restartBtn1 = document.getElementById("restartBtn1");
const backgroundSound = new Audio("./sound/background.mp3");
const hitSound = new Audio("./sound/hitsound.mp3");
hitSound.volume = 0.7;
const failhitSound = new Audio("./sound/failhit.mp3");
failhitSound.volume = 0.7;
const itemhitSound = new Audio("./sound/itemhitsound.mp3");
itemhitSound.volume = 0.5;
backgroundSound.loop = true;


let bugs = [];
let items = [];
let effects = [];

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

const timeitem = new Image();
timeitem.src = "./img/time.png";


document.getElementById("playBtn").addEventListener("click", () => {
    document.getElementById("startOverlay").style.display = "none";
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    startGame();
});

function spawnItem(){
    if(isGameOver) return;

    const random = Math.random();
    if(random > 0.5) return;

    const type = Math.random() > 0.6 ? "life" : "time";
    const item = {
        x : Math.random() * (canvas.width -100),
        y : Math.random() * (canvas.height -100),
        size : 70,
        type : type,
        image : type === "life" ? heartImage : timeitem,
        opacity : 1,
        state : "alive",
        vx:(Math.random() -0.5) *0.9,
        vy : (Math.random() - 0.5) *0.9
    };
    items.push(item);

    setTimeout(() => {
        item.state = "dead";

    }, 3000);

}

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
    }, 3500);
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
        items = items.filter(item => item.state != "dead");

        items.forEach(item =>{
            ctx.globalAlpha = item.opacity;
            item.x += item.vx;
            item.y += item.vy;

            if(item.x<0 || item.x + item.size > canvas.width) item.vx *=-1;
            if(item.y<0 || item.y+item.size >canvas.height) item.vy*=-1;

            ctx.drawImage(item.image, item.x, item.y, item.size, item.size);
        });
        ctx.restore();

    });

    ctx.save();
    ctx.font = "22px 'Bagel Fat One', sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";

    ctx.fillText(`모기 ${score} 마리 퇴치`, canvas.width - 10, 30);
    ctx.fillText(`최고점수 : ${highScore}`, canvas.width - 10, 60);
    ctx.fillText(`남은시간 : ${timeLeft}`, canvas.width - 10, 90);

    ctx.restore();

    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, 10 + i * 40, 10, 50, 50);
    }

    if (!isGameOver) {
        requestAnimationFrame(draw);
    }

    effects = effects.filter(effect => effect.opacity >0);

    effects.forEach(effect=>{
        ctx.globalAlpha = effect.opacity;
        ctx.fillStyle = effect.color;
        ctx.font = "40px 'Bagel Fat One', cursive";
        ctx.fillText(effect.text, effect.x, effect.y);
        
        effect.y -=1;
        effect.opacity -= 0.02;
    });
}

canvas.addEventListener("click", (e) => {
    hitSound.currentTime = 0;
    hitSound.play();
    if (isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    let hit = false;
    let itemhit = false;
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

    items.forEach((item) =>{
        if(item.state === "alive" && mouseX >= item.x && mouseX <= item.x + item.size && mouseY >= item.y && mouseY <= item.y + item.size){
            itemhit = true;
            item.state = "dead";

            if(item.type === "life"){
                if(lives<maxLives) lives++;
                effects.push({
                    x:item.x,
                    y:item.y,
                    text : "+1",
                    color : "red",
                    opacity : 1
                });


            }
            else if(item.type === "time"){
                if(timeLeft<=55) timeLeft+=5;
                else timeLeft =60;

                effects.push({
                    x : item.x,
                    y: item.y,
                    text : "+ 5초",
                    color : "blue",
                    opacity:1
                });
            }
        }
    });

    if (!hit && !itemhit) {
        lives--;
        failhitSound.currentTime = 0;
        failhitSound.play();
        if (lives <= 0) {
            gameOverText = "Game Over!";
            endGame();

        }
    }
    if(itemhit){
        itemhitSound.currentTime =0;
        itemhitSound.play();
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
    clearInterval(itemInterval);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    backgroundSound.pause();
    document.getElementById("gameOverText").textContent = `${gameOverText}`;
    document.getElementById("finalScoreText").textContent = `모기 ${score} 마리 퇴치`;
    document.getElementById("gameOverOverlay").style.display = "flex";



}

function startGame() {
    score = 0;
    timeLeft = 60;
    lives = maxLives;
    isGameOver = false;
    bugs = [];

    document.getElementById("gameOverOverlay").style.display = "none"; 
    itemInterval = setInterval(spawnItem, 5000);
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
