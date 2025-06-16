import { gameInitFn, startFn, createBoardStatusFn, drawBoardFn, drawStoneFn, switchPlayerFn, gameOverFn } from "./function.js";

export const game = {
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