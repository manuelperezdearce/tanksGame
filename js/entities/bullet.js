
export class Bullet {

    constructor(canvas, canon) {

        this.dimensions = {
            w: 6,
            h: 10
        }
        this.width = 6
        this.height = 10
        this.speed = 500
        this.color = "#ebfc00"
        this.angle = canon.angle
        this.direction = {
            x: canon.direction.x,
            y: canon.direction.y
        }
        this.startPosition = {
            x: canon.exitPosition.x,
            y: canon.exitPosition.y
        }
        this.position = {
            x: this.startPosition.x,
            y: this.startPosition.y
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

    dibujarBala(context) {

        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);
        context.fillStyle = this.color;
        context.fillRect(
            0,
            -this.width / 2,
            this.height,
            this.width
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

}

