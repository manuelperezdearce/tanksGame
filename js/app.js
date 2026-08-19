import { Game } from "/js/game.js";
import { Menu } from "/js/menu.js";

export class App {
    constructor(canvas) {

        this.canvas = canvas
        this.context = canvas.getContext("2d")

        this.keys = {}
        this.mousePosition = { x: 0, y: 0 }
        this.mouseClicked = false

        this.state = "menu"
        this.menu = new Menu()
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
                this.menu.update(this.keys)

            if (selectedOption) {

                if (selectedOption.appState === "game") {
                    this.game = new Game()
                }

                this.state = selectedOption.appState
            }
        }

        if (this.state === "game") {

            this.game.update(
                deltaTime,
                this.keys,
                this.mousePosition,
                this.mouseClicked
            )
        }

        this.mouseClicked = false
    }

    draw() {

        if (this.state === "menu") {
            this.menu.draw(this.context, this.canvas)
        }

        if (this.state === "game") {
            this.game.draw(this.context, this.canvas)
        }

        this.selfDebug()
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