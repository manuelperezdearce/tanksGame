import { EnterScore } from "./enterScore.js"

export class Score {

    constructor() {

        this.storageKey = "tanksScores"

        this.scores = []

        this.state = "ranking"
        // ranking
        // enterName

        this.pendingScore = 0
        this.pendingGameStatus = ""

        this.enterScore = new EnterScore()

        this.dimensions = {
            w: 400,
            h: 500
        }

        this.position = {
            x: 0,
            y: 0
        }

        this.loadScores()
    }


    //////////////////////////////
    /// GAME LOOP
    //////////////////////////////

    update(keysPressed) {
        if (this.state === "enterName") {

            this.enterScore.update(
                keysPressed,
                this.pendingScore,
                this.pendingGameStatus
            )


            if (this.enterScore.state === "completed") {

                const playerName =
                    this.enterScore.getPlayerName()

                this.addScore(
                    playerName,
                    this.pendingScore
                )

                this.setState("ranking")
            }
        }
    }


    draw(context, canvas) {

        if (this.state === "ranking") {

            this.drawRanking(
                context,
                canvas
            )
        }


        if (this.state === "enterName") {

            this.enterScore.draw(
                context,
                canvas
            )
        }
    }


    //////////////////////////////
    /// STATES
    //////////////////////////////

    setState(newState) {

        // if (this.state === newState) {
        //     console.log("no paso nada")
        //     return
        // }

        this.state = newState

        this.onEnterState(newState)
    }


    onEnterState(state) {

        if (state === "ranking") {

            this.loadScores()
        }


        if (state === "enterName") {

            this.enterScore.reset()
        }
    }


    //////////////////////////////
    /// ACTIONS
    //////////////////////////////

    prepareNewScore(score, gameStatus) {

        this.pendingScore = score
        this.pendingGameStatus = gameStatus

        this.setState("enterName")
    }


    addScore(name, score) {

        const newScore = {

            name: name,

            score: score,

            date:
                new Date()
                    .toLocaleDateString()
        }


        this.scores.push(newScore)


        this.scores.sort(
            (a, b) =>
                b.score - a.score
        )


        this.saveScores()
    }


    //////////////////////////////
    /// STORAGE
    //////////////////////////////

    loadScores() {

        try {

            const data =
                localStorage.getItem(
                    this.storageKey
                )

            console.log(data)


            if (data) {

                this.scores =
                    JSON.parse(data)

            } else {

                this.scores = []
            }

        } catch (error) {

            console.log(
                "Error loading scores",
                error
            )
        }
    }


    saveScores() {

        try {

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(
                    this.scores
                )
            )

        } catch (error) {

            console.log(
                "Error saving scores",
                error
            )
        }
    }


    //////////////////////////////
    /// DRAW
    //////////////////////////////

    drawRanking(context, canvas) {

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


        /// TITLE

        context.fillStyle =
            "#fff"

        context.font =
            "bold 40px Arial"

        context.fillText(
            "Scores",
            this.dimensions.w / 2 - 70,
            80
        )


        /// NO DATA

        if (this.scores.length === 0) {

            context.font =
                "20px Arial"

            context.fillText(
                "NO DATA SCORES",
                100,
                this.dimensions.h / 2
            )

        } else {

            let tableX = 30
            let tableY = 150


            this.scores.forEach(
                (score) => {


                    let columnX =
                        tableX


                    context.font =
                        "20px Arial"
                    context.fillStyle =
                        "#fff"
                    context.fillText(
                        `${this.scores.indexOf(score) + 1}`,
                        columnX,
                        tableY
                    )

                    const scoreArray =
                        Object.values(score)
                    scoreArray.forEach(
                        (value) => {
                            columnX += this.dimensions.w / 4
                            context.fillText(
                                `${value}`,
                                columnX - this.dimensions.w / 8,
                                tableY
                            )
                        }
                    )
                    tableY += 40
                }
            )
        }


        /// HELP

        context.fillStyle =
            "#611107"

        context.font =
            "bold 14px Arial"

        context.fillText(
            `Press "ESC" to Back`,
            10,
            this.dimensions.h - 10
        )


        context.restore()
    }
}
