export class Stage {
    constructor(stage) {
        this.id = stage.id
        this.name = stage.name
        this.totalEnemies = stage.totalEnemies
        this.spawnedEnemies = 0
        this.timeLimit = stage.timeLimit
        this.elapsedTime = 0
        this.backgroundImage = new Image()
        this.backgroundImage.src = stage.bgImageSRC
        this.remainingTime = this.timeLimit
        this.status = "running"  //// ready, running, finished, completed, failed

        this.debugCounter = 0

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
    draw(context, canvas) {

        context.drawImage(
            this.backgroundImage,
            0,
            0,
            canvas.width,
            canvas.height
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
        if (
            this.spawnedEnemies >= this.totalEnemies &&
            enemiesLength === 0
        ) {
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