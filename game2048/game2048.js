// 2048 게임 보드 크기
const size = 4;

// 게임 상태
let board = Array.from({ length: size }, () => Array(size).fill(0));
let score = 0;
let history = [];

// 숫자별 배경색 맵
const colorMap = {
  2: '#eee4da', 4: '#ede0c8', 8: '#f2b179',
  16: '#f59563', 32: '#f67c5f', 64: '#f65e3b',
  128: '#edcf72', 256: '#edcc61', 512: '#edc850',
  1024: '#edc53f', 2048: '#edc22e'
};

// 빈 칸에 2 또는 4를 랜덤으로 추가
function addRandomTile() {
  const empty = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] === 0) empty.push([r, c]);

  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// 보드를 화면에 그리기
function drawBoard() {
  const boardDiv = document.getElementById('game-board');
  const scoreSpan = document.getElementById('score');
  if (!boardDiv) return;

  boardDiv.innerHTML = '';
  board.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';

    row.forEach(cell => {
      const cellDiv = document.createElement('div');
      cellDiv.textContent = cell === 0 ? '' : cell;
      Object.assign(cellDiv.style, {
        width: '60px', height: '60px', margin: '5px',
        border: '2px solid black', borderRadius: '10px',
        background: colorMap[cell] || '#ffffff',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1em',
        fontWeight: 'bold', color: (cell <= 4) ? '#776e65' : '#fff'
      });
      rowDiv.appendChild(cellDiv);
    });

    boardDiv.appendChild(rowDiv);
  });

  if (scoreSpan) scoreSpan.textContent = score;
}

// 한 줄을 왼쪽으로 밀고 합치기
function slide(row) {
  let arr = row.filter(v => v);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(v => v);
  while (arr.length < size) arr.push(0);
  return arr;
}

// 2차원 배열을 왼쪽으로 90도 회전
function rotateLeft(mat) {
  return mat[0].map((_, i) => mat.map(row => row[size - 1 - i]));
}

// 보드 이동 처리
function move(dir) {
  const old = JSON.stringify(board);
  history.push(JSON.stringify({ board, score }));

  for (let i = 0; i < dir; i++) board = rotateLeft(board);
  board = board.map(slide);
  for (let i = 0; i < (4 - dir) % 4; i++) board = rotateLeft(board);

  if (JSON.stringify(board) !== old) {
    addRandomTile();
    drawBoard();
    if (checkWin()) {
      alert("축하합니다! 2048을 달성했습니다!");
    } else if (isGameOver()) {
      alert("게임 오버! 더 이상 이동할 수 없습니다.");
    }
  } else {
    history.pop(); // 변화 없을 경우 상태 되돌림
  }
}

// 게임 오버 체크
function isGameOver() {
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] === 0) return false;

  for (let r = 0; r < size; r++)
    for (let c = 0; c < size - 1; c++)
      if (board[r][c] === board[r][c + 1]) return false;

  for (let c = 0; c < size; c++)
    for (let r = 0; r < size - 1; r++)
      if (board[r][c] === board[r + 1][c]) return false;

  return true;
}

// 2048 달성 체크
function checkWin() {
  return board.some(row => row.includes(2048));
}

// Undo 기능
function undo() {
  if (history.length === 0) {
    alert("더 이상 되돌릴 수 없습니다.");
    return;
  }
  const last = JSON.parse(history.pop());
  board = JSON.parse(JSON.stringify(last.board));
  score = last.score;
  drawBoard();
}

// 게임 리셋
function reset2048() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  history = [];
  addRandomTile();
  addRandomTile();
  drawBoard();
}

// 키보드 이벤트 처리
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') move(0);
  else if (e.key === 'ArrowUp') move(1);
  else if (e.key === 'ArrowRight') move(2);
  else if (e.key === 'ArrowDown') move(3);
  else if (e.key === 'Escape') reset2048();
  else if (e.key.toLowerCase() === 'u') undo();
});

// 초기 시작
reset2048();