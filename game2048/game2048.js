// 2048 게임 보드 크기
const size = 4;
// 2048 게임 보드 데이터(2차원 배열)
let board = Array.from({ length: size }, () => Array(size).fill(0));
// 점수 저장
let score = 0;
// 이전 상태 저장용 스택 (undo용)
let history = [];

// 빈 칸에 2 또는 4를 랜덤으로 추가
function addRandomTile() {
  let empty = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return;
  let [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// 보드를 화면에 그리기
function drawBoard() {
  const boardDiv = document.getElementById('game-board');
  boardDiv.innerHTML = '';
  board.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    row.forEach(cell => {
      const cellDiv = document.createElement('div');
      cellDiv.textContent = cell === 0 ? '' : cell;
      cellDiv.style.width = '60px';
      cellDiv.style.height = '60px';
      cellDiv.style.margin = '5px';
      cellDiv.style.border = '2px solid black';
      cellDiv.style.borderRadius = '10px';
      cellDiv.style.background = cell ? '#f2b179' : '#eee4da';
      cellDiv.style.display = 'flex';
      cellDiv.style.alignItems = 'center';
      cellDiv.style.justifyContent = 'center';
      cellDiv.style.fontSize = '1em';
      cellDiv.style.fontWeight = 'bold';
      rowDiv.appendChild(cellDiv);
    });
    boardDiv.appendChild(rowDiv);
  });

  // 점수 표시 업데이트
  document.getElementById('score').textContent = score;
}

// 한 줄을 왼쪽으로 합치는 로직
function slide(row) {
  let arr = row.filter(v => v);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i]; // 점수 추가
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(v => v);
  while (arr.length < size) arr.push(0);
  return arr;
}

// 보드를 왼쪽으로 회전 (방향키 처리를 위해)
function rotateLeft(mat) {
  return mat[0].map((_, i) => mat.map(row => row[size - 1 - i]));
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
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] === 2048) return true;
  return false;
}

// 보드 이동
function move(dir) {
  const old = JSON.stringify(board);
  // 이전 상태 저장 (undo용)
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
    // 이동 없으면 방금 저장한 상태 되돌리기
    history.pop();
  }
}

// Undo 기능
function undo() {
  if (history.length === 0) {
    alert("더 이상 되돌릴 수 없습니다.");
    return;
  }
  const last = JSON.parse(history.pop());
  board = last.board;
  score = last.score;
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

// 2048 게임 리셋 함수
function reset2048() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  history = [];
  addRandomTile();
  addRandomTile();
  drawBoard();
}

// 초기 시작
reset2048();