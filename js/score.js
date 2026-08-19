export class Score {
    constructor() {
        this.storageKey = "tanksScores"
        this.scores = []
        this.dimensions = { w: 400, h: 500 }
        this.position = { x: 0, y: 0 }

        this.canLoadScores = true
    }

    update() {
        if (this.scores.length === 0 && this.canLoadScores) {
            this.loadScores()
            this.canLoadScores = false
        }
    }

    draw(context, canvas) {
        try {

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
            context.fillStyle = "white"
            context.font = "bold 40px Arial"
            context.fillText(
                "Scores",
                this.dimensions.w / 2 - 70,
                80
            )

            if (this.scores.length === 0) {
                context.fillStyle = "#fff";
                context.font = `20px Arial`;

                context.fillText(
                    "NO DATA SCORES",
                    this.dimensions.w / 2,
                    this.dimensions.h / 2
                )
            } else {

                let scoreTableInitX = 30
                let scoreTableInitY = 150

                this.scores.forEach((score) => {

                    const scoreArray = Object.values(score)

                    let columnX = scoreTableInitX

                    scoreArray.forEach((ele) => {
                        context.font = `20px Arial`
                        context.fillStyle = "#fff";
                        context.fillText(
                            `${ele}`,
                            columnX,
                            scoreTableInitY
                        )

                        columnX += 120
                    })

                    scoreTableInitY += 40
                })
            }

            context.fillStyle = "#611107";
            context.font = "bold 14px Arial"
            context.fillText(
                `Press "ESC" to Back`,
                10,
                this.dimensions.h - 10
            )

            context.restore()
        } catch (error) {
            console.log(error)
        }

    }

    addScore(name, score) {

        const newScore = {
            name: name,
            score: score,
            date: new Date().toLocaleDateString()
        }

        this.scores.push(newScore)

        this.scores.sort(
            (a, b) => b.score - a.score
        )

        this.saveScores()
    }

    loadScores() {
        try {
            const data = localStorage.getItem(this.storageKey)

            if (data) {
                this.scores = JSON.parse(data)
            } else {
                this.scores = []
            }
        } catch (error) {
            console.log(error)
        }
    }

    saveScores() {

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(this.scores)
        )
    }

}