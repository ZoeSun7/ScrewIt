// Screw class for Screw It! prototype
const SCREW_COLORS = ['red', 'blue', 'yellow'];

class Screw {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color; // 'red', 'blue', 'yellow'
        this.radius = 22;
        this.state = 'attached'; // attached, unscrewing, unscrewed, collected
        this.rotation = 0;
        this.unscrewProgress = 0; // 0 to 1
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    containsPoint(px, py) {
        return Math.hypot(px - this.x, py - this.y) < this.radius;
    }

    startUnscrewing() {
        if (this.state === 'attached') {
            this.state = 'unscrewing';
            this.unscrewProgress = 0;
        }
    }

    updateUnscrewing(deltaAngle) {
        if (this.state === 'unscrewing') {
            this.rotation += deltaAngle;
            this.unscrewProgress += Math.abs(deltaAngle) / (2 * Math.PI * 2); // 2 full turns
            if (this.unscrewProgress >= 1) {
                this.state = 'unscrewed';
                AudioManager.play('clink');
            } else {
                AudioManager.play('unscrew');
            }
        }
    }

    startDragging(offsetX, offsetY) {
        if (this.state === 'unscrewed') {
            this.isDragging = true;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
        }
    }

    stopDragging() {
        this.isDragging = false;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        // Screw body
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.state === 'unscrewed' ? 0.7 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;
        // Screw head (cross)
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
        ctx.moveTo(0, -10); ctx.lineTo(0, 10);
        ctx.stroke();
        // Progress ring
        if (this.state === 'unscrewing') {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 6, -Math.PI/2, -Math.PI/2 + 2 * Math.PI * this.unscrewProgress);
            ctx.strokeStyle = '#fff8';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.restore();
    }
} 