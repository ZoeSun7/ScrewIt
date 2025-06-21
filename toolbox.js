// Toolbox class for Screw It! prototype
class Toolbox {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color; // 'red', 'blue', 'yellow'
        this.width = 90;
        this.height = 48;
        this.collected = [];
        this.flashTimer = 0;
    }

    containsPoint(px, py) {
        return px > this.x && px < this.x + this.width && py > this.y && py < this.y + this.height;
    }

    collect(screw) {
        this.collected.push(screw);
        if (this.collected.length === 3) {
            this.eliminate();
            return true;
        }
        return false;
    }

    eliminate() {
        this.collected = [];
        this.flashTimer = 12;
        AudioManager.play('pop');
    }

    update() {
        if (this.flashTimer > 0) this.flashTimer--;
    }

    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.flashTimer > 0 ? 0.7 + 0.3 * Math.sin(this.flashTimer) : 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.color.charAt(0).toUpperCase() + this.color.slice(1), this.x + this.width/2, this.y + 20);
        // Collected screws
        for (let i = 0; i < this.collected.length; i++) {
            ctx.beginPath();
            ctx.arc(this.x + 25 + i*20, this.y + 38, 10, 0, 2*Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }
        ctx.restore();
    }
} 