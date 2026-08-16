/** @type {HTMLCanvasElement} */

import { Player } from "./js/entities/player.js";
import { Enemy } from "./js/entities/enemy.js";
import { HUD } from "./js/entities/hud.js";
import { Bullet } from "./js/entities/bullet.js";

const debug = {
    showHitboxes: false
}

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const backgroundImage = new Image()
backgroundImage.src = "./assets/backgrounds/map_test.png"
// Calcular posicion del Canvas respecto a DOM

canvas.width = 800
canvas.height = 800
canvas.style.border = "8px solid #fff"

const canvaStyle = getComputedStyle(canvas)
const canvasBorderWidth = parseFloat(canvaStyle.borderLeftWidth)


// Variables globales
const keys = {}
const mousePosition = {}

// Colecciones
let allies = []
let bullets = []
let enemies = []

// Iniciar Entidades
const hud = new HUD()
const player = new Player(canvas, true, true, 200, 300)
allies.push(player)


enemies.push(new Player(canvas, false, false, 500, 500))
enemies.push(new Player(canvas, false, false, 100, 500))
enemies.push(new Player(canvas, false, false, 300, 700))
enemies.push(new Player(canvas, false, false, 600, 700))


// Counters
let enemiesKilled = 0

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
        player.mousePosition = mousePosition

    });
}
function detectarClick() {
    canvas.addEventListener("click", (event) => {

        const shotData = player.shoot()
        const bullet = new Bullet(canvas, shotData)
        bullets.push(bullet)
    })
}


function hayColision(a, b) {

    const aHitbox = a.getHitbox();
    const bHitbox = b.getHitbox();

    return (
        aHitbox.x < bHitbox.x + bHitbox.w &&
        aHitbox.x + aHitbox.w > bHitbox.x &&
        aHitbox.y < bHitbox.y + bHitbox.h &&
        aHitbox.y + aHitbox.h > bHitbox.y
    );
}

function checkBulletVsEnemy() {

    bullets.forEach((bullet) => {

        enemies.forEach((enemy) => {

            if (
                bullet.isAlive &&
                enemy.isAlive &&
                hayColision(bullet, enemy)
            ) {
                enemy.takeDamage(bullet.damage);
                bullet.isAlive = false;

                if (!enemy.isAlive) {
                    enemiesKilled++;
                }
            }
        });
    });
}

function cleanupEntities() {
    bullets = bullets.filter((bullet) => bullet.isAlive);
    enemies = enemies.filter((enemy) => enemy.isAlive);
}


function drawHitbox(entity) {

    const hitbox = entity.getHitbox()

    context.save()

    context.strokeStyle = "#00ff00"
    context.lineWidth = 2

    context.strokeRect(
        hitbox.x,
        hitbox.y,
        hitbox.w,
        hitbox.h
    )

    context.restore()
}
function drawHitboxes() {

    if (!debug.showHitboxes) {
        return
    }

    drawHitbox(player)

    enemies.forEach((enemy) => {
        drawHitbox(enemy)
    })

    bullets.forEach((bullet) => {
        drawHitbox(bullet)
    })
}

function drawBackground() {

    context.drawImage(
        backgroundImage,
        0,
        0,
        canvas.width,
        canvas.height
    )
}
///// ACTUALIZAR ////////

function update(deltaTime) {


    player.update(deltaTime, keys, mousePosition);

    enemies.forEach((enemy) => {
        enemy.update(deltaTime, "", "", player);
    });

    bullets.forEach((bullet) => {
        bullet.update(deltaTime);
    });

    checkBulletVsEnemy();

    cleanupEntities();

    hud.update(
        player.life,
        enemiesKilled,
        enemiesKilled * 10,
        mousePosition,
        enemies.length,
        allies.length
    )

}

function draw() {

    // CAPA 1 - Mundo
    drawBackground()

    // CAPA 2 - Entidades
    player.draw(context)

    enemies.forEach((enemy) => {
        enemy.draw(context)
    })

    bullets.forEach((bullet) => {
        bullet.draw(context)
    })

    // CAPA 3 - Debug
    drawHitboxes()

    // CAPA 4 - Interfaz
    hud.draw(canvas, context)
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height)
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

    requestAnimationFrame(gameLoop);


}

detectarTeclado()
detectarMouse()
detectarClick()
requestAnimationFrame(gameLoop);


