import { Game } from "/js/game.js";
import { Menu } from "/js/menu.js";
import { Score } from "/js/score.js";

export class App {
    constructor(canvas) {

        this.canvas = canvas
        this.context = canvas.getContext("2d")

        this.keys = {}
        this.mousePosition = { x: 0, y: 0 }
        this.mouseClicked = false

        this.state = "menu" /// menu score playing pause
        this.menu = new Menu()
        this.score = new Score()
        this.game = null

        this.previousTime = null
        this.deltaTime = null

        /// INPUT LAUNCH
        this.detectarTeclado()
        this.detectarClick()
        this.detectarMouse()
    }

    update(deltaTime) {


        if (this.state === "menu") {

            const selectedOption =
                this.menu.update(this.keys, this.canvas)

            if (selectedOption) {

                if (selectedOption.appState === "new game") {
                    this.game = new Game()
                    this.state = "playing"
                }
                if (selectedOption.appState === "score") {
                    this.state = "score"
                }

                if (selectedOption.appState === "continue game" && this.game !== null) {
                    this.state = "playing"
                }
            }
        }

        if (this.state === "playing" && this.game !== null) {

            const gameAction = this.game.update(
                deltaTime,
                this.keys,
                this.mousePosition,
                this.mouseClicked
            )

            if (gameAction?.action === "saveScore") {

                this.score.addScore(
                    gameAction.name,
                    gameAction.score
                )

                this.game = null
                this.state = "score"
            }
        }

        if (this.state === "score") {

            this.score.update(
                deltaTime,
                this.keys,
                this.mousePosition,
                this.mouseClicked
            )
        }

        if (this.keys.Escape && this.state !== "menu") {
            this.state = "menu"
        }

        this.mouseClicked = false
    }

    draw() {

        if (this.state === "menu") {
            this.menu.draw(this.context, this.canvas)
        }

        if (this.state === "playing") {
            this.game.draw(this.context, this.canvas)
        }

        if (this.state === "score") {
            this.score.draw(this.context, this.canvas)
        }

        // this.selfDebug()
    }

    appLoop(currentTime) {

        /// Calcular deltaTime
        if (this.previousTime == null) {
            this.previousTime = currentTime
        }
        this.deltaTime = (currentTime - this.previousTime) / 1000
        this.previousTime = currentTime

        //Update
        this.update(this.deltaTime)
        //Clear
        this.clear()
        //Draw
        this.draw()

        requestAnimationFrame((time) => this.appLoop(time));
    }

    start() {
        requestAnimationFrame(
            (time) => this.appLoop(time)
        )
    }

    clear() {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )
    }

    /// UTILIDADES

    selfDebug() {
        this.context.fillStyle = "white";
        this.context.font = `20px Arial`;

        this.context.fillText(
            `appState : ${this.state}`,
            20,
            this.canvas.height - 20
        );
        this.context.fillText(
            `fps : ${(1 / this.deltaTime).toFixed(1)}`,
            20,
            this.canvas.height - 40
        );
    }

    /// UTILIDADES

    detectarTeclado() {
        window.addEventListener("keydown", (event) => {
            this.keys[event.key] = true
        })


        window.addEventListener("keyup", (event) => {
            this.keys[event.key] = false
        })

    }
    detectarMouse() {
        this.canvas.addEventListener("mousemove", (event) => {
            this.mousePosition = this.getMousePosition(event)
        });
    }
    detectarClick() {
        this.canvas.addEventListener("click", (event) => {
            this.mousePosition = this.getMousePosition(event)
            this.mouseClicked = true
        })
    }

    getMousePosition(event) {

        const rect = this.canvas.getBoundingClientRect()
        const style = getComputedStyle(this.canvas)

        const borderLeft = parseFloat(style.borderLeftWidth)
        const borderTop = parseFloat(style.borderTopWidth)

        return {
            x: event.clientX - rect.left - borderLeft,
            y: event.clientY - rect.top - borderTop
        }
    }

}