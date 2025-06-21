// Audio manager for Screw It! prototype
const AudioManager = {
    sounds: {
        unscrew: new Audio('assets/unscrew.mp3'),
        clink: new Audio('assets/clink.mp3'),
        pop: new Audio('assets/pop.mp3'),
    },
    play(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    }
}; 