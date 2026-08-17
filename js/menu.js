export class Menu {
    constructor() {
        this.options = [
            "New Game",
            "Score"
        ]

        this.selectedIndex = 0
        this.canMove = true
    }


    update(keys) {

        if (this.canMove) {

            if (keys.ArrowDown || keys.s) {

                this.selectedIndex++

                this.canMove = false
            }

            if (keys.ArrowUp || keys.w) {

                this.selectedIndex--

                this.canMove = false
            }
        }

        if (
            !keys.ArrowDown &&
            !keys.ArrowUp &&
            !keys.w &&
            !keys.s
        ) {
            this.canMove = true
        }

        if (this.selectedIndex >= this.options.length) {
            this.selectedIndex = 0
        }

        if (this.selectedIndex < 0) {
            this.selectedIndex = this.options.length - 1
        }
    }

    draw(context, canvas) {

        context.fillStyle = "white"
        context.font = "40px Arial"

        context.fillText(
            "TANKS",
            canvas.width / 2 - 70,
            200
        )

        context.font = "24px Arial"

        this.options.forEach((option, index) => {

            const y = 350 + index * 50

            if (index === this.selectedIndex) {
                context.fillStyle = "yellow"
            } else {
                context.fillStyle = "white"
            }

            context.fillText(
                option,
                canvas.width / 2 - 60,
                y
            )
        })

        this.selfDebug(context, canvas)
    }
    /// UTILIDADES
    selfDebug(context, canvas) {
        context.fillStyle = "white";
        context.font = `10px Arial`;

        context.fillText(
            `menuIndex : ${this.selectedIndex}`,
            canvas.width / 2 - 70,
            220
        );
    }
}
