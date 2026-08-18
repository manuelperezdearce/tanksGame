/** @type {HTMLCanvasElement} */

import { stages } from "./js/stages/stagesDATA.js";
import { Player } from "./js/entities/player.js";
import { Enemy } from "./js/entities/enemy.js";
import { HUD } from "./js/entities/hud.js";
import { Bullet } from "./js/entities/bullet.js";
import { Stage } from "./js/stages/stage.js";
import { Collision } from "./collision.js";

const debug = {
    showHitboxes: false
}

// Calcular posicion del Canvas respecto a DOM

// const canvaStyle = getComputedStyle(canvas)
// const canvasBorderWidth = parseFloat(canvaStyle.borderLeftWidth)

export class Game {
    constructor() {

        // Iniciar Entidades

        this.stage = new Stage(stages[1])
        this.hud = new HUD()
        this.player = new Player(true, true, 200, 300)
        this.collision = new Collision()
        // allies.push(player)

        this.enemiesKilled = 0

        // Colecciones
        this.allies = []
        this.bullets = []
        this.enemies = []
        this.worldBounds = { width: 800, height: 800 }

    }

    ///// ACTUALIZAR ////////

    update(deltaTime, keys, mousePosition, mouseClicked) {

        this.stage.update(deltaTime, this.player.life, this.enemies.length)

        this.player.update(deltaTime, keys, mousePosition);

        if (mouseClicked) {

            const shotData = this.player.shoot()

            const bullet = new Bullet(
                shotData
            )

            this.bullets.push(bullet)
        }

        this.enemies.forEach((enemy) => {
            enemy.update(deltaTime, "", "", this.player);
        });

        this.bullets.forEach((bullet) => {
            bullet.update(deltaTime);

            const bounds = this.collision.checkWorldBounds(
                bullet,
                this.worldBounds
            )

            if (
                bounds.left ||
                bounds.right ||
                bounds.top ||
                bounds.bottom
            ) {
                bullet.destroy()
            }

        });


        /// COLISIONES



        this.checkBulletVsEnemy();

        this.cleanupEntities();

        this.hud.update(
            this.player.life,
            this.enemiesKilled,
            this.enemiesKilled * 10,
            mousePosition,
            this.enemies.length,
            this.allies.length,
            this.stage,
            this.bullets
        )
    }

    /// DIBUJAR
    draw(context, canvas) {

        // CAPA 1 - Mundo
        this.stage.draw(context, canvas)

        // CAPA 2 - Entidades
        this.player.draw(context, canvas)


        if (this.enemies.length > 0) {
            this.enemies.forEach((enemy) => {
                enemy.draw(context)
            })
        }

        this.bullets.forEach((bullet) => {
            bullet.draw(context)
        })

        // CAPA 3 - Interfaz
        this.hud.draw(canvas, context)

        // CAPA 4 - Debug

        if (debug) {
            this.drawSelfDebug(context)
        }
    }

    drawSelfDebug(context) {
        this.drawHitboxes()
    }

    checkBulletVsEnemy() {

        this.bullets.forEach((bullet) => {

            this.enemies.forEach((enemy) => {

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

    cleanupEntities() {
        this.bullets = this.bullets.filter((bullet) => bullet.isAlive);
        this.enemies = this.enemies.filter((enemy) => enemy.isAlive);

    }
    drawHitbox(entity) {

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

    drawHitboxes() {

        if (!debug.showHitboxes) {
            return
        }

        drawHitbox(this.player)

        this.enemies.forEach((enemy) => {
            drawHitbox(enemy)
        })

        this.bullets.forEach((bullet) => {
            drawHitbox(bullet)
        })
    }

}

