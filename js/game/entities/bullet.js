
export class Bullet {

    constructor(shotData) {

        this.initialSpeed = 500
        this.team = shotData.team
        this.speed = this.calculateFinalSpeed(this.initialSpeed, shotData.speedPlus)

        this.color = this.team === "ally" ? "#ebfc00" : "#ff0d00"
        this.direction = {
            x: shotData.direction.x,
            y: shotData.direction.y
        }
        this.dimensions = {
            w: 6, h: 10
        }
        this.position = {
            x: shotData.position.x,
            y: shotData.position.y
        }
        this.angle = shotData.angle
        this.isAlive = true
        this.damage = 1
    }

    update(deltaTime) {

        const desplazamiento = this.speed * deltaTime

        this.position.x = this.position.x + this.direction.x * desplazamiento
        this.position.y = this.position.y + this.direction.y * desplazamiento
    }

    draw(context) {

        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);
        context.fillStyle = this.color;
        context.fillRect(
            -this.dimensions.h / 2,
            -this.dimensions.w / 2,
            this.dimensions.h,
            this.dimensions.w
        );
        context.restore();
    }

    /// ACTIONS

    destroy() {
        this.isAlive = false
    }

    /// UTILITIES

    calculateFinalSpeed(initialSpeed, speedPlus) {
        const penalization = this.team === "ally" ? 1 : 0.5
        return initialSpeed * speedPlus * penalization
    }
}

