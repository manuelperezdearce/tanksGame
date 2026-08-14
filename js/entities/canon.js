export class Canon {
    constructor() {
        this.width = 10
        this.height = 50
        this.speed = 800
        this.color = "#054d1d"
        this.angle = 0
        this.direction = {
            x: 0,
            y: 0
        }
        this.startPosition = {
            x: 0,
            y: 0
        }
        this.exitPosition = {
            x: 0,
            y: 0
        }

    }

    dibujarCanon(context) {

        context.save();
        context.translate(this.startPosition.x, this.startPosition.y);
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

    calcularPosicionCanon(mousePosition, player) {

        this.startPosition.x = player.playerCenterX;
        this.startPosition.y = player.playerCenterY;

        this.direction.x = mousePosition.x - this.startPosition.x;
        this.direction.y = mousePosition.y - this.startPosition.y;

        this.angle = Math.atan2(
            this.direction.y,
            this.direction.x
        );

        const length = Math.sqrt(
            this.direction.x ** 2 +
            this.direction.y ** 2
        );

        if (length > 0) {
            this.direction.x = this.direction.x / length;
            this.direction.y = this.direction.y / length;
        }
    }

    update(mousePosition, player) {
        this.calcularPosicionCanon(mousePosition, player)
        this.calcularPosicionSalidaCanon()
    }


    //// UTILIDADES //////

    calcularPosicionSalidaCanon() {
        this.exitPosition.x =
            this.startPosition.x +
            this.direction.x * this.height;

        this.exitPosition.y =
            this.startPosition.y +
            this.direction.y * this.height;
    }



}