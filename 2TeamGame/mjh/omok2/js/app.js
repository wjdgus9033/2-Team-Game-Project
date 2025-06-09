const container = document.getElementById("container");
const canvasWrapper = document.getElementById("canvas-wrapper");
const player1El = document.getElementById("player-1");
const player2El = document.getElementById("player-2");
const turnCountEl = document.getElementById("turn-count");
const turnPlayerEl = document.getElementById("turn-player");
let comboPatterns = [];

const game = {
  canvas: document.createElement("canvas"),
  context: null,
  stone: [],
  boardStatus: [],
  boardCell: 19,
  toWin: 5,
  cellSize: null,
  defaultValue: 0,
  activePlayer: 1,
  currentRound: 0,
  isOver: false,
  player: {
    1: {playerName: "" ,name: "흑", color: "black", playerNumber: 1},
    2: {playerName: "" ,name: "백", color: "white", playerNumber: 2},
  },
  init: gameInitFn,
  start: startFn,
  createBoardStatus: createBoardStatusFn,
  drawBoard: drawBoardFn,
  drawStone: drawStoneFn,
  switchPlayer: switchPlayerFn,
  gameOver: gameOverFn,
};
generateWinningCombos(game.boardCell, game.toWin);
createStart();


