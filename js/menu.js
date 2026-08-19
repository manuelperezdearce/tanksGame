export class Menu {
    constructor() {
        this.canvas = null
        this.dimensions = { w: 300, h: 400 }
        this.position = { x: 0, y: 0 }

        this.options = [
            {
                id: 1,
                menuName: "Continue",
                appState: "continue game",
                isAvailable: false
            },
            {
                id: 2,
                menuName: "New Game",
                appState: "new game",
                isAvailable: true
            },
            {
                id: 3,
                menuName: "Score",
                appState: "score",
                isAvailable: true
            },

        ]

        this.selectedIndex = 0
        this.canMove = true
        this.availableOptions = []
    }


    update(keys, canvas) {
        /// Ubicación en el canvas
        this.position = { x: canvas.width / 2, y: canvas.height / 3 * 2 }


        this.availableOptions = this.options.filter(ele => ele.isAvailable)

        if (this.canMove) {
            if (keys.ArrowDown || keys.s) {

                this.selectedIndex++
                if (this.selectedIndex >= this.availableOptions.length) {
                    this.selectedIndex = 0
                }
                if (!this.availableOptions[this.selectedIndex].isAvailable) {
                    this.selectedIndex++
                }

                this.canMove = false
            }

            if (keys.ArrowUp || keys.w) {

                this.selectedIndex--

                if (this.selectedIndex < 0) {
                    this.selectedIndex = this.availableOptions.length - 1
                }
                if (!this.availableOptions[this.selectedIndex].isAvailable) {
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

            return this.availableOptions[this.selectedIndex]
        }
    }

    draw(context, canvas) {

        const objectPosition = { x: 0, y: 0 }
        objectPosition.x = this.position.x - this.dimensions.w / 2
        objectPosition.y = this.position.y - this.dimensions.h / 2

        context.fillStyle = "#1818189c"
        context.fillRect(
            objectPosition.x,
            objectPosition.y,
            this.dimensions.w,
            this.dimensions.h
        )

        context.save()
        context.translate(objectPosition.x, objectPosition.y)

        context.fillStyle = "white"
        context.font = "bold 40px Arial"

        context.fillText(
            "Main Menu",
            this.dimensions.w / 2 - 100,
            this.dimensions.h / 5
        )

        context.font = "24px Arial"

        this.availableOptions.forEach((option, index) => {

            const y = this.dimensions.h / 2 + index * 50

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
                this.dimensions.w / 2 - 60,
                y
            )
        })

        context.fillStyle = "#611107";
        context.font = "bold 14px Arial"
        context.fillText(
            `Use "W" or "S" to Move`,
            10,
            this.dimensions.h - 30
        )
        context.fillText(
            `Press "Espace" to Select`,
            10,
            this.dimensions.h - 10
        )
        // this.selfDebug(context)

        context.restore()


    }
    /// UTILIDADES
    selfDebug(context) {
        context.fillStyle = "white";
        context.font = `10px Arial`;

        context.fillText(
            `menuIndex : ${this.selectedIndex}`,
            0,
            this.dimensions.h
        );
    }
}
