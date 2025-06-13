function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bugs = bugs.filter((bug) => bug.state !== "dead");

    bugs.forEach((bug) => {
        ctx.globalAlpha = bug.opacity;

        if (bug.state === "alive") {

            bug.x += bug.vx;
            bug.y += bug.vy;

            if (bug.x < 0 || bug.x + bug.size > canvas.width) {
                bug.vx *= -1;
            }
            if (bug.y < 0 || bug.y + bug.size > canvas.height) {
                bug.vy *= -1;
            }

            ctx.drawImage(bug.image, bug.x, bug.y, bug.size, bug.size);
        } else if (bug.state === "hit") {
            ctx.drawImage(bug.hitImage, bug.x, bug.y, bug.size, bug.size);
            bug.opacity -= 0.05;
        }
        items = items.filter(item => item.state != "dead");

        items.forEach(item => {
            ctx.globalAlpha = item.opacity;
            item.x += item.vx;
            item.y += item.vy;

            if (item.x < 0 || item.x + item.size > canvas.width) item.vx *= -1;
            if (item.y < 0 || item.y + item.size > canvas.height) item.vy *= -1;

            ctx.drawImage(item.image, item.x, item.y, item.size, item.size);
        });
        ctx.restore();

    });

    ctx.save();
    ctx.font = "22px 'Bagel Fat One', sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";

    ctx.fillText(`모기 ${score} 마리 퇴치`, canvas.width - 10, 30);
    ctx.fillText(`최고점수 : ${highScore}`, canvas.width - 10, 60);
    ctx.fillText(`남은시간 : ${timeLeft}`, canvas.width - 10, 90);
    ctx.fillText(`레벨 :  ${currentLevel}`, canvas.width - 10 , 120 );

    ctx.restore();

    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, 10 + i * 40, 10, 50, 50);
    }

    if (!isGameOver) {
        requestAnimationFrame(draw);
    }

    effects = effects.filter(effect => effect.opacity > 0);

    effects.forEach(effect => {
        ctx.globalAlpha = effect.opacity;
        ctx.fillStyle = effect.color;
        ctx.font = "40px 'Bagel Fat One', cursive";
        ctx.fillText(effect.text, effect.x, effect.y);

        effect.y -= 1;
        effect.opacity -= 0.02;
    });
}