
let bugs = [];
let items = [];
let highScore = localStorage.getItem("highScore") || 0;
let timerInterval;
let gameInterval;
let gameOverText = "";


const restartBtn = document.getElementById("restartBtn");
const restartBtn1 = document.getElementById("restartBtn1");




document.getElementById("playBtn").addEventListener("click", () => {
    document.getElementById("startOverlay").style.display = "none";
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    startGame();
});


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

    items.forEach((item) => {
        if (item.state === "alive" && mouseX >= item.x && mouseX <= item.x + item.size && mouseY >= item.y && mouseY <= item.y + item.size) {
            itemhit = true;
            item.state = "dead";

            if (item.type === "life") {
                if (lives < maxLives) lives++;
                effects.push({
                    x: item.x,
                    y: item.y,
                    text: "+1",
                    color: "red",
                    opacity: 1
                });


            }
            else if (item.type === "time") {
                if (timeLeft <= 55) timeLeft += 5;
                else timeLeft = 60;

                effects.push({
                    x: item.x,
                    y: item.y,
                    text: "+ 5초",
                    color: "blue",
                    opacity: 1
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
    if (itemhit) {
        itemhitSound.currentTime = 0;
        itemhitSound.play();
    }
});


restartBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    clearInterval(levelUpInterval);
    clearInterval(itemInterval);
    startGame();
});
