export class Enemy {
    constructor() {
        this.dimensions = {
            w: 30,
            h: 30
        }
        this.position = {
            x: 100,
            y: 100
        }
        this.health = 3
        this.speed = 10
        this.color = "#f30808"
        this.isAlive = true
    }

    update(deltatime) {


        //// calcular y actualizar nueva posición
        const desplazamiento = this.speed * deltatime
        this.position.x = this.position.x + desplazamiento
        this.position.y = this.position.y + desplazamiento
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(
            this.position.x,
            this.position.y,
            this.dimensions.w,
            this.dimensions.h
        );

        context.fillStyle = "white";
        context.font = "20px Arial";
        context.fillText(
            this.health,
            this.position.x + this.dimensions.w / 3,
            this.position.y + this.dimensions.h / 1.5
        );

    }


    /// Comprobar si esta vivo
    checkIsAlive() {
        if (this.health <= 0)
            this.isAlive = false
    }

    takeDamage(damage) {
        this.health -= damage
        this.checkIsAlive()
    }


}