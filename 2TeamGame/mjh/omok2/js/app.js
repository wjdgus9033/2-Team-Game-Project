const container = document.getElementById("container");
const canvasWrapper = document.getElementById("canvas-wrapper");
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
    1: { name: "흑", color: "black", playerNumber: 1 },
    2: { name: "백", color: "white", playerNumber: 2 },
  },
  start: startFn,
  createBoardStatus: createBoardStatusFn,
  drawBoard: drawBoardFn,
  drawStone: drawStoneFn,
  switchPlayer: switchPlayerFn,
  gameOver: gameOverFn,
};

game.start();

