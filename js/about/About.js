export class About {
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
        context.fillText("About", this.dimensions.w / 2, 70)

        context.font = "21px Arial"
        context.fillText("Tanks", this.dimensions.w / 2, 150)
        context.font = "16px Arial"
        context.fillText("A tank game", this.dimensions.w / 2, 190)

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
