// effects.js
export const effects = [];

const smokeImage = new Image();
smokeImage.src = "./img/smoke.png";

export function drawEffects(ctx) {
    for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];

        ctx.save();

        if (effect.type === "smoke") {
            ctx.globalAlpha = effect.alpha;
            ctx.drawImage(smokeImage, effect.x - effect.size / 2, effect.y - effect.size / 2, effect.size, effect.size);
            effect.size += 1.5;
            effect.alpha -= 0.02;

            if (effect.alpha <= 0) {
                effects.splice(i, 1);
            }
        } else {
            ctx.globalAlpha = effect.opacity;
            ctx.fillStyle = effect.color || "white";
            ctx.font = "28px 'Bagel Fat One', sans-serif";
            ctx.fillText(effect.text, effect.x, effect.y);

            effect.y -= 1;
            effect.opacity -= 0.02;

            if (effect.opacity <= 0) {
                effects.splice(i, 1);
            }
        }

        ctx.restore();
    }
}
export function addSmokeEffect(x, y) {
    for (let i = 0; i < 30; i++) {  
        effects.push({
            type: "smoke",
            x: x + Math.random() * 100 - 50, 
            y: y + Math.random() * 100 - 50,
            size: 60 + Math.random() * 20,  
            alpha: 1
        });
    }
}
