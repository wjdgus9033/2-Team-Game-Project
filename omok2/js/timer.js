import { updateTimeUIFn } from "./function.js";

export const timerStatus = {
  timer: null,
  startTime: 0,
  playerDefaultTime: 0,
  playerDisplayTime : 0,
  mainDisplayMin: 0,
  mainDisplaySec: 0,
  updateTimeUI: updateTimeUIFn,
}