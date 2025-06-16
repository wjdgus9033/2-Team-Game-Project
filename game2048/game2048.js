// 2048 게임 보드 크기
const size = 4;
// 2048 게임 보드 데이터(2차원 배열)
let board = Array.from({ length: size }, () => Array(size).fill(0));

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
}

// 한 줄을 왼쪽으로 합치는 로직
function slide(row) {
    let arr = row.filter(v => v);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
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

// 방향키 입력에 따라 보드 이동
function move(dir) {
    let old = JSON.stringify(board);
    for (let i = 0; i < dir; i++) board = rotateLeft(board);
    board = board.map(slide);
    for (let i = 0; i < (4 - dir) % 4; i++) board = rotateLeft(board);
    if (JSON.stringify(board) !== old) addRandomTile();
    drawBoard();
}

// 키보드 이벤트 처리
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') move(0);   // 왼쪽
    if (e.key === 'ArrowUp') move(1);     // 위
    if (e.key === 'ArrowRight') move(2);  // 오른쪽
    if (e.key === 'ArrowDown') move(3);   // 아래
    if (e.key === 'Escape') reset2048();  // ESC 누르면 리셋
});

// 2048 게임 리셋 함수
function reset2048() {
    board = Array.from({ length: size }, () => Array(size).fill(0));
    addRandomTile();
    addRandomTile();
    drawBoard();
}

// 게임 시작 시 타일 2개 추가 후 보드 그리기
addRandomTile();
addRandomTile();
drawBoard();