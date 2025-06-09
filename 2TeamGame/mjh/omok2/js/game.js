// --------------- 참조 함수 --------------

function startFn() {
    this.canvas.width = 720;
    this.canvas.height = 720;
    this.cellSize = ((this.canvas.width+this.canvas.height)/2) / this.boardCell;
    this.context = this.canvas.getContext("2d");
    this.canvas.id = "game-board";
    this.canvas.addEventListener("click", handleClick);
    canvasWrapper.insertBefore(this.canvas, canvasWrapper.childNodes[0]);
    this.drawBoard();
    this.createBoardStatus();
    generateWinningCombos(this.boardCell,this.toWin);
    console.log(this.boardStatus);
}


function handleClick(e) {
  const rect = game.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor(x / game.cellSize);
  const row = Math.floor(y / game.cellSize);

  if (game.boardStatus[row][col] !== game.defaultValue || game.isOver) return;

  game.boardStatus[row][col] = game.activePlayer;

  game.drawStone(row, col, game.player[game.activePlayer].color);

  console.log(game.boardStatus[row]);

  checkGameOver(game.boardStatus, comboPatterns);

  game.switchPlayer();

}

function createBoardStatusFn() {
  this.boardStatus = Array.from({ length: this.boardCell }, () =>
    Array(this.boardCell).fill(this.defaultValue)
  );
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
    // 세로선
    ctx.beginPath();
    ctx.moveTo(cellSize / 2 + i * cellSize, cellSize / 2);
    console.log(cellSize / 2 + i * cellSize);
    ctx.lineTo(cellSize / 2 + i * cellSize, size - cellSize / 2);
    ctx.stroke();

    // 가로선
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
  if (playerNum === -1) {
    alert("Draw");
  }

  if (playerNum === 1) {
    alert("Win" + playerNum);
  } else {
    alert("Win" + playerNum);
  }
}

// -------------------승리 체크용 기능 함수--------------- -

function checkGameOver(status, combos) {
  game.currentRound++;
  if (game.currentRound === (19 * 19) - 1) {
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