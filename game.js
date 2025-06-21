// Game state and logic for Screw It! prototype
let screws = [];
let toolboxes = [];
let score = 0;
let timer = 60;
let gameOver = false;

function resetGame() {
    screws = [];
    toolboxes = [];
    score = 0;
    timer = 60;
    gameOver = false;
    // Generate screws
    const screwArea = { x: 60, y: 120, w: 360, h: 320 };
    for (let i = 0; i < 12; i++) {
        let color = SCREW_COLORS[Math.floor(Math.random() * 3)];
        let x = screwArea.x + Math.random() * (screwArea.w - 56) + 28;
        let y = screwArea.y + Math.random() * (screwArea.h - 56) + 28;
        screws.push(new Screw(x, y, color));
    }
    // Create toolboxes
    const colors = ['red', 'blue', 'yellow'];
    for (let i = 0; i < 3; i++) {
        toolboxes.push(new Toolbox(40 + i * 140, 700, colors[i]));
    }
}

function updateGame() {
    if (gameOver) return;
    for (const tb of toolboxes) tb.update();
    if (timer > 0) {
        timer -= 1/60;
        if (timer <= 0) {
            timer = 0;
            gameOver = true;
        }
    }
}

function addScore(n) {
    score += n;
}

// Export for main.js
window.GameState = { screws, toolboxes, score, timer, gameOver, resetGame, updateGame, addScore }; 