// Main game loop and input for Screw It! prototype
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const gameOverEl = document.getElementById('gameOver');

const COLORS = ['red', 'blue', 'yellow'];
let screws = [];
let toolboxes = [];
let draggingScrew = null;
let dragStartAngle = 0;
let lastPointer = {x: 0, y: 0};
let score = 0;
let timeLeft = 60;
let gameOver = false;
let timerInterval = null;

function setup() {
  // Place screws randomly in the upper area
  screws = [];
  for (let i = 0; i < 12; i++) {
    let color = COLORS[Math.floor(Math.random() * COLORS.length)];
    let placed = false;
    let tries = 0;
    while (!placed && tries < 100) {
      let x = 80 + Math.random() * 240;
      let y = 80 + Math.random() * 180;
      let overlap = screws.some(s => Math.hypot(s.x - x, s.y - y) < 48);
      if (!overlap) {
        screws.push(new Screw(x, y, color));
        placed = true;
      }
      tries++;
    }
  }
  // Toolboxes at the bottom
  toolboxes = [
    new Toolbox(30, 520, 'red'),
    new Toolbox(155, 520, 'blue'),
    new Toolbox(280, 520, 'yellow'),
  ];
  score = 0;
  timeLeft = 60;
  gameOver = false;
  gameOverEl.style.display = 'none';
  updateUI();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!gameOver) {
      timeLeft--;
      updateUI();
      if (timeLeft <= 0) endGame();
    }
  }, 1000);
}

function updateUI() {
  scoreEl.textContent = `Score: ${score}`;
  timerEl.textContent = `Time: ${timeLeft}s`;
}

function endGame() {
  gameOver = true;
  gameOverEl.style.display = 'block';
  clearInterval(timerInterval);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw background workstation
  ctx.save();
  ctx.fillStyle = '#444';
  ctx.fillRect(30, 60, 340, 320);
  ctx.restore();
  // Draw screws
  for (const screw of screws) {
    if (screw.state !== 'collected') screw.render(ctx);
  }
  // Draw toolboxes
  for (const box of toolboxes) {
    box.update();
    box.render(ctx);
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener('pointerdown', e => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  lastPointer = {x, y};
  for (const screw of screws) {
    if (screw.containsPoint(x, y)) {
      if (screw.state === 'attached') {
        screw.startUnscrewing();
        dragStartAngle = Math.atan2(y - screw.y, x - screw.x) - screw.rotation;
        draggingScrew = screw;
      } else if (screw.state === 'unscrewed') {
        screw.startDragging(x - screw.x, y - screw.y);
        draggingScrew = screw;
      }
      break;
    }
  }
});

document.addEventListener('pointermove', e => {
  if (gameOver || !draggingScrew) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  if (draggingScrew.state === 'unscrewing') {
    // Calculate angle delta for unscrewing
    const prevAngle = Math.atan2(lastPointer.y - draggingScrew.y, lastPointer.x - draggingScrew.x);
    const currAngle = Math.atan2(y - draggingScrew.y, x - draggingScrew.x);
    let delta = currAngle - prevAngle;
    // Normalize delta to [-PI, PI]
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    draggingScrew.updateUnscrewing(delta);
    if (draggingScrew.state === 'unscrewed') {
      draggingScrew.startDragging(x - draggingScrew.x, y - draggingScrew.y);
    }
  } else if (draggingScrew.state === 'unscrewed' && draggingScrew.isDragging) {
    draggingScrew.x = x - draggingScrew.offsetX;
    draggingScrew.y = y - draggingScrew.offsetY;
  }
  lastPointer = {x, y};
});

document.addEventListener('pointerup', e => {
  if (gameOver || !draggingScrew) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  if (draggingScrew.state === 'unscrewed' && draggingScrew.isDragging) {
    // Check if over a toolbox
    let matched = false;
    for (const box of toolboxes) {
      if (box.containsPoint(x, y)) {
        if (box.color === draggingScrew.color) {
          draggingScrew.state = 'collected';
          draggingScrew.stopDragging();
          matched = true;
          if (box.collect(draggingScrew)) {
            score++;
            updateUI();
          }
          break;
        } else {
          // Bounce back
          draggingScrew.x = Math.max(60, Math.min(draggingScrew.x, 340));
          draggingScrew.y = Math.max(80, Math.min(draggingScrew.y, 320));
          draggingScrew.stopDragging();
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      // Drop in play area
      draggingScrew.x = Math.max(60, Math.min(draggingScrew.x, 340));
      draggingScrew.y = Math.max(80, Math.min(draggingScrew.y, 320));
      draggingScrew.stopDragging();
    }
  }
  draggingScrew = null;
});

// Touch support for mobile
canvas.addEventListener('touchstart', e => e.preventDefault());
canvas.addEventListener('touchmove', e => e.preventDefault());
canvas.addEventListener('touchend', e => e.preventDefault());

setup();
gameLoop(); 