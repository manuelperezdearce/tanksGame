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

        context.fillStyle = "#13090971"
        context.fillRect(0, 0, canvas.height, canvas.height)

        context.fillStyle = "#fff";
        context.font = `${this.fontSize}px Arial`;


        if (this.gameStatus === "gameOver") {
            context.fillStyle = "#6b0a0a";
            context.fillText(
                "GAME OVER",
                canvas.width / 2 - 50,
                canvas.height / 3
            );
        }
        if (this.gameStatus === "completed") {
            context.fillStyle = "#2ea300";
            context.fillText(
                "VICTORY",
                canvas.width / 2 - 50,
                canvas.height / 3
            );
        }

        context.fillStyle = "#fff";
        context.fillText(
            `YOUR SCORE: ${this.playerScore}`,
            canvas.width / 2 - 50,
            canvas.height / 3 + 50
        );



        this.drawPlayerName(context, canvas)

        this.selfBebug(context, canvas)

    }

    //// ACTIONS

    drawPlayerName(context, canvas) {
        context.fillStyle = "#fff";
        context.font = `30px Arial`;
        context.fillText(
            "ENTER YOUR NAME",
            canvas.width / 2 - 50,
            canvas.height / 3 + 100
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
                canvas.width / 2 - 50 + charSpace,
                canvas.height / 3 + 140
            );
            indexCounter++
            charSpace += 30
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
    selfBebug(context, canvas) {
        context.fillStyle = "#fff";
        context.font = `10px Arial`;
        context.fillText(
            `$Char Index ${this.charArrayIndex}`,
            canvas.width / 2 - 50,
            canvas.height - 100
        )
    }


}