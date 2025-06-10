// --------------- 참조 함수 --------------

function gameInitFn() {
  this.context = null;
  this.stone = [];
  this.boardStatus = [];
  this.currentRound = 0;
  this.activePlayer = 1;
  this.isOver = false;
  player1El.style.border = "none";
  player2El.style.border = "none";
}

function startFn() {
  this.init();

  this.canvas.width = 720;
  this.canvas.height = 720;
  this.canvas.style.display = "block";
  this.cellSize = (this.canvas.width + this.canvas.height) / 2 / this.boardCell;
  this.context = this.canvas.getContext("2d");
  this.canvas.addEventListener("mousemove", handleHover);
  this.canvas.addEventListener("click", handleClick);
  canvasWrapper.insertBefore(this.canvas, canvasWrapper.firstChild);
  this.drawBoard();
  this.createBoardStatus();

  if(!this.isOver) {
   game.currentRound = 1;
  }

  turnCountEl.textContent = `${this.currentRound}턴`;
  turnPlayerEl.textContent = `${
    this.player[this.activePlayer].name
  }의 차례입니다.`;
  player1El.style.borderBottom = "1.5rem solid rgb(22, 22, 22)";
}

function handleClick(e) {
  const rect = game.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor(x / game.cellSize);
  const row = Math.floor(y / game.cellSize);

  if (game.boardStatus[row][col] !== game.defaultValue) return;

  game.boardStatus[row][col] = game.activePlayer;

  game.drawStone(row, col, game.player[game.activePlayer].color);

  checkGameOver(game.boardStatus, comboPatterns);
  if (!game.isOver) {
    game.currentRound++;
    game.switchPlayer();
    updateTurn(game.activePlayer);
  }
}

function createBoardStatusFn() {
  this.boardStatus = Array.from({ length: this.boardCell }, () =>
    Array(this.boardCell).fill(this.defaultValue)
  );
}

function handleHover(e) {
  if (game.isOver) return;

  const rect = game.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor(x / game.cellSize);
  const row = Math.floor(y / game.cellSize);

  if (game.boardStatus[row][col] !== game.defaultValue) return;

  game.drawBoard();

  for (let row = 0; row < game.boardCell; row++) {
    for (let col = 0; col < game.boardCell; col++) {
      const val = game.boardStatus[row][col];
      if (val !== game.defaultValue) {
        game.drawStone(row, col, game.player[val].color);
      }
    }
  }

  // hover용 스톤은 반투명
  const hoverColor = game.player[game.activePlayer].color;
  drawStonePreview(row, col, hoverColor);
}

function drawStonePreview(row, col, color) {
  const ctx = game.context;
  const cellSize = game.cellSize;
  const centerX = cellSize / 2 + col * cellSize;
  const centerY = cellSize / 2 + row * cellSize;
  const radius = cellSize * 0.49;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = "#aaa";
  ctx.stroke();
}

function drawBoardFn() {
  const ctx = this.context;
  const size = (this.canvas.width + this.canvas.height) / 2;
  const cellSize = this.cellSize;
  const cell = this.boardCell;

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#e8d4a2";
  ctx.fillRect(0, 0, 720, 720);

  for (let i = 0; i < cell; i++) {
    ctx.beginPath();
    ctx.moveTo(cellSize / 2 + i * cellSize, cellSize / 2);
    ctx.lineTo(cellSize / 2 + i * cellSize, size - cellSize / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cellSize / 2, cellSize / 2 + i * cellSize);
    ctx.lineTo(size - cellSize / 2, cellSize / 2 + i * cellSize);
    ctx.stroke();
  }
}

function drawStoneFn(row, col, color) {
  const ctx = game.context;
  const cellSize = game.cellSize;
  const centerX = cellSize / 2 + col * cellSize;
  const centerY = cellSize / 2 + row * cellSize;
  const radius = cellSize * 0.49;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.stroke();
}

function switchPlayerFn() {
  this.activePlayer = this.activePlayer === 1 ? 2 : 1;
}

function gameOverFn(playerNum) {
  game.isOver = true;
  game.activePlayer = playerNum === -1 ? -1 : playerNum;

  createStart();
}

function updateTurn(player) {
  turnCountEl.textContent = `${game.currentRound}턴`;
  turnPlayerEl.textContent = `${game.player[player].name}의 차례입니다.`;

  if (player === 1) {
    player1El.style.borderBottom = "1.5rem solid rgb(22, 22, 22)";
    player2El.style.borderBottom = "none";
  } else {
    player2El.style.borderBottom = "1.5rem solid rgb(255, 255, 255)";
    player1El.style.borderBottom = "none";
  }
}

// -------------------승리 체크용 기능 함수--------------- -

function checkGameOver(status, combos) {
  if (game.currentRound === 19 * 19) {
    return game.gameOver(-1);
  }

  for (const combo of combos) {
    const values = combo.map(([row, col]) => status[row][col]);
    if (values.every((v) => v > 0) && values.every((v) => v === values[0])) {
      return game.gameOver(values[0]);
    }
  }
  return 0;
}

// ---------------- 패턴 생성용 함수 --------------------

function generateWinningCombos(boardSize, toWin) {
  //가로(행) 콤보 체크 반복문
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col <= boardSize - toWin; col++) {
      const combo = [];
      for (let win = 0; win < toWin; win++) {
        combo.push([row, col + win]);
      }
      comboPatterns.push(combo);
    }
  }

  //세로(열) 콤보 체크 반복문
  for (let row = 0; row <= boardSize - toWin; row++) {
    for (let col = 0; col < boardSize; col++) {
      const combo = [];
      for (let win = 0; win < toWin; win++) {
        combo.push([row + win, col]);
      }
      comboPatterns.push(combo);
    }
  }

  //대각선(\) 콤보 체크 반복문
  for (let row = 0; row <= boardSize - toWin; row++) {
    for (let col = 0; col <= boardSize - toWin; col++) {
      const combo = [];
      for (let win = 0; win < toWin; win++) {
        combo.push([row + win, col + win]);
      }
      comboPatterns.push(combo);
    }
  }

  //대각선(/) 콤보 체크 반복문
  // 0 0 1 2
  // 1 0 1 2
  // 2 0 1 2

  for (let row = 0; row <= boardSize - toWin; row++) {
    for (let col = toWin - 1; col < boardSize; col++) {
      const combo = [];
      for (let win = 0; win < toWin; win++) {
        combo.push([row + win, col - win]);
      }
      comboPatterns.push(combo);
    }
  }
}
