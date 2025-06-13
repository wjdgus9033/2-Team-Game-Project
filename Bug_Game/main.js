import {startGame} from './gameState';
import { backgroundSound } from './sound';


const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");

playBtn.addEventListener("click",()=>{
    document.getElementById("startOverlay").style.display = "none";
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    startGame();
});