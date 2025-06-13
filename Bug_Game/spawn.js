import {canvas} from './ui.js';
import {heartImage, timeitem} from './image.js';

export function spawnBugWave(count){
    for(let i =0; i<count; i++){
        bugs.push(createBug());
    }
}

export function spawnItem() {

    const random = Math.random();
    if (random > 0.5) return;

    const type = Math.random() > 0.5 ? "life" : "time";
    const item = {
        x: Math.random() * (canvas.width - 100),
        y: Math.random() * (canvas.height - 100),
        size: 70,
        type: type,
        image: type === "life" ? heartImage : timeitem,
        opacity: 1,
        state: "alive",
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9
    };
    items.push(item);

    setTimeout(() => {
        item.state = "dead";

    }, 3000);

}

function createBug() {

    const bug = {
        x: Math.random() * (canvas.width - 100),
        y: Math.random() * (canvas.height - 100),
        size: 100,
        state: "alive",
        opacity: 1,
        image: new Image(),
        hitImage: new Image(),
        vx: (Math.random() - 0.5) * bugSpeed * 2,
        vy: (Math.random() - 0.5) * bugSpeed * 2
    };
    bug.image.src = "img/bug1.png";
    bug.hitImage.src = "img/d_bug.png";
    
    setTimeout(() => {
        if (bug.state === "alive") bug.state = "dead";
    }, 3500);

    return bug;

}
