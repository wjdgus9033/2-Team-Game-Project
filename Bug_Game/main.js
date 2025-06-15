import { startGame, isGameOver, updateGameState, score, currentLevel, timeLeft, lives, maxLives } from './game.js';
import { entities, handleClick } from './entities.js';
import { drawEffects } from './effects.js';
import { playSound, backgroundSound } from './sound.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const restartBtn = document.getElementById("restartBtn");

document.getElementById("playBtn").addEventListener("click", () => {
    document.getElementById("startOverlay").style.display = "none";
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    startGame();
});

restartBtn.addEventListener("click", () => {
    startGame();
});

canvas.addEventListener("click", (e) => {
    if (isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const hitResult = handleClick(mouseX, mouseY);

    if (!hitResult.hit && !hitResult.itemhit) {
        playSound('fail');
        updateGameState('loseLife');
    } else if (hitResult.hit) {
        playSound('hit');
    } else if (hitResult.itemhit) {
        playSound('itemhit');
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    entities.update(ctx, canvas);

    drawEffects(ctx);

    ctx.save();
    ctx.font = "22px 'Bagel Fat One', sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";

    ctx.fillText(`모기 ${score} 마리 퇴치`, canvas.width - 10, 30);
    ctx.fillText(`최고점수 : ${localStorage.getItem("highScore") || 0}`, canvas.width - 10, 60);
    ctx.fillText(`남은시간 : ${timeLeft}`, canvas.width - 10, 90);
    ctx.fillText(`레벨 :  ${currentLevel}`, canvas.width - 10, 120);
    ctx.restore();

    for (let i = 0; i < lives; i++) {
        entities.drawHeart(ctx, 10 + i * 40, 10);
    }

    if (!isGameOver) {
        requestAnimationFrame(draw);
    }
}

export function startDrawLoop() {
    requestAnimationFrame(draw);
}
