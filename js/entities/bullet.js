
export class Bullet {

    constructor(canvas, shotData) {

        this.dimensions = {
            w: 6,
            h: 10
        }
        this.dimensions = {
            w: 6, h: 10
        }
        this.speed = 500 + shotData.speedPlus
        this.color = "#ebfc00"
        this.angle = shotData.angle
        this.direction = {
            x: shotData.direction.x,
            y: shotData.direction.y
        }
        this.position = {
            x: shotData.position.x,
            y: shotData.position.y
        }
        this.canvas = canvas
        this.isAlive = true
        this.damage = 1
    }

    update(deltaTime) {

        const desplazamiento = this.speed * deltaTime

        this.position.x = this.position.x + this.direction.x * desplazamiento
        this.position.y = this.position.y + this.direction.y * desplazamiento

        this.estaFueraDelCanvas()
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

    estaFueraDelCanvas() {
        try {
            if (this.position.x > this.canvas.width ||
                this.position.x < 0 ||
                this.position.y > this.canvas.height ||
                this.position.y < 0
            ) {
                this.isAlive = false
            }

        } catch (error) {
            console.log(`Falló validación de fuera de canvas ${error}`)
        }
    }

    getHitbox() {
        return {
            x: this.position.x - this.dimensions.w / 2,
            y: this.position.y - this.dimensions.h / 2,
            w: this.dimensions.w,
            h: this.dimensions.h
        };
    }
}

