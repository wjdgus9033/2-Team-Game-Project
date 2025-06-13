import { spawnBugWave, spawnItem } from './spawn.js';
import { draw } from './draw.js';
import { startTimer, stopTimers, resetTimers } from './timer.js';
import { backgroundSound } from './sound.js';
import { canvas } from './ui.js';
import { addEffect } from './effect.js';

export let score = 0;
export let timeLeft = 60;
export let lives = 5;
export let currentLevel = 1;
export let bugSpeed = 1.5;
export let isGameOver = false;

let itemInterval;
let levelUpInterval;
let bugInterval;


export function startGame() {
    score = 0;
    timeLeft = 60;
    lives = 5;
    currentLevel = 1;
    bugSpeed = 1.5;
    isGameOver = false;

    resetTimers();
    stopTimers();

    document.getElementById("gameOverOverlay").style.display = "none";

    itemInterval = setInterval(spawnItem, 5000);
    bugInterval = setInterval(() => {
        let bugCount = Math.min(1 + Math.floor(currentLevel / 2), 5);
        spawnBugWave(bugCount);
    }, 1000);

    levelUpInterval = setInterval(() => {
        if (isGameOver) return;
        bugSpeed += 0.6;
        currentLevel++;

        addEffect(canvas.width / 2 - 100, canvas.height / 2, `레벨 ${currentLevel}!`, "purple");
    }, 30000);

    startTimer();
    draw();

    backgroundSound.currentTime = 0;
    backgroundSound.play();
}



export function endGame(reason) {
    isGameOver = true;
    stopTimers();
    clearInterval(itemInterval);
    clearInterval(levelUpInterval);
    clearInterval(bugInterval);
    backgroundSound.pause();
    document.getElementById("gameOverText").textContent = reason;
    document.getElementById("finalScoreText").textContent = `모기 ${score} 마리 퇴치`;
    document.getElementById("levelCurrentText").textContent = `레벨 : ${currentLevel}`;
    document.getElementById("gameOverOverlay").style.display = "flex";



}




