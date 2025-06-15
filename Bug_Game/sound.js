const soundFiles = {
    hit: "./sound/hitsound.mp3",
    fail: "./sound/failhit.mp3",
    itemhit: "./sound/itemhitsound.mp3",
    background: "./sound/background.mp3"
};

const sounds = {};
for (const key in soundFiles) {
    sounds[key] = new Audio(soundFiles[key]);
    sounds[key].volume = 0.7;
}

export const backgroundSound = sounds.background;

export function playSound(name) {
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play();
    }
}
