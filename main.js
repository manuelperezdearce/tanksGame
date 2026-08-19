/** @type {HTMLCanvasElement} */
import { App } from "./js/app.js";

const canvas = document.getElementById("gameCanvas")

canvas.width = 800
canvas.height = 800
canvas.style.border = "2px solid #fff"
canvas.style.backgroundImage = "url(/assets/bg.png)"
canvas.style.backgroundPosition = "center"
canvas.style.backgroundSize = "cover"

const app = new App(canvas)

app.start()

