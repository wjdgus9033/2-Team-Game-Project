// --------------- 참조 함수 --------------

function gameInitFn() {
  this.context = null;
  this.boardStatus = [];
  this.currentRound = 0;
  this.activePlayer = 1;
  this.isOver = false;
  for (const player of Object.values(this.player)) {
    player.score = 0;
  }
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
  this.currentRound++;
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
  const ctx = this.context;
  const cellSize = this.cellSize;
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
  timerStatus.playerDefaultTime = Date.now();
}

function gameOverFn(player) {
  this.isOver = true;
  this.activePlayer = player === -1 ? -1 : player;
  clearInterval(timerStatus.timer);
  createStart();
}

// ------------------- 객체 외부 함수 -------------------

function handleClick(e) {
  const rect = game.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor(x / game.cellSize);
  const row = Math.floor(y / game.cellSize);

  if (game.boardStatus[row][col] !== game.defaultValue) return;

  game.boardStatus[row][col] = game.activePlayer;

  game.drawStone(row, col, game.player[game.activePlayer].color);

  checkMate(game.boardStatus, row, col, game.boardCell, game.toWin);
  if (!game.isOver) {
    game.currentRound++;
    game.switchPlayer();
    updateTurnUI(game.activePlayer);
  }
}

function handleHover(e) {
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

// ------------------- 게임 상단 유저인터페이스 변경 전용 ------------------

function updateScore(player, cnt, sec) {
  let addTimeScore = -Math.abs(sec - Math.floor(sec / 2));
  let addComboScore = cnt * 5;

  if (sec <= 10 && sec > 5) {
    game.player[player].score += 5 + addComboScore;
  } else if (sec <= 5) {
    game.player[player].score += 10 + addComboScore;
  } else {
    game.player[player].score += addComboScore + addTimeScore;
  }

  playerScoreEl[
    player - 1
  ].innerHTML = `${game.player[player].name}돌 점수 <br/>${game.player[player].score}`;
}

function updateTimeUIFn() {
  this.startTime = Date.now();
  this.playerDefaultTime = Date.now();
  this.timer = setInterval(() => {
    this.playerDisplayTime = Math.floor(
      (Date.now() - this.playerDefaultTime) / 1000
    );
    let nowSec = Math.floor((Date.now() - this.startTime) / 1000);
    this.mainDisplaySec = nowSec % 60;
    this.mainDisplayMin = Math.floor(nowSec / 60);
    timeDisplayEl.textContent =
      this.mainDisplayMin > 0
        ? `${this.mainDisplayMin}분${this.mainDisplaySec}초`
        : `${this.mainDisplaySec}초`;

    if (game.activePlayer === 1) {
      player1timeEl.textContent = this.playerDisplayTime;
      player2timeEl.textContent = "";
    } else if (game.activePlayer === 2) {
      player2timeEl.textContent = this.playerDisplayTime;
      player1timeEl.textContent = "";
    }

    if (this.playerDisplayTime > 30) {
      game.currentRound++;
      game.switchPlayer();
      updateTurnUI(game.activePlayer);
    }
  }, 16.67);
  this.timer;
}

function updateTurnUI(player) {
  if (player === 0) {
    return;
  }
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

// ------------------ 패턴검사로직 테스트 ------------------------

function isOutOfBounds(row, col, boardCell) {
  return row < 0 || col < 0 || row >= boardCell || col >= boardCell;
}

function checkMate(board, row, col, boardCell, toWin) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  let score = 1;

  if (game.currentRound === Math.pow(boardCell, 2)) {
    return game.gameOver(-1);
  }

  const target = board[row][col];

  for (const [dRow, dCol] of directions) {
    let cnt = 1;
    let nRow = row + dRow;
    let nCol = col + dCol;
    while (
      !isOutOfBounds(nRow, nCol, boardCell) &&
      board[nRow][nCol] === target
    ) {
      cnt++;
      score++;
      nRow += dRow;
      nCol += dCol;
    }

    nRow = row - dRow;
    nCol = col - dCol;
    while (
      !isOutOfBounds(nRow, nCol, boardCell) &&
      board[nRow][nCol] === target
    ) {
      cnt++;
      score++;
      nRow -= dRow;
      nCol -= dCol;
    }

    if (cnt >= toWin) {
      updateScore(target, 50, timerStatus.playerDisplayTime);
      return game.gameOver(target);
    }
  }
  updateScore(target, score, timerStatus.playerDisplayTime);
  return;
}
