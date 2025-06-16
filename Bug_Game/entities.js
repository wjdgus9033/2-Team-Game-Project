import { updateGameState } from './game.js';
import { effects } from './effects.js';

const heartImage = new Image();
heartImage.src = "./img/heart.png";

const timeitemImage = new Image();
timeitemImage.src = "./img/time.png";

const bugImage = new Image();
bugImage.src = "./img/bug1.png";

const bugHitImage = new Image();
bugHitImage.src = "./img/d_bug.png";

let bugSpeed = 1.5;

export const entities = {
    bugs: [],
    items: [],

    spawnBug() {
        const bug = {
            x: Math.random() * (800 - 100),
            y: Math.random() * (600 - 100),
            size: 100,
            state: "alive",
            opacity: 1,
            image: bugImage,
            hitImage: bugHitImage,
            vx: (Math.random() - 0.5) * bugSpeed * 2,
            vy: (Math.random() - 0.5) * bugSpeed * 2
        };
        this.bugs.push(bug);
        setTimeout(() => {
            if (bug.state === "alive") bug.state = "dead";
        }, 3500);
    },

    spawnItem() {
        if (Math.random() > 0.5) return;  

        const type = Math.random() > 0.5 ? "life" : "time";
        const item = {
            x: Math.random() * (800 - 70),
            y: Math.random() * (600 - 70),
            size: 70,
            type: type,
            image: type === "life" ? heartImage : timeitemImage,
            opacity: 1,
            state: "alive",
            vx: (Math.random() - 0.5) * 0.9,
            vy: (Math.random() - 0.5) * 0.9
        };
        this.items.push(item);
        setTimeout(() => {
            item.state = "dead";
        }, 3000);
    },

    update(ctx, canvas) {
        this.bugs = this.bugs.filter(bug => bug.state !== "dead");
        this.items = this.items.filter(item => item.state !== "dead");

        this.bugs.forEach(bug => {
            ctx.globalAlpha = bug.opacity;

            if (bug.state === "alive") {
                bug.x += bug.vx;
                bug.y += bug.vy;

                if (bug.x < 0 || bug.x + bug.size > canvas.width) bug.vx *= -1;
                if (bug.y < 0 || bug.y + bug.size > canvas.height) bug.vy *= -1;

                ctx.drawImage(bug.image, bug.x, bug.y, bug.size, bug.size);
            } else if (bug.state === "hit") {
                ctx.drawImage(bug.hitImage, bug.x, bug.y, bug.size, bug.size);
                bug.opacity -= 0.05;
                if (bug.opacity <= 0) bug.state = "dead";
            }
        });

        ctx.globalAlpha = 1;

        this.items.forEach(item => {
            item.x += item.vx;
            item.y += item.vy;

            if (item.x < 0 || item.x + item.size > canvas.width) item.vx *= -1;
            if (item.y < 0 || item.y + item.size > canvas.height) item.vy *= -1;

            ctx.globalAlpha = item.opacity;
            ctx.drawImage(item.image, item.x, item.y, item.size, item.size);
        });

        ctx.globalAlpha = 1;
    },

    drawHeart(ctx, x, y) {
        ctx.drawImage(heartImage, x, y, 50, 50);
    },

    increaseBugSpeed(amount) {
        bugSpeed += amount;
    }
};

export function spawnBugWave(count) {
    for (let i = 0; i < count; i++) {
        entities.spawnBug();
    }
}

export function handleClick(mouseX, mouseY) {
    let hit = false;
    let itemhit = false;

    entities.bugs.forEach(bug => {
        if (bug.state === "alive" &&
            mouseX >= bug.x && mouseX <= bug.x + bug.size &&
            mouseY >= bug.y && mouseY <= bug.y + bug.size) {
            bug.state = "hit";
            hit = true;
            updateGameState('increaseScore');
            effects.push({
                x: mouseX,
                y: mouseY,
                text: "+1",
                color: "green",
                opacity: 1
            });
        }
    });

    if (!hit) {
        entities.items.forEach(item => {
            if (item.state === "alive" &&
                mouseX >= item.x && mouseX <= item.x + item.size &&
                mouseY >= item.y && mouseY <= item.y + item.size) {
                item.state = "dead";
                itemhit = true;

                if (item.type === "life") {
                    updateGameState('addLife');
                    effects.push({
                        x: mouseX,
                        y: mouseY,
                        text: "+1",
                        color: "red",
                        opacity: 1
                    });
                } else if (item.type === "time") {
                    updateGameState('addTime');
                    effects.push({
                        x: mouseX,
                        y: mouseY,
                        text: "+30초",
                        color: "blue",
                        opacity: 1
                    });
                }
            }
        });
    }

    return { hit, itemhit };
}
