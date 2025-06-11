
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
// 보스 총알
let bossBulletList = [];

// 이미지 가져오기
let backgroundspaceImage, gameoverImage, alienImage, spaceshipImage, bulletImage, bossalienImage;

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
        this.y -= 5;
    }
    this.checkHit = function () {
        for (let i = 0; i < alienList.length; i++) {
            const e = alienList[i];
            if (!e.alive) continue;

            const bulletW = 10; // 총알 너비
            const bulletH = 20; // 총알 높이
            const alienW = 64;  // 외계인 너비
            const alienH = 64;  // 외계인 높이

            const isHit = this.x < e.x + alienW &&
                this.x + bulletW > e.x &&
                this.y < e.y + alienH + 5 && //하단
                this.y + bulletH > e.y - 5; //상단

            if (isHit) {
                score++;
                this.alive = false;
                e.alive = false;
                break; // 하나 맞으면 끝
            }
        }
        // 보스 충돌 체크
        for (let j = 0; j < bossList.length; j++) {
            const boss = bossList[j];
            if (!boss.alive) continue;

            const bulletW = 10;
            const bulletH = 20;

            const isHitBoss = this.x < boss.x + boss.width &&
                this.x + bulletW > boss.x &&
                this.y < boss.y + boss.height &&
                this.y + bulletH > boss.y;

            if (isHitBoss) {
                this.alive = false;
                boss.hit(); // ← 보스 체력 줄이기
                break;
            }
        }
    }
}

// 보스 생성
let bossList = [];
function bossalien() {
    this.x = canvas.width / 2 - 64;
    this.y = 0;
    this.width = 128;
    this.height = 128;
    this.hp = 10;
    this.alive = true;
    this.update = function () {
        this.y += 1; // 천천히 내려옴
        if (this.y > 150) this.y = 150; // 고정 위치
    };

    this.hit = function () {
        this.hp--;
        if (this.hp <= 0) {
            this.alive = false;
            score += 5;
        }
    };
}

// 보스 총알 
function BossBullet(x, y) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 16;
    this.alive = true;

    this.update = function () {
        this.y += 4; // 아래로 이동

        const spaceshipW = 64;
        const spaceshipH = 64;
        const isHit = this.x < spaceshipX + spaceshipW &&
            this.x + this.width > spaceshipX &&
            this.y < spaceshipY + spaceshipH &&
            this.y + this.height > spaceshipY;

        if (isHit) {
            gameover = true;
        }

        if (this.y > canvas.height) {
            this.alive = false;
        }
    };
}
// 외계인 생성 좌표
function randomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
}
// 외계인
let alienList = [];
function alien() {
    this.x = 0;
    this.y = 0;
    this.alive = true;
    this.init = function () {
        this.y = 0;
        this.x = randomValue(0, canvas.width - 49);
        alienList.push(this);
    }
    this.update = function () {
        this.y += 3; // 떨어지는 속도 올라갈 수록 빠름

        const spaceshipW = 64;
        const spaceshipH = 64;
        const alienW = 64;
        const alienH = 64;
        const iscrash = this.x < spaceshipX + spaceshipW &&
            this.x + alienW > spaceshipX &&
            this.y < spaceshipH + spaceshipY &&
            this.y + alienH > spaceshipY;
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

    alienImage = new Image();
    alienImage.src = "images/alien.png";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png"

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    bossalienImage = new Image();
    bossalienImage.src = "images/bossalien.png"
}

// 이미지 보여주는 함수
function render() {
    ctx.drawImage(backgroundspaceImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

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

        // ctx.strokeStyle = "red";
        // ctx.strokeRect(bulletList[i].x, bulletList[i].y, bulletWidth, bulletHeight); //총알 표시
    }

    // 외계인 이미지생성
    for (let i = 0; i < alienList.length; i++) {
        if (alienList[i].alive) {
            ctx.drawImage(alienImage, alienList[i].x, alienList[i].y);
        }

        // ctx.strokeStyle = "lime";
        // ctx.strokeRect(alienList[i].x, alienList[i].y, 64, 64); //충돌 박스 표시
    }
    // 보스 그리기
    for (let i = 0; i < bossList.length; i++) {
        const b = bossList[i];
        if (b.alive) {
            ctx.drawImage(bossalienImage, b.x, b.y, b.width, b.height);

            // 보스 체력 표시
            ctx.fillStyle = "red";
            ctx.fillRect(b.x, b.y - 10, b.width * (b.hp / 10), 5); // 체력바
            ctx.strokeStyle = "white";
            ctx.strokeRect(b.x, b.y - 10, b.width, 5);
        }
    }
    // 보스 총알
    ctx.fillStyle = "orange";
    for (let i = 0; i < bossBulletList.length; i++) {
        const b = bossBulletList[i];
        if (b.alive) {
            ctx.fillRect(b.x, b.y, b.width, b.height);
        }
    }
}
let restart;
// 실행
function main() {
    if (!startTime) startTime = Date.now();
    if (!gameover) {
        update();
        render();
        restart = requestAnimationFrame(main);
    } else {
        cancelAnimationFrame(restart);
        clearInterval(alienInterval);
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
    cancelAnimationFrame(restart); // 중복 방지

    score = 0; // 점수 초기화
    gameover = false;
    bulletList = []; // 총알 초기화
    alienList = []; // 외계인 삭제
    canShoot = true;
    startTime = null;
    elapsedTime = 0;
    bossBulletList = []; // 보스 총알 초기화
    bossList = []; // 보스 초기화
    lastBossTime = 0 // 보스 리스폰 초기화
    document.getElementById("restart").style.display = "none";
    createAlien();
    main();
}

// 총 발쏴
function createBullet() {
    let b = new Bullet();
    b.init();
}

// 초당 외계인 생성
let alienInterval;
function createAlien() {
    alienInterval = setInterval(() => {
        if (!gameover) {
            let e = new alien();
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
// 보스 10초마다 생성
let lastBossTime = 0;

function checkBossSpawn() {
    if (!gameover && elapsedTime >= lastBossTime + 10) {
        const boss = new bossalien();
        bossList.push(boss);
        lastBossTime = elapsedTime;
    }
}

function update() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000); // 시간 업데이트

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

    // 외계인 움직이기
    for (let i = 0; i < alienList.length; i++) {
        alienList[i].update();
    }

    alienList = alienList.filter(e => e.alive);
    // 총알 화면 벗어나면 제거
    bulletList = bulletList.filter(b => b.y > 0 && b.alive);

    checkBossSpawn();

    // 보스 업데이트
    for (let i = 0; i < bossList.length; i++) {
        if (bossList[i].alive) {
            bossList[i].update();
        }
        // 보스 공격: 총알 발사
        if (Math.random() < 0.02) { // 2% 확률로 매 프레임 발사 (약 1초당 1~2발)
            bossBulletList.push(new BossBullet(bossList[i].x + bossList[i].width / 2 - 4, bossList[i].y + bossList[i].height));
        }
    }
    bossList = bossList.filter(b => b.alive);
    // 보스총알 제거, 업데이트
    for (let i = 0; i < bossBulletList.length; i++) {
        if (bossBulletList[i].alive) {
            bossBulletList[i].update();
        }
    }
    bossBulletList = bossBulletList.filter(b => b.alive);


}

loadImage();
createAlien();
main();
