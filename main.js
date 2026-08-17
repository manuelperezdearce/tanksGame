/** @type {HTMLCanvasElement} */
import { App } from "./js/app.js";

const canvas = document.getElementById("gameCanvas")

canvas.width = 800
canvas.height = 800
canvas.style.border = "8px solid #fff"

const app = new App(canvas)

app.start()

