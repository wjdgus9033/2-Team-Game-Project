import {stateGame} from "./gameState.js";
import {backgroundSound} from "./sound.js";

const startBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");

document.getElementById("playBtn").addEventListener("click", () => {
    document.getElementById("startOverlay").style.display = "none";
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    startGame();
});


document.getElementById("restartBtn").addEventListener("click",()=>{
    startGame();
});
