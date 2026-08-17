// import { Game } from "./game.js";
import { Menu } from "./menu.js";

export class App {
    constructor(canvas) {

        this.canvas = canvas
        this.context = canvas.getContext("2d")

        this.keys = {}
        this.mousePosition = { x: 0, y: 0 }

        this.state = "menu"
        this.menu = new Menu()
        this.game = null

        this.previousTime = null

        /// INPUT
        this.detectarTeclado()
    }

    update() {
        if (this.state === "menu") {
            this.menu.update(this.keys)
        }
        if (this.state === "game") {
            // this.game.update(this.canvas)
        }
    }

    draw() {
        this.selfDebug()
        if (this.state === "menu") {
            this.menu.draw(this.context, this.canvas)
        }

        if (this.state === "game") {
            // this.game.draw(this.context)
        }
    }

    appLoop(currentTime) {


        /// Calcular deltaTime
        if (this.previousTime == null) {
            this.previousTime = currentTime
        }
        let deltaTime = (currentTime - this.previousTime) / 1000
        this.previousTime = currentTime

        //Update
        this.update(deltaTime)
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
        canvas.addEventListener("mousemove", (event) => {

            // const rect = canvas.getBoundingClientRect();
            // mousePosition.x = event.clientX - rect.left - canvasBorderWidth;
            // mousePosition.y = event.clientY - rect.top - canvasBorderWidth;
            // player.mousePosition = mousePosition

        });
    }
    detectarClick() {
        canvas.addEventListener("click", (event) => {

            // const shotData = player.shoot()
            // const bullet = new Bullet(canvas, shotData)
            // bullets.push(bullet)
        })
    }

}