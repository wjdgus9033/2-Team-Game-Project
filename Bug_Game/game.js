import { spawnBugWave, entities } from './entities.js';
import { effects } from './effects.js';
import { startDrawLoop } from './main.js';
import { backgroundSound } from './sound.js';

export let score = 0;
export let highScore = parseInt(localStorage.getItem("highScore")) || 0;
export let currentLevel = 1;
export let timeLeft = 60;
export let lives = 5;
export const maxLives = 5;
export let isGameOver = false;

let timerInterval;
let gameInterval;
let itemInterval;
let levelUpInterval;

export function startGame() {
    score = 0;
    timeLeft = 60;
    lives = maxLives;
    currentLevel = 1;
    isGameOver = false;

    clearIntervals();

    document.getElementById("gameOverOverlay").style.display = "none";

    itemInterval = setInterval(() => {
        entities.spawnItem();
    }, 5000);

    gameInterval = setInterval(() => {
        if (isGameOver) return;
        let bugCount = Math.min(1 + Math.floor(currentLevel / 2), 5);
        spawnBugWave(bugCount);
    }, 1000);

    startTimer();
    backgroundSound.currentTime = 0;
    backgroundSound.play();

    startDrawLoop();

    levelUpInterval = setInterval(() => {
        if (isGameOver) return;
        currentLevel++;
        entities.increaseBugSpeed(0.6);

        effects.push({
            x: 300,
            y: 300,
            text: `레벨 ${currentLevel}!`,
            color: "purple",
            opacity: 1
        });
    }, 30000);
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (isGameOver) return;
        timeLeft--;
        if (timeLeft <= 0) {
            endGame("Time Over!");
        }
    }, 1000);
}

export function endGame(message = "Game Over!") {
    isGameOver = true;

    clearIntervals();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    backgroundSound.pause();

    document.getElementById("gameOverText").textContent = message;
    document.getElementById("finalScoreText").textContent = `모기 ${score} 마리 퇴치`;
    document.getElementById("levelCurrentText").textContent = `레벨 : ${currentLevel}`;
    document.getElementById("gameOverOverlay").style.display = "flex";
}

function clearIntervals() {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    clearInterval(itemInterval);
    clearInterval(levelUpInterval);
}

export function updateGameState(action) {
    switch (action) {
        case 'increaseScore':
            score++;
            break;
        case 'loseLife':
            lives--;
            if (lives <= 0) {
                endGame();
            }
            break;
        case 'addLife':
            if (lives < maxLives) lives++;
            break;
        case 'addTime':
            timeLeft = Math.min(timeLeft + 5, 60);
            break;
    }
}
