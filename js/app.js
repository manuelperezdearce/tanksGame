import { Game } from "./game.js";
import { Menu } from "./menu.js";
import { Score } from "./score.js";

export class App {
    constructor(canvas) {

        this.canvas = canvas
        this.context = canvas.getContext("2d")

        /// USER INPUTS
        this.keysHeld = {}
        this.keysPressed = {}
        this.mousePosition = { x: 0, y: 0 }
        this.mousePressed = false

        this.previousState = null
        this.state = "menu" /// menu score game pause
        this.menu = new Menu()
        this.score = new Score()
        this.game = null

        this.previousTime = null
        this.deltaTime = null

        this.debug = true

        /// INPUT LAUNCH
        this.detectarTeclado()
        this.detectarClick()
        this.detectarMouse()
    }

    update(deltaTime) {

        if (this.state === "menu") {

            let selectedOption =
                this.menu.update(this.keysPressed, this.canvas)

            if (selectedOption) {

                if (selectedOption.appState === "new game") {
                    this.game = new Game()
                    this.setContinueAvailable(false)
                    this.setState("game")
                }
                if (selectedOption.appState === "score") {
                    this.score.setState("ranking")
                    this.setState("score")
                }

                if (selectedOption.appState === "continue game" && this.game !== null) {
                    this.game.prepareToContinue()
                    this.setState("game")
                }
            }

        }

        else if (this.state === "game") {

            if (this.game !== null) {
                this.game.update(
                    deltaTime,
                    this.keysPressed,
                    this.keysHeld,
                    this.mousePosition,
                    this.mousePressed
                )
                if (this.game.state === "finished") {
                    this.score.prepareNewScore(
                        this.game.score,
                        this.game.result
                    )
                    this.setState("score")
                    this.keysPressed = {}
                    this.mousePressed = false
                    return
                }
            }

        }

        else if (this.state === "score") {

            this.score.update(
                this.keysPressed,
                this.keysHeld,
                this.mousePosition,
                this.mousePressed
            )
        }

        if (this.keysPressed.Escape) {

            if (this.state === "score") {
                if (this.game?.state === "finished") {
                    this.destroyGame()
                }
                this.setState("menu")
            }
            else if (this.state === "game") {
                this.setContinueAvailable(true)
                this.setState("menu")
                this.score.state = "ranking"
            }





        }

        this.keysPressed = {}
        this.mousePressed = false
    }

    draw() {


        if (this.game !== null) {
            this.game.draw(this.context, this.canvas)
        }
        if (this.state === "score") {
            this.score.draw(this.context, this.canvas)
        }
        if (this.state === "menu") {
            this.menu.draw(this.context, this.canvas)
        }

        if (this.debug) {
            this.selfDebug()
        }

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
            if (!this.keysHeld[event.key]) {
                this.keysPressed[event.key] = true
            }

            this.keysHeld[event.key] = true
        })


        window.addEventListener("keyup", (event) => {
            this.keysHeld[event.key] = false
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
            this.mousePressed = true
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

    /// STATES

    setState(newState) {
        if (this.state === newState) {
            return
        }
        else {
            this.previousState = this.state
            this.state = newState
            this.onEnterState(newState)
        }


    }

    onEnterState(state) {

        if (state === "score") {
            if (this.game === null) {
                this.score.state = "ranking"
            }

        }
    }

    setContinueAvailable(isAvailable) {
        const continueOption = this.menu.options.find(
            option => option.appState === "continue game"
        )

        if (continueOption) {
            continueOption.isAvailable = isAvailable
        }
    }

    destroyGame() {
        if (this.game !== null) {
            this.game.destroyEntities()
            this.game = null
        }

        this.setContinueAvailable(false)
    }

}
