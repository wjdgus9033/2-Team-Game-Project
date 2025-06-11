const container = document.getElementById("container");
const canvasWrapper = document.getElementById("canvas-wrapper");
const player1El = document.getElementById("player-1");
const player2El = document.getElementById("player-2");
const turnCountEl = document.getElementById("turn-count");
const turnPlayerEl = document.getElementById("turn-player");
const totalTurnEl = document.getElementById("total-turn");
const timeDisplayEl = document.getElementById("time-display");
const player1timeEl = document.getElementById("player-1-timedisplay");
const player2timeEl = document.getElementById("player-2-timedisplay");
const playerScoreEl = document.querySelectorAll(".player-score")

const timerStatus = {
  timer: "",
  startTime: 0,
  playerDefaultTime: 0,
  playerDisplayTime : 0,
  mainDisplayMin: 0,
  mainDisplaySec: 0,
}

const game = {
  canvas: document.createElement("canvas"),
  context: null,
  boardStatus: [],
  boardCell: 19,
  toWin: 5,
  cellSize: null,
  defaultValue: 0,
  activePlayer: 1,
  currentRound: 0,
  isOver: false,
  player: {
    1: {name: "흑", color: "black", score: 0},
    2: {name: "백", color: "white", score: 0},
  },
  init: gameInitFn,
  start: startFn,
  createBoardStatus: createBoardStatusFn,
  drawBoard: drawBoardFn,
  drawStone: drawStoneFn,
  switchPlayer: switchPlayerFn,
  gameOver: gameOverFn,
};

createStart();


