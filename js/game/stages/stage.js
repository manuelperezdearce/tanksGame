export class Stage {
    constructor(stage) {
        this.id = stage.id
        this.name = stage.name
        this.spawnedEnemies = 0
        this.events = stage.events.map(event => ({
            ...event,
            triggered: false
        }))
        this.totalEnemies = this.events.reduce(
            (total, event) => event.type === "spawnEnemy"
                ? total + event.amount
                : total,
            0
        )
        this.timeLimit = stage.timeLimit
        this.elapsedTime = 0
        this.nextAmmoSpawnTime = 10
        this.nextLifeSpawnTime = 5
        this.backgroundColor = stage.bgColor || "#263238"
        this.backgroundLoaded = false
        this.backgroundImage = new Image()
        this.backgroundImage.onload = () => {
            this.backgroundLoaded = true
        }
        this.backgroundImage.onerror = () => {
            this.backgroundLoaded = false
        }

        if (stage.bgImageSRC) {
            this.backgroundImage.src = stage.bgImageSRC
        }
        this.remainingTime = this.timeLimit
        this.state = "running"
        this.result = null  //// completed, failed

        this.debugCounter = 0

    }

    /// Actualizar
    update(deltaTime, playerLife, enemiesLength) {

        if (this.state === "running") {
            return this.running(deltaTime, playerLife, enemiesLength)
        }

        return []
    }
    /// Dibujar
    draw(context, canvas) {

        context.fillStyle = this.backgroundColor
        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        )

        if (this.backgroundLoaded) {
            context.drawImage(
                this.backgroundImage,
                0,
                0,
                canvas.width,
                canvas.height
            )
        }
    }

    /// Acciones

    running(deltaTime, playerLife, enemiesLength) {
        this.elapsedTime += deltaTime
        this.remainingTime = this.timeLimit - this.elapsedTime

        const pendingEvents = this.events.filter(
            event => !event.triggered && this.elapsedTime >= event.time
        )

        pendingEvents.forEach(event => {
            event.triggered = true
        })

        while (this.elapsedTime >= this.nextAmmoSpawnTime) {
            pendingEvents.push({
                type: "spawnAmmo",
                amount: 5
            })
            this.nextAmmoSpawnTime += 10
        }

        while (this.elapsedTime >= this.nextLifeSpawnTime) {
            pendingEvents.push({
                type: "spawnLife",
                amount: 1
            })
            this.nextLifeSpawnTime += 10
        }

        if (playerLife <= 0) {
            this.finish("failed")
            return pendingEvents
        }
        if (this.remainingTime <= 0) {
            this.remainingTime = 0
            this.finish(
                this.spawnedEnemies >= this.totalEnemies && enemiesLength === 0
                    ? "completed"
                    : "failed"
            )
            return pendingEvents
        }
        if (
            this.spawnedEnemies >= this.totalEnemies &&
            enemiesLength === 0
        ) {
            this.finish("completed")
        }

        return pendingEvents

    }

    finish(result) {
        this.result = result
        this.state = "finished"
    }


}
