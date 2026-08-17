export class Stage {
    constructor(stage, canvas) {
        this.id = stage.id
        this.totalEnemies = stage.totalEnemies
        this.spawnedEnemies = 0
        this.timeLimit = stage.timeLimit
        this.elapsedTime = 0
        this.backgroundImage = new Image()
        this.backgroundImage.src = stage.bgImageSRC
        this.remainingTime = this.timeLimit
        this.canvas = canvas
        this.status = "running"  //// ready, running, finished, completed, failed
    }

    /// Actualizar
    update(deltaTime, playerLife, enemiesLength) {

        /// Runing

        if (this.status === "running") {
            this.running(deltaTime, playerLife, enemiesLength)
        }

        if (this.status === "finished") {
            this.checkIfWinOrLose(playerLife, enemiesLength)
        }

    }
    /// Dibujar
    draw(context) {

        context.drawImage(
            this.backgroundImage,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )
    }

    /// Acciones

    running(deltaTime, playerLife, enemiesLength) {
        this.elapsedTime += deltaTime
        this.remainingTime = this.timeLimit - this.elapsedTime

        if (playerLife <= 0) {
            this.status = "finished"
        }
        if (this.remainingTime <= 0) {
            this.remainingTime = 0
            this.status = "finished"
        }
        if (enemiesLength === 0) {
            this.status = "finished"
        }

    }
    /// Utilidades
    checkIfWinOrLose(playerLife, enemiesLength) {

        if (playerLife <= 0 || enemiesLength > 0) {
            this.status = "failed"

        } else if (playerLife >= 1 && enemiesLength === 0) {
            this.status = "completed"
        }
    }


}