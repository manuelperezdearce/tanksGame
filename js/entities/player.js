export class Player {
    constructor(canvas) {
        this.canvas = canvas
        // Propiedades del Jugador
        this.width = 40
        this.height = 40
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.speed = 400
        this.color = "#0be60b"
        this.playerCenterX = ""
        this.playerCenterY = ""
    }

    moverJugador(deltaTime, keys) {
        const desplazamiento = this.speed * deltaTime
        let directionX = 0
        let directionY = 0
        /// definir desplazamientos


        /// Horizontal

        if (keys.a == true) {
            directionX = directionX - 1
        }
        if (keys.d == true) {
            directionX = directionX + 1
        }

        /// Vertical

        if (keys.w == true) {
            directionY = directionY - 1
        }
        if (keys.s == true) {
            directionY = directionY + 1
        }

        // Normalizar movimiento diagonal
        if (directionX !== 0 && directionY !== 0) {
            const diagonalFactor = 1 / Math.sqrt(2)
            directionX = directionX * diagonalFactor
            directionY = directionY * diagonalFactor
        }

        // Actualizar posición

        this.x = this.x + directionX * desplazamiento
        this.y = this.y + directionY * desplazamiento

        // Llamar a función para calcular colisión con Canva
        this.mantenerDentroDelCanvas()
    }

    ///////////////////////////////////////////////////
    //////////////   COLISIONES   /////////////////////
    ///////////////////////////////////////////////////

    mantenerDentroDelCanvas(canvas) {
        if (this.x < 0) {
            this.x = 0
        }

        if (this.x > this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width
        }

        if (this.y < 0) {
            this.y = 0
        }

        if (this.y > this.canvas.height - this.height) {
            this.y = this.canvas.height - this.height
        }
    }

    dibujarJugador(context) {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
    }

    ///////////////////////////////////////////////////
    //////////////   UTILIDADES  /////////////////////
    ///////////////////////////////////////////////////

    calcularPlayerCenter() {
        this.playerCenterX = this.x + this.width / 2;
        this.playerCenterY = this.y + this.height / 2;
    }

}