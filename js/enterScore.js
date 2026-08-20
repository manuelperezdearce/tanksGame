export class EnterScore {

    constructor() {
        this.playerName = ["A", "A", "A", "A"]
        this.playerNameSelectedIndex = 0
        this.charArray = this.charArray = [
            ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            ..."0123456789",
            "-", "_"
        ]
        this.charArrayIndex = this.charArray.indexOf("A")
        this.playerScore = 0
        this.gameStatus = ""
        this.canMove = true

        this.position = { x: 0, y: 0 }
        this.dimensions = { w: 300, h: 400 }

        this.debug = false


        let counter = 0
        this.playerName.forEach((ele) => {
            this.playerName[counter] = this.charArray[this.charArrayIndex]
            counter++
        })
    }

    update(keys, score, gameStatus) {
        this.playerScore = score
        this.gameStatus = gameStatus
        this.enterPlayerName(keys)

        if (keys["h"]) {
            return (this.playerName.join(""))
        }

    }
    draw(context, canvas) {
        this.position.x = canvas.width / 2 - this.dimensions.w / 2
        this.position.y = canvas.height / 4

        context.save()
        context.translate(this.position.x, this.position.y)

        context.fillStyle = "#1818189c"

        context.fillRect(
            0,
            0,
            this.dimensions.w,
            this.dimensions.h
        )

        context.fillStyle = "#fff";
        context.font = `bold 40px Arial`;
        if (this.gameStatus === "gameOver") {
            context.fillStyle = "#e40f0f";
            context.fillText(
                "GAME OVER",
                this.dimensions.w / 2 - 120,
                50
            );
        }
        if (this.gameStatus === "completed") {
            context.fillStyle = "#2ea300";
            context.fillText(
                "VICTORY",
                this.dimensions.w / 2 - 90,
                50
            );
        }

        context.fillStyle = "#fff";
        context.font = `bold 20px Arial`;
        context.fillText(
            `YOUR SCORE: ${this.playerScore}`,
            this.dimensions.w / 2 - 90,
            100
        );

        this.drawPlayerName(context)

        /// DRAW CONTROLS HELP
        const text = `Use "WASD" to Move\nPress "Espace" to Save\nPress "ESC" to back to Main Menu`
        const lines = text.split("\n")
        context.fillStyle = "#9b1f0f";
        context.font = "bold 14px Arial"
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

    //// ACTIONS

    drawPlayerName(context) {
        context.fillStyle = "#fff";
        context.font = `20px Arial`;
        context.fillText(
            "ENTER YOUR NAME",
            this.dimensions.w / 2 - 90,
            this.dimensions.h / 2
        );

        let charSpace = 0
        let indexCounter = 0
        this.playerName.forEach((ele) => {
            if (indexCounter === this.playerNameSelectedIndex) {
                context.fillStyle = "#cbce11";
                context.font = `30px Arial`;
            } else {
                context.fillStyle = "#fff";
                context.font = `20px Arial`;
            }

            context.fillText(
                `${ele}`,
                this.dimensions.w / 2 - 60 + charSpace,
                this.dimensions.h / 3 + 140
            );
            indexCounter++
            charSpace += 35
        })

    }


    enterPlayerName(keys) {

        //// Mover Lateralmente a través de playerName

        if (this.canMove) {
            if (keys.d) {

                this.playerNameSelectedIndex++
                if (this.playerNameSelectedIndex >= this.playerName.length) {
                    this.playerNameSelectedIndex = 0
                }

                this.canMove = false
            }

            if (keys.a) {

                this.playerNameSelectedIndex--

                if (this.playerNameSelectedIndex < 0) {
                    this.playerNameSelectedIndex = this.playerName.length - 1
                }

                this.canMove = false
            }
        }



        //// Mover CAMBIAR CARACTER

        if (this.canMove) {
            if (keys.w) {
                this.charArrayIndex++


                if (this.charArrayIndex >= this.charArray.length) {
                    this.charArrayIndex = 0
                }
                this.playerName[this.playerNameSelectedIndex] = this.charArray[this.charArrayIndex]

                this.canMove = false
            }
            if (keys.s) {
                this.playerName[this.playerNameSelectedIndex] = this.charArray[this.charArrayIndex]
                this.charArrayIndex--
                if (this.charArrayIndex < 0) {
                    this.charArrayIndex = this.charArray.length - 1
                }
                this.canMove = false
            }


        }




        if (
            !keys.w &&
            !keys.s &&
            !keys.a &&
            !keys.d
        ) {
            this.canMove = true
        }
    }

    /// DEBUG
    selfDebug(context) {
        context.fillStyle = "#fff";
        context.font = `10px Arial`;
        context.fillText(
            `$Char Index ${this.charArrayIndex}`,
            0,
            this.dimensions.h
        )
    }


}