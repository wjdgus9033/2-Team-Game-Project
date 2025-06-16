export const effects = [];

export function drawEffects(ctx) {
    for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        ctx.save();
        ctx.globalAlpha = effect.opacity;
        ctx.fillStyle = effect.color;
        ctx.font = "28px 'Bagel Fat One', sans-serif";
        ctx.fillText(effect.text, effect.x, effect.y);
        ctx.restore();

        effect.y -= 1;
        effect.opacity -= 0.02;

        if (effect.opacity <= 0) {
            effects.splice(i, 1);
        }
    }
}
