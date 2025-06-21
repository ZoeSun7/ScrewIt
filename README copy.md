# Screw It! (螺了个螺) - 2D Puzzle Game Prototype

## Overview
A playable 2D prototype for the casual puzzle game "Screw It!". Unscrew, sort, and eliminate colored screws into matching toolboxes. Built with vanilla JavaScript and HTML5 Canvas.

## Quick Start
1. Place the project folder on your computer.
2. Open `index.html` in your browser (Chrome/Edge/Firefox recommended).
3. Play with mouse (or touchscreen on mobile).

## Controls
- **Unscrew:** Click/touch and make circular drag gestures on a screw to unscrew it.
- **Drag:** Once unscrewed, drag the screw to the matching colored toolbox at the bottom.
- **Eliminate:** Collect 3 screws of the same color in a toolbox to eliminate them and score points.
- **Timer:** The game ends when the timer reaches 0.

## File Structure
- `index.html` — Main HTML file
- `style.css` — Basic styles
- `audio.js` — Audio manager
- `screw.js` — Screw object
- `toolbox.js` — Toolbox object
- `main.js` — Main loop, input, rendering
- `assets/` — Placeholder sound files (add your own: `unscrew.mp3`, `clink.mp3`, `pop.mp3`)

## Notes
- All graphics and sounds are placeholders.
- For best experience, add your own sound files to the `assets/` folder. 