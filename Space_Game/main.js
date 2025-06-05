
// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d")
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

// 시간 변수
let startTime = null;
let elapsedTime = 0;
// 점수
let score = 0;
// 우주선좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64; // 이미지 높이만큼 위로 올라오게 한것

let gameover = false; //true면 끝 false면 게임 중

// 이미지 가져오기
let backgroundspaceImage, gameoverImage, planetImage, spaceshipImage, bulletImage;

// 총알 배열
let bulletList = [];
// 총알 좌표
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = spaceshipX + 24;
        this.y = spaceshipY;
        this.alive = true;
        bulletList.push(this);
    }
    this.update = function () {
        this.y -= 7;
    }
    this.checkHit = function () {
        for (let i = 0; i < enemyList.length; i++) {
            const e = enemyList[i];
            const bulletW = 10; // 총알 너비
            const bulletH = 20; // 총알 높이
            const enemyW = 40;  // 행성 너비
            const enemyH = 40;  // 행성 높이

            const isHit = this.x < e.x + enemyW &&
                this.x + bulletW > e.x &&
                this.y < e.y + enemyH &&
                this.y + bulletH > e.y;

            if (isHit) {
                score++;
                this.alive = false;
                enemyList.splice(i, 1);
                break; // 하나 맞으면 끝
            }
        }
    }
}

// 행성 생성 좌표
function randomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
}
// 행성
let enemyList = [];
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.y = 0;
        this.x = randomValue(0, canvas.width - 49);
        enemyList.push(this);
    }
    this.update = function () {
        this.y += 3; // 떨어지는 속도 올라갈 수록 빠름

        const spaceshipW = 64;
        const spaceshipH = 64;
        const enemyW = 40;
        const enemyH = 40;
        const iscrash = this.x < spaceshipX + spaceshipW &&
            this.x + enemyW > spaceshipX &&
            this.y < spaceshipH + spaceshipY &&
            this.y + enemyH > spaceshipY;

        if (iscrash) {
            gameover = true;
        }
        if (this.y >= canvas.height - 49) {
            gameover = true;
        }
    }
}
// 이미지 로딩
function loadImage() {
    backgroundspaceImage = new Image();
    backgroundspaceImage.src = "images/backgroundspace.jpg";

    gameoverImage = new Image();
    gameoverImage.src = "images/gameover.png";

    planetImage = new Image();
    planetImage.src = "images/planet.png";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png"

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";
}

// 이미지 보여주는 함수
function render() {
    ctx.drawImage(backgroundspaceImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY,);

    // 버튼 추가
    ctx.fillStyle = "white";
    ctx.font = "20px Arial"
    ctx.fillText(`Score:${score}`, 10, 25);

    // 시계 추가
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(`Time: ${elapsedTime}s`, 10, canvas.height - 10);

    // 총알 크기, 총알 이미지생성
    const bulletWidth = 10
    const bulletHeight = 20;
    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y, bulletWidth, bulletHeight);
        }
    }

    // 행성 이미지생성
    for (let i = 0; i < enemyList.length; i++) {
        ctx.drawImage(planetImage, enemyList[i].x, enemyList[i].y);
    }
}

// 실행
function main() {
    if (!startTime) startTime = Date.now();
    if (!gameover) {
        update();
        render();
        elapsedTime = Math.floor((Date.now() - startTime) / 1000); // 시간 업데이트
        requestAnimationFrame(main);
    } else {
        clearInterval(enemyInterval);
        ctx.drawImage(gameoverImage, 50, 150, 300, 300);

        // 다시 시작 버튼 생성
        const canvasRect = canvas.getBoundingClientRect(); // 이걸로 캔버스 위치 알려줌
        const button = document.getElementById("restart");

        button.style.left = (canvasRect.left + canvas.width / 2) + "px"; //왼쪽으로 부터 캔버스 가운데 위치
        button.style.top = (canvasRect.top + 450) + "px"; //위에서 부터 얼마나 내려올지
        button.style.transform = "translateX(-50%)"; //가운데 정렬
        button.style.display = "block";
    }

}
// 게임시작시 화면에 버튼 안보이게해줌
function resetGame() {
    score = 0;
    gameover = false;
    bulletList = [];
    enemyList = [];
    canShoot = true;
    document.getElementById("restart").style.display = "none";
    createEnemy();
    main();
    // 시간 초기화
    startTime = null;
    elapsedTime = 0;
}

// 총 발쏴
function createBullet() {
    let b = new Bullet();
    b.init();
}

// 초당 행성 생성
let enemyInterval;
function createEnemy() {
    enemyInterval = setInterval(() => {
        if (!gameover) {
            let e = new Enemy();
            e.init();
        }
    }, 1000);
}
// 키보드
const keys = {
    ArrowLeft: false,
    ArrowRight: false
};
// 키 눌렀을때
let canShoot = true;
document.addEventListener("keydown", (e) => {
    if (e.code in keys) {
        keys[e.code] = true;
    }
    // 스페이스바(총알 발사)는 따로 처리
    if (e.code === "Space" && canShoot) {
        createBullet();
        canShoot = false;
    }
});
// 키 땠을떄
document.addEventListener("keyup", (e) => {
    if (e.code in keys) {
        keys[e.code] = false;
    }
    if (e.code === "Space") {
        canShoot = true; // 키를 뗐을 때 다시 발사 허용
    }
});

function update() {
    // if (keys.ArrowRight) {
    //     spaceshipX += 5;
    // }
    // if (keys.ArrowLeft) {
    //     spaceshipX -= 5;
    // }
    const speed = 5;
    if (keys.ArrowRight) spaceshipX += speed;
    if (keys.ArrowLeft) spaceshipX -= speed;


    // 우주선이 왼쪽 오른쪽 밖으로 안나가게
    if (spaceshipX <= 0) {
        spaceshipX = 0;
    }
    if (spaceshipX >= canvas.width - 64) {
        spaceshipX = canvas.width - 64;
    }
    // 총알 이동 및 충돌 체크
    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }
    // 총알 화면 벗어나면 제거
    bulletList = bulletList.filter(b => b.y > 0 && b.alive);

    // 행성 움직이기
    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }
}

loadImage();
createEnemy();
main();
