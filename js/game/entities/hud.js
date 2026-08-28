export class HUD {
    constructor(mode = "full") {
        this.mode = mode
        this.playerLife = 0
        this.score = 0
        this.enemiesDefeated = 0
        this.totalEnemies = 0
        this.ammo = 0
        this.maxAmmo = 0
        this.mousePosition = { x: 0, y: 0 }

        this.heartImage = new Image()
        this.heartImage.src = "./assets/common/heart-64.png"
        this.bulletImage = new Image()
        this.bulletImage.src = "./assets/bullets/bullets.png"
        this.bulletSource = {
            x: 100,
            y: 190,
            w: 130,
            h: 280
        }

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
            this.cycleMode()
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

    cycleMode() {
        const modes = ["full", "reduced", "hidden"]
        const currentIndex = modes.indexOf(this.mode)
        this.mode = modes[(currentIndex + 1) % modes.length]
    }

    draw(canvas, context) {
        if (this.mode === "hidden") {
            return
        }

        if (this.mode === "reduced") {
            this.drawReduced(canvas, context)
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

        this.drawLife(context, 25, 20, 36)
        context.fillText(`x ${this.playerLife}`, 70, 43)

        context.fillStyle = "#ffffff"
        context.fillText(`SCORE ${this.score}`, 30, 77)

        context.textAlign = "left"
        context.fillStyle = this.ammo === 0
            ? "#ff3b30"
            : this.ammo <= 2
                ? "#d6c900"
                : "#ffffff"
        this.drawAmmo(context, 180, 53, 18, 30)
        context.fillText(`${this.ammo} / ${this.maxAmmo}`, 205, 77)

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

    drawReduced(canvas, context) {
        context.save()
        context.font = "bold 20px Arial"
        context.textAlign = "left"
        context.fillStyle = "#ffffff"
        context.fillText(`SCORE ${this.score}`, 24, 35)
        context.textAlign = "right"
        context.fillText(
            `TIME ${this.stage.remainingTime}s`,
            canvas.width - 24,
            35
        )
        context.textAlign = "left"

        const bottomY = canvas.height - 42

        context.fillStyle = this.playerLife <= 2
            ? "#ff3b30"
            : "#ffffff"
        this.drawLife(context, canvas.width - 230, bottomY - 10, 36)
        context.fillText(`x ${this.playerLife}`, canvas.width - 188, bottomY + 15)

        context.fillStyle = this.ammo === 0
            ? "#ff3b30"
            : this.ammo <= 2
                ? "#d6c900"
                : "#ffffff"
        this.drawAmmo(context, canvas.width - 125, bottomY - 10, 18, 30)
        context.fillText(`${this.ammo}/${this.maxAmmo}`, canvas.width - 100, bottomY + 15)
        context.restore()

        this.drawPointer(context)
    }

    drawLife(context, x, y, size) {
        if (this.heartImage.complete && this.heartImage.naturalWidth > 0) {
            context.drawImage(this.heartImage, x, y, size, size)
        }
    }

    drawAmmo(context, x, y, width, height) {
        if (this.bulletImage.complete && this.bulletImage.naturalWidth > 0) {
            context.drawImage(
                this.bulletImage,
                this.bulletSource.x,
                this.bulletSource.y,
                this.bulletSource.w,
                this.bulletSource.h,
                x,
                y,
                width,
                height
            )
        }
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
