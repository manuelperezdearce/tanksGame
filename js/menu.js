export class Menu {
    constructor() {
        this.options = [
            {
                id: 1,
                menuName: "New Game",
                appState: "game",
                isAvailable: true
            },
            {
                id: 2,
                menuName: "Score",
                appState: "score",
                isAvailable: true
            },

        ]

        this.selectedIndex = 0
        this.canMove = true
    }


    update(keys) {

        if (this.canMove) {
            if (keys.ArrowDown || keys.s) {

                this.selectedIndex++
                if (this.selectedIndex >= this.options.length) {
                    this.selectedIndex = 0
                }
                if (!this.options[this.selectedIndex].isAvailable) {
                    this.selectedIndex++
                }

                this.canMove = false
            }

            if (keys.ArrowUp || keys.w) {

                this.selectedIndex--

                if (this.selectedIndex < 0) {
                    this.selectedIndex = this.options.length - 1
                }
                if (!this.options[this.selectedIndex].isAvailable) {
                    this.selectedIndex--
                }

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

        if (keys[" "]) {
            return this.options[this.selectedIndex]
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
                context.fillStyle = "#e7e408"
            } else {
                if (option.isAvailable) {
                    context.fillStyle = "#fff"
                } else {
                    context.fillStyle = "#414141"
                }

            }

            context.fillText(
                option.menuName,
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
