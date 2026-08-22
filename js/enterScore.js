export class EnterScore {

    constructor() {

        this.state = "editing"
        // editing
        // completed

        this.playerName = [
            "A",
            "A",
            "A",
            "A"
        ]

        this.playerNameSelectedIndex = 0


        this.charArray = [
            ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            ..."0123456789",
            "-",
            "_"
        ]

        this.charArrayIndex =
            this.charArray.indexOf("A")


        this.playerScore = 0
        this.gameStatus = ""


        this.position = {
            x: 0,
            y: 0
        }

        this.dimensions = {
            w: 300,
            h: 400
        }

        this.debug = false
    }


    //////////////////////////////
    /// GAME LOOP
    //////////////////////////////

    update(
        keysPressed,
        score,
        gameStatus
    ) {
        this.playerScore =
            score

        this.gameStatus =
            gameStatus


        if (this.state === "editing") {

            this.enterPlayerName(
                keysPressed
            )


            if (
                keysPressed.Enter ||
                keysPressed[" "]
            ) {

                this.state =
                    "completed"
            }
        }
    }


    draw(context, canvas) {

        this.position.x =
            canvas.width / 2 -
            this.dimensions.w / 2

        this.position.y =
            canvas.height / 4


        context.save()

        context.translate(
            this.position.x,
            this.position.y
        )


        /// BACKGROUND

        context.fillStyle =
            "#181818cb"

        context.fillRect(
            0,
            0,
            this.dimensions.w,
            this.dimensions.h
        )


        /// GAME RESULT

        context.font =
            "bold 40px Arial"


        if (
            this.gameStatus === "gameOver"
        ) {

            context.fillStyle =
                "#e40f0f"

            context.fillText(
                "GAME OVER",
                this.dimensions.w / 2 - 120,
                50
            )
        }


        if (
            this.gameStatus === "completed"
        ) {

            context.fillStyle =
                "#2ea300"

            context.fillText(
                "VICTORY",
                this.dimensions.w / 2 - 90,
                50
            )
        }


        /// SCORE

        context.fillStyle =
            "#fff"

        context.font =
            "bold 20px Arial"

        context.fillText(
            `YOUR SCORE: ${this.playerScore}`,
            this.dimensions.w / 2 - 90,
            100
        )


        this.drawPlayerName(
            context
        )


        /// HELP

        const text =
            `Use "WASD" to Move\n` +
            `Press "Space" to Save\n` +
            `Press "ESC" to Main Menu`


        const lines =
            text.split("\n")


        context.fillStyle =
            "#9b1f0f"

        context.font =
            "bold 14px Arial"


        lines.reverse().forEach((line, index) => {

            context.fillText(
                line,
                10,
                this.dimensions.h - index * 14 - 10
            )
        })


        if (this.debug) {
            this.selfDebug(context)
        }


        context.restore()
    }


    //////////////////////////////
    /// ACTIONS
    //////////////////////////////

    enterPlayerName(keysPressed) {

        /// MOVER ENTRE POSICIONES

        if (keysPressed.d) {

            this.playerNameSelectedIndex++

            if (
                this.playerNameSelectedIndex >=
                this.playerName.length
            ) {

                this.playerNameSelectedIndex = 0
            }

            this.syncCharIndex()
        }


        if (keysPressed.a) {

            this.playerNameSelectedIndex--

            if (
                this.playerNameSelectedIndex < 0
            ) {

                this.playerNameSelectedIndex =
                    this.playerName.length - 1
            }

            this.syncCharIndex()
        }


        /// CAMBIAR CARACTER

        if (keysPressed.w) {

            this.charArrayIndex++

            if (
                this.charArrayIndex >=
                this.charArray.length
            ) {

                this.charArrayIndex = 0
            }

            this.updateSelectedCharacter()
        }


        if (keysPressed.s) {

            this.charArrayIndex--

            if (
                this.charArrayIndex < 0
            ) {

                this.charArrayIndex =
                    this.charArray.length - 1
            }

            this.updateSelectedCharacter()
        }
    }


    updateSelectedCharacter() {

        this.playerName[
            this.playerNameSelectedIndex
        ] =
            this.charArray[
            this.charArrayIndex
            ]
    }


    syncCharIndex() {

        const selectedChar =
            this.playerName[
            this.playerNameSelectedIndex
            ]


        this.charArrayIndex =
            this.charArray.indexOf(
                selectedChar
            )
    }


    reset() {

        this.state = "editing"

        this.playerName = [
            "A",
            "A",
            "A",
            "A"
        ]

        this.playerNameSelectedIndex = 0

        this.charArrayIndex =
            this.charArray.indexOf("A")
    }


    //////////////////////////////
    /// GETTERS
    //////////////////////////////

    getPlayerName() {

        return this.playerName.join("")
    }


    //////////////////////////////
    /// DRAW
    //////////////////////////////

    drawPlayerName(context) {

        context.fillStyle =
            "#fff"

        context.font =
            "20px Arial"


        context.fillText(
            "ENTER YOUR NAME",
            this.dimensions.w / 2 - 90,
            this.dimensions.h / 2
        )


        let charSpace = 0


        this.playerName.forEach(
            (char, index) => {

                if (
                    index ===
                    this.playerNameSelectedIndex
                ) {

                    context.fillStyle =
                        "#cbce11"

                    context.font =
                        "30px Arial"

                } else {

                    context.fillStyle =
                        "#fff"

                    context.font =
                        "20px Arial"
                }


                context.fillText(
                    char,
                    this.dimensions.w / 2 -
                    60 +
                    charSpace,
                    this.dimensions.h / 3 +
                    140
                )


                charSpace += 35
            }
        )
    }


    //////////////////////////////
    /// DEBUG
    //////////////////////////////

    selfDebug(context) {

        context.fillStyle =
            "#fff"

        context.font =
            "10px Arial"

        context.fillText(
            `Char Index: ${this.charArrayIndex}`,
            0,
            this.dimensions.h
        )
    }
}