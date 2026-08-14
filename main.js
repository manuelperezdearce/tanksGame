/** @type {HTMLCanvasElement} */

import { Bullet } from "./js/entities/bullet.js";
import { Canon } from "./js/entities/canon.js";
import { Player } from "./js/entities/player.js";
import { Enemy } from "./js/entities/enemy.js";

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
// Calcular posicion del Canvas respecto a DOM

canvas.width = 800
canvas.height = 800
canvas.style.border = "8px solid #fff"

const canvaStyle = getComputedStyle(canvas)
const canvasBorderWidth = parseFloat(canvaStyle.borderLeftWidth)


// Variables globales
const keys = {}
const mousePosition = {}
let bullets = []
let enemies = []
let enemiesKilled = 0

// Iniciar Entidades
const player = new Player(canvas)
const canon = new Canon()
const enemy = new Enemy()
enemies = [enemy]



function detectarTeclado() {
    window.addEventListener("keydown", (event) => {
        keys[event.key] = true
    })

    window.addEventListener("keyup", (event) => {
        keys[event.key] = false
    })

}
function detectarMouse() {
    canvas.addEventListener("mousemove", (event) => {

        const rect = canvas.getBoundingClientRect();

        mousePosition.x = event.clientX - rect.left - canvasBorderWidth;
        mousePosition.y = event.clientY - rect.top - canvasBorderWidth;

    });
}
function detectarClick() {
    canvas.addEventListener("click", (event) => {
        const bullet = new Bullet(canvas, canon)
        bullets.push(bullet)

    })
}


function hayColision(a, b) {
    return (
        a.position.x < b.position.x + b.dimensions.w &&
        a.position.x + a.dimensions.w > b.position.x &&
        a.position.y < b.position.y + b.dimensions.h &&
        a.position.y + a.dimensions.h > b.position.y
    );
}


function update(deltaTime) {

    player.moverJugador(deltaTime, keys)

    player.calcularPlayerCenter()
    canon.update(mousePosition, player)

    enemies.forEach((enemy, index) => {
        enemy.update(deltaTime)
    })

    bullets.forEach((bullet, index) => {
        bullet.update(deltaTime);
    })

    /// Comprobar Colisiones
    bullets.forEach((bullet, index) => {
        enemies.forEach((enemy, index) => {
            if (
                bullet.isAlive &&
                enemy.isAlive &&
                hayColision(bullet, enemy)
            ) {
                enemy.takeDamage(bullet.damage);
                bullet.isAlive = false;
                if (!enemy.isAlive) {
                    enemiesKilled += 1;
                }
            }
        })
    })



    bullets = bullets.filter((bullet) => bullet.isAlive === true)
    enemies = enemies.filter((enemy) => enemy.isAlive === true)

}

function draw() {
    player.dibujarJugador(context)
    canon.dibujarCanon(context)

    bullets.forEach((bullet, index) => {
        bullet.dibujarBala(context)
    })

    enemies.forEach((enemy, index) => {
        enemy.draw(context)
    })

    dibujarPuntero()
    drawHUD()
}

function drawHUD() {
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText(
        `Enemies killed: ${enemiesKilled}`,
        20,
        30
    );
}


function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function dibujarPuntero() {

    context.beginPath()
    context.fillStyle = "#e60bc931"
    context.arc(
        mousePosition.x,
        mousePosition.y,
        20,
        0,
        2 * Math.PI,
        true

    )
    context.fill()
}

///Loop

let previousTime = null
function gameLoop(currentTime) {

    if (previousTime == null) {
        previousTime = currentTime
    }

    let deltaTime = (currentTime - previousTime) / 1000
    previousTime = currentTime
    //Update
    update(deltaTime)
    //Clear
    clear()
    //Draw
    draw()
    /// averiguar que está presionado el usuario


    requestAnimationFrame(gameLoop);
}
detectarTeclado()
detectarMouse()
detectarClick()
requestAnimationFrame(gameLoop);