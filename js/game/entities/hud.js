export class HUD {
    constructor() {
        this.visible = true
        this.playerLife = 0
        this.score = 0
        this.enemiesDefeated = 0
        this.totalEnemies = 0
        this.ammo = 0
        this.maxAmmo = 0
        this.mousePosition = { x: 0, y: 0 }

        this.heartImage = new Image()
        this.heartImage.src = "./assets/common/heart-64.png"

        this.stage = {
            id: 0,
            name: "",
            remainingTime: 0
        }
    }


    /// UPDATE ///

    update(
        playerLife,
        score,
        mousePosition,
        enemiesDefeated,
        totalEnemies,
        stage,
        ammo,
        maxAmmo,
        input
    ) {
        if (input?.touchButtons?.pressed?.select) {
            this.toggleVisibility()
        }

        this.playerLife = playerLife
        this.score = score
        this.mousePosition = mousePosition
        this.enemiesDefeated = enemiesDefeated
        this.totalEnemies = totalEnemies
        this.ammo = ammo
        this.maxAmmo = maxAmmo
        this.stage.id = stage.id
        this.stage.name = stage.name
        this.stage.remainingTime = Math.ceil(stage.remainingTime)
    }

    /// DRAW ////

    toggleVisibility() {
        this.visible = !this.visible
    }

    draw(canvas, context) {
        if (!this.visible) {
            return
        }

        context.save()

        context.fillStyle = "#11131883"
        context.fillRect(10, 10, canvas.width - 20, 90)

        context.font = "bold 20px Arial"
        context.textAlign = "left"
        context.fillStyle = this.playerLife <= 2
            ? "#ff3b30"
            : "#ffffff"

        if (
            this.heartImage.complete &&
            this.heartImage.naturalWidth > 0
        ) {
            context.drawImage(
                this.heartImage,
                25,
                20,
                36,
                36
            )
            context.fillText(`x ${this.playerLife}`, 70, 43)
        }
        else {
            context.fillText(`LIFE ${this.playerLife}`, 30, 43)
        }

        context.fillStyle = "#ffffff"
        context.fillText(`SCORE ${this.score}`, 30, 77)

        context.textAlign = "left"
        context.fillStyle = this.ammo === 0
            ? "#ff3b30"
            : this.ammo <= 2
                ? "#d6c900"
                : "#ffffff"
        context.fillText(
            `AMMO ${this.ammo} / ${this.maxAmmo}`,
            180,
            77
        )

        context.textAlign = "center"
        context.fillText(
            `STAGE ${this.stage.id} - ${this.stage.name}`,
            canvas.width / 2,
            43
        )
        context.fillText(
            `TIME ${this.stage.remainingTime}s`,
            canvas.width / 2,
            77
        )

        context.textAlign = "right"
        context.fillText(
            `ENEMIES ${this.enemiesDefeated} / ${this.totalEnemies}`,
            canvas.width - 30,
            43
        )

        context.restore()

        this.drawPointer(context)
    }

    drawPointer(context) {
        context.save()
        context.translate(this.mousePosition.x, this.mousePosition.y)

        context.beginPath()
        context.fillStyle = "#ac0c0cb6"
        context.arc(0, 0, 4, 0, 2 * Math.PI)
        context.fill()

        context.fillStyle = "#d8db0075"

        for (let index = 0; index < 4; index++) {
            context.rotate(Math.PI / 2)
            context.fillRect(-2, 10, 4, 20)
        }

        context.restore()
    }

}
