/** @type {HTMLCanvasElement} */

import { stages } from "./stages/stagesDATA.js";
import { Player } from "./entities/player.js";
import { Enemy } from "./entities/enemy.js";
import { HUD } from "./entities/hud.js";
import { Bullet } from "./entities/bullet.js";
import { Stage } from "./stages/stage.js";
import { Collision } from "./collision.js";
import { EnterScore } from "./enterScore.js";

export class Game {
    constructor() {


        this.currentStageid = 1
        // Iniciar Entidades
        this.stage = new Stage(stages[this.currentStageid])
        this.hud = new HUD()
        this.player = new Player(true, true, 500, 500)
        this.collision = new Collision()
        // allies.push(player)

        this.enemiesKilled = 0
        this.enterScore = new EnterScore()
        this.score = 0
        this.status = "running" /// running, gameOver, completed, enterScore, finished

        // Colecciones
        this.allies = []
        this.bullets = []
        this.enemies = []
        this.worldBounds = { width: 800, height: 800 }

        this.debug = true

    }

    ///// ACTUALIZAR ////////

    update(deltaTime, keys, mousePosition, mouseClicked) {

        if (this.status === "running") {
            this.checkStageStatus()

            this.stage.update(
                deltaTime,
                this.player.life,
                this.enemies.length)


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
            });

            /// COLISIONES

            /// CON EL MAPA

            /// player

            const bounds = this.collision.checkWorldBounds(
                this.player,
                this.worldBounds
            )
            if (bounds.left || bounds.right || bounds.top || bounds.bottom) {
                this.player.correctWorldCollision(
                    bounds,
                    this.worldBounds
                )
            }

            /// bullets
            this.bullets.forEach((bullet) => {
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

        if (this.status === "gameOver" || this.status === "completed") {
            const playerName = this.enterScore.update(keys, this.score, this.status)
            if (playerName) {
                return {
                    action: "saveScore",
                    name: playerName,
                    score: this.score
                }
            }
        }



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

        if (this.debug) {
            this.drawSelfDebug(context, canvas)
        }

        if (this.status === "gameOver" || this.status === "completed") {
            this.enterScore.draw(context, canvas)
        }
    }

    drawSelfDebug(context, canvas) {
        context.fillStyle = "#fff"
        context.font = `15px Arial`
        context.fillText(
            `Game Status: ${this.status}`,
            0,
            canvas.height
        )
        context.fillText(
            `Bullets: ${this.bullets.length}`,
            0,
            canvas.height - 15
        )
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

    /// ACTIONS

    nextStage() {
        const nextStageId = this.currentStageid + 1
        if (stages[nextStageId]) {
            this.currentStageid = nextStageId
            this.loadStage(this.currentStageid)
        }
        else {
            this.status = "completed"
        }
    }

    loadStage(stageId) {
        this.stage = new Stage(stages[stageId])
        this.player.position = { x: 500, y: 500 }
        this.enemies = []
        this.bullets = []
    }

    gameOver() {
        this.status = "gameOver"
    }

    /// UTILIDADES

    checkStageStatus() {

        if (this.stage.status === "completed") {
            this.nextStage()
        }
        if (this.stage.status === "failed") {
            this.gameOver()
        }
    }

}

