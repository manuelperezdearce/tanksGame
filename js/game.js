/** @type {HTMLCanvasElement} */

import { stages } from "/js/stages/stagesDATA.js";
import { Player } from "/js/entities/player.js";
import { Enemy } from "/js/entities/enemy.js";
import { HUD } from "/js/entities/hud.js";
import { Bullet } from "/js/entities/bullet.js";
import { Stage } from "/js/stages/stage.js";
import { Colision } from "./colision.js";

const debug = {
    showHitboxes: false
}

// Calcular posicion del Canvas respecto a DOM

const canvaStyle = getComputedStyle(canvas)
const canvasBorderWidth = parseFloat(canvaStyle.borderLeftWidth)




// Iniciar Entidades


const stage = new Stage(stages[1], canvas)

const hud = new HUD()
const player = new Player(canvas, true, true, 200, 300)
allies.push(player)


enemies.push(new Player(canvas, false, false, 500, 500))
enemies.push(new Player(canvas, false, false, 100, 500))
enemies.push(new Player(canvas, false, false, 300, 700))
enemies.push(new Player(canvas, false, false, 600, 700))


export class Game {
    constructor(canvas) {

        this.canvas = canvas
        this.enemiesKilled = 0

        // Colecciones
        let allies = []
        let bullets = []
        let enemies = []

    }

    ///// ACTUALIZAR ////////

    update(deltaTime) {

        stage.update(deltaTime, player.life, enemies.length)

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
            player.lifethis.enemiesKilledthis.enemiesKilled * 10,
            mousePosition,
            enemies.length,
            allies.length,
            stage
        )

    }

    /// DIBUJAR
    draw() {

        // CAPA 1 - Mundo
        stage.draw(context)

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
                    this.enemiesKilled++;
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



