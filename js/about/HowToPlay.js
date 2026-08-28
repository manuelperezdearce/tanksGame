export class HowToPlay {
    constructor() {
        this.dimensions = { w: 360, h: 460 }
    }

    update(touchButtons, keysPressed) {
        if (
            keysPressed.Escape ||
            touchButtons.pressed.B
        ) {
            return { action: "back" }
        }

        return null
    }

    draw(context, position) {
        const objectPosition = {
            x: position.x - this.dimensions.w / 2,
            y: position.y - this.dimensions.h / 2
        }

        context.save()
        context.translate(objectPosition.x, objectPosition.y)

        context.fillStyle = "#181818e6"
        context.fillRect(
            0,
            0,
            this.dimensions.w,
            this.dimensions.h
        )

        context.fillStyle = "#ffffff"
        context.font = "bold 38px Arial"
        context.textAlign = "center"
        context.fillText("How to Play", this.dimensions.w / 2, 70)

        context.font = "18px Arial"
        context.fillText("L stick: Move tank", this.dimensions.w / 2, 150)
        context.fillText("R stick: Aim cannon", this.dimensions.w / 2, 185)
        context.fillText("X: Fire", this.dimensions.w / 2, 220)
        context.fillText("Start: Pause", this.dimensions.w / 2, 255)
        context.fillText("Select: HUD mode", this.dimensions.w / 2, 285)

        context.fillStyle = "#d24a38"
        context.font = "bold 16px Arial"
        context.fillText(
            "B: Back - Escape: Back",
            this.dimensions.w / 2,
            this.dimensions.h - 20
        )

        context.restore()
    }
}
