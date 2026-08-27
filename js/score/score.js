import { EnterScore } from "./enterScore.js"

export class Score {

    constructor() {

        this.storageKey = "tanksStorage"

        this.scores = []
        this.currentPage = 0
        this.scoresPerPage = 6

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

    update(input) {
        if (this.state === "enterName") {

            const action = this.enterScore.update(
                input,
                this.pendingScore,
                this.pendingGameStatus
            )

            if (action?.action === "back") {
                return action
            }


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

        if (
            this.state === "ranking"
        ) {
            if (
                input.keyboard.pressed.a ||
                input.touchButtons.pressed.dLeft
            ) {
                this.previousPage()
            }

            if (
                input.keyboard.pressed.d ||
                input.touchButtons.pressed.dRight
            ) {
                this.nextPage()
            }

            if (
                input.keyboard.pressed.Escape ||
                input.touchButtons.pressed.B
            ) {
                return { action: "back" }
            }
        }

        return null
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

        this.state = newState

        this.onEnterState(newState)
    }


    onEnterState(state) {

        if (state === "ranking") {

            this.currentPage = 0
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
            if (data) {

                const storage = JSON.parse(data)

                this.scores =
                    Array.isArray(storage.scores)
                        ? storage.scores
                        : []

            } else {

                this.scores = []
            }

            this.currentPage = Math.min(
                this.currentPage,
                this.getPageCount() - 1
            )

        } catch (error) {

            console.log(
                "Error loading scores",
                error
            )
        }
    }


    saveScores() {

        try {

            const data =
                localStorage.getItem(
                    this.storageKey
                )

            const parsedStorage = data
                ? JSON.parse(data)
                : {}

            const storage =
                parsedStorage &&
                    typeof parsedStorage === "object" &&
                    !Array.isArray(parsedStorage)
                    ? parsedStorage
                    : {}

            storage.version = 1
            storage.settings = storage.settings ?? {
                music: { enabled: true, volume: 0.3 },
                effects: { enabled: true, volume: 0.3 }
            }
            storage.scores = this.scores

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(
                    storage
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

    getPageCount() {
        return Math.max(
            1,
            Math.ceil(this.scores.length / this.scoresPerPage)
        )
    }

    nextPage() {
        this.currentPage = Math.min(
            this.currentPage + 1,
            this.getPageCount() - 1
        )
    }

    previousPage() {
        this.currentPage = Math.max(
            this.currentPage - 1,
            0
        )
    }

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


            const pageStart =
                this.currentPage * this.scoresPerPage
            const pageScores = this.scores.slice(
                pageStart,
                pageStart + this.scoresPerPage
            )

            pageScores.forEach(
                (score, index) => {


                    let columnX =
                        tableX


                    context.font =
                        "20px Arial"
                    context.fillStyle =
                        "#fff"
                    context.fillText(
                        `${pageStart + index + 1}`,
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

            context.font = "16px Arial"
            context.fillText(
                `Page ${this.currentPage + 1} / ${this.getPageCount()}`,
                this.dimensions.w / 2,
                this.dimensions.h - 42
            )
        }


        /// HELP

        context.fillStyle =
            "#d24a38"

        context.font =
            "bold 16px Arial"

        context.fillText(
            `D-Pad Left/Right: Pages - A/D: Pages - B: Back`,
            10,
            this.dimensions.h - 14
        )


        context.restore()
    }
}
