/** @type {HTMLCanvasElement} */

import { stages } from "./stages/stagesDATA.js";
import { Player } from "./entities/player.js";
import { IA } from "./entities/IA.js";
import { HUD } from "./entities/hud.js";
import { Bullet } from "./entities/bullet.js";
import { AmmoPickup, LifePickup } from "./entities/Pickup.js";
import { Stage } from "./stages/stage.js";
import { Collision } from "./collision.js";

export class Game {
    constructor(effectsEnabled = true, effectsVolume = 0.3) {


        this.currentStageid = 1
        // Iniciar Entidades
        this.stage = new Stage(stages[this.currentStageid])
        this.hud = new HUD()
        this.player = new Player(true, true, 500, 500)
        this.collision = new Collision()
        // allies.push(player)

        this.enemiesKilled = 0
        this.score = 0

        /// ready, running, stageSummary, finished
        this.state = "ready"
        this.result = null  //// completed, gameOver
        this.stateAfterReady = "running"

        // Colecciones
        this.allies = []
        this.bullets = []
        this.ammoPickups = []
        this.lifePickups = []
        this.enemies = []
        this.enemyIAs = new Map()
        this.worldBounds = { width: 800, height: 800 }

        this.effectsEnabled = effectsEnabled
        this.effectsVolume = effectsVolume

        this.shotSounds = Array.from(
            { length: 6 },
            () => {
                const sound =
                    new Audio("./assets/audio/shot.wav")

                sound.volume = this.effectsVolume
                sound.preload = "auto"

                return sound
            }
        )

        this.nextShotSoundIndex = 0

        this.debug = false

    }

    ///// ACTUALIZAR ////////

    update(
        deltaTime,
        input
    ) {
        if (this.state === "ready") {
            this.updateHUD(input)

            if (
                input.keyboard.pressed[" "] ||
                input.touchButtons.pressed.A
            ) {
                this.state = this.stateAfterReady
            }

            return
        }

        if (this.state === "running") {
            const stageEvents = this.stage.update(
                deltaTime,
                this.player.life,
                this.enemies.length)

            stageEvents.forEach(event => {
                if (event.type === "spawnEnemy") {
                    this.spawnEnemies(event)
                }

                if (event.type === "spawnAmmo") {
                    this.spawnAmmo(event)
                }
                if (event.type === "spawnLife") {
                    this.spawnLife(event)
                }
            })

            if (this.stage.state === "finished") {
                this.state = "stageSummary"
                return
            }


            this.player.update(
                deltaTime,
                input
            );

            if (
                input.pointer.pressed ||
                input.touchButtons.pressed.X
            ) {

                const shotData = this.player.shoot()

                if (shotData) {
                    this.bullets.push(new Bullet(shotData))
                    this.playShotSound()
                }
            }

            this.enemies.forEach(enemy => {
                const enemyInput = this.enemyIAs.get(enemy).update(
                    deltaTime,
                    { target: this.player }
                )

                enemy.update(
                    deltaTime,
                    enemyInput
                )

                if (enemyInput.pointer.pressed) {
                    enemy.debugShotTarget = {
                        ...enemyInput.pointer.position
                    }

                    const shotData = enemy.shoot()

                    if (shotData) {
                        this.bullets.push(new Bullet(shotData))
                        this.playShotSound()
                    }
                }
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

            this.enemies.forEach(enemy => {
                const enemyBounds = this.collision.checkWorldBounds(
                    enemy,
                    this.worldBounds
                )

                if (
                    enemyBounds.left ||
                    enemyBounds.right ||
                    enemyBounds.top ||
                    enemyBounds.bottom
                ) {
                    enemy.correctWorldCollision(
                        enemyBounds,
                        this.worldBounds
                    )
                }
            })

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
            this.checkBulletVsPlayer();
            this.collectAmmoPickups();
            this.collectLifePickups();

            this.cleanupEntities();

            this.score = this.enemiesKilled * 10

            this.updateHUD(input)
        }

        if (
            this.state === "stageSummary" &&
            (input.keyboard.pressed[" "] || input.touchButtons.pressed.A)
        ) {
            this.continueAfterStage()
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

        this.ammoPickups.forEach(pickup => {
            pickup.draw(context)
        })

        this.lifePickups.forEach(pickup => {
            pickup.draw(context)
        })

        // CAPA 3 - Interfaz
        this.hud.draw(canvas, context)

        // CAPA 4 - Debug

        if (this.debug) {
            this.drawSelfDebug(context, canvas)
            this.drawEnemyAimDebug(context)
        }

        if (this.state === "ready") {
            this.drawReady(context, canvas)
        }

        if (this.state === "stageSummary") {
            this.drawStageSummary(context, canvas)
        }
    }

    drawSelfDebug(context, canvas) {
        context.fillStyle = "#fff"
        context.font = `15px Arial`
        context.fillText(
            `Game Status: ${this.state}`,
            0,
            canvas.height
        )
        context.fillText(
            `Bullets: ${this.bullets.length}`,
            0,
            canvas.height - 15
        )
    }

    drawEnemyAimDebug(context) {
        this.enemies.forEach(enemy => {
            const target = enemy.debugShotTarget

            if (!target) {
                return
            }

            context.save()
            context.strokeStyle = "#ff00ff"
            context.fillStyle = "#ff00ff"
            context.lineWidth = 2

            context.beginPath()
            context.moveTo(enemy.position.x, enemy.position.y)
            context.lineTo(target.x, target.y)
            context.stroke()

            context.beginPath()
            context.moveTo(target.x - 8, target.y)
            context.lineTo(target.x + 8, target.y)
            context.moveTo(target.x, target.y - 8)
            context.lineTo(target.x, target.y + 8)
            context.stroke()

            context.font = "12px Arial"
            context.fillText(
                "AIM",
                target.x + 10,
                target.y - 10
            )
            context.restore()
        })
    }

    checkBulletVsEnemy() {

        this.bullets.forEach((bullet) => {

            this.enemies.forEach((enemy) => {

                if (
                    bullet.team === "ally" &&
                    bullet.isAlive &&
                    enemy.isAlive &&
                    this.collision.checkAABB(bullet, enemy)
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

    checkBulletVsPlayer() {
        this.bullets.forEach(bullet => {
            if (
                bullet.team === "enemy" &&
                bullet.isAlive &&
                this.player.isAlive &&
                this.collision.checkAABB(bullet, this.player)
            ) {
                this.player.takeDamage(bullet.damage)
                bullet.destroy()
            }
        })
    }

    cleanupEntities() {
        this.bullets = this.bullets.filter((bullet) => bullet.isAlive);
        this.ammoPickups = this.ammoPickups.filter(
            pickup => pickup.isActive
        )
        this.lifePickups = this.lifePickups.filter(
            pickup => pickup.isActive
        )
        this.enemies = this.enemies.filter((enemy) => enemy.isAlive);

        this.enemyIAs.forEach((ai, enemy) => {
            if (!enemy.isAlive) {
                this.enemyIAs.delete(enemy)
            }
        })

    }

    updateHUD(input) {
        const enemiesDefeated =
            this.stage.spawnedEnemies - this.enemies.length

        this.hud.update(
            this.player.life,
            this.score,
            input.pointer.position,
            enemiesDefeated,
            this.stage.totalEnemies,
            this.stage,
            this.player.ammo,
            this.player.maxAmmo,
            input
        )
    }

    /// ACTIONS

    playShotSound() {
        if (!this.effectsEnabled) {
            return
        }

        const sound =
            this.shotSounds[this.nextShotSoundIndex]

        sound.currentTime = 0

        sound.play().catch(() => {
            // El juego continúa si el navegador bloquea el audio.
        })

        this.nextShotSoundIndex++

        if (
            this.nextShotSoundIndex >=
            this.shotSounds.length
        ) {
            this.nextShotSoundIndex = 0
        }
    }

    setEffectsSettings(enabled, volume) {
        this.effectsEnabled = enabled
        this.effectsVolume = volume

        this.shotSounds.forEach(sound => {
            sound.volume = volume
        })
    }

    spawnEnemies(event) {
        for (let index = 0; index < event.amount; index++) {
            const position = this.getSpawnPosition(
                event.side,
                index,
                event.amount
            )

            const enemy = new Player(false, false, position.x, position.y)
            const ai = new IA(enemy, this.player)

            this.enemies.push(enemy)
            this.enemyIAs.set(enemy, ai)

            this.stage.spawnedEnemies++
        }
    }

    spawnAmmo(event) {
        if (this.ammoPickups.length >= 3) {
            return
        }

        this.ammoPickups.push(
            new AmmoPickup(
                this.getPickupSpawnPosition(),
                event.amount
            )
        )
    }

    spawnLife(event) {
        if (this.lifePickups.length >= 3) {
            return
        }

        this.lifePickups.push(
            new LifePickup(
                this.getPickupSpawnPosition(),
                event.amount
            )
        )
    }

    getPickupSpawnPosition() {
        const margin = 60

        return {
            x: margin + Math.random() * (this.worldBounds.width - margin * 2),
            y: margin + Math.random() * (this.worldBounds.height - margin * 2)
        }
    }

    collectAmmoPickups() {
        this.ammoPickups.forEach(pickup => {
            if (
                pickup.isActive &&
                this.collision.checkAABB(this.player, pickup)
            ) {
                this.player.ammo = Math.min(
                    this.player.maxAmmo,
                    this.player.ammo + pickup.amount
                )
                pickup.isActive = false
            }
        })
    }
    collectLifePickups() {
        this.lifePickups.forEach(pickup => {
            if (
                pickup.isActive &&
                this.collision.checkAABB(this.player, pickup)
            ) {
                this.player.recoverLife(pickup.amount)
                pickup.isActive = false
            }
        })
    }

    getSpawnPosition(side, index, amount) {
        const margin = 40
        const horizontalSpace = this.worldBounds.width - margin * 2
        const verticalSpace = this.worldBounds.height - margin * 2
        const ratio = (index + 1) / (amount + 1)

        if (side === "top") {
            return { x: margin + horizontalSpace * ratio, y: margin }
        }

        if (side === "bottom") {
            return {
                x: margin + horizontalSpace * ratio,
                y: this.worldBounds.height - margin
            }
        }

        if (side === "left") {
            return { x: margin, y: margin + verticalSpace * ratio }
        }

        return {
            x: this.worldBounds.width - margin,
            y: margin + verticalSpace * ratio
        }
    }

    nextStage() {
        const nextStageId = this.currentStageid + 1
        if (stages[nextStageId]) {
            this.currentStageid = nextStageId
            this.loadStage(this.currentStageid)
        }
        else {
            this.finish("completed")
        }
    }

    loadStage(stageId) {
        this.stage = new Stage(stages[stageId])
        this.player.position = { x: 500, y: 500 }
        this.player.tank.hp = 5
        this.player.life = this.player.tank.hp
        this.player.isAlive = true
        this.player.ammo = this.player.maxAmmo
        this.ammoPickups = []
        this.lifePickups = []
        this.enemies = []
        this.bullets = []
        this.stateAfterReady = "running"
        this.state = "ready"
        this.enemyIAs.clear()
    }

    prepareToContinue() {
        if (this.state === "running") {
            this.stateAfterReady = "running"
            this.state = "ready"
        }
    }

    continueAfterStage() {
        if (this.stage.result === "completed") {
            this.nextStage()
        }
        else {
            this.finish("gameOver")
        }
    }

    finish(result) {
        this.result = result
        this.state = "finished"
    }

    destroyEntities() {
        this.allies = []
        this.bullets = []
        this.ammoPickups = []
        this.enemies = []
        this.enemyIAs.clear()
    }

    /// DRAWS

    drawReady(context, canvas) {

        const centerOf = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }
        const divDimensions = {
            w: 300,
            h: 400
        }

        context.save()
        context.translate(
            centerOf.x - divDimensions.w / 2,
            centerOf.y - divDimensions.h / 2
        )
        context.fillStyle = "#181818cb"
        context.fillRect(
            0,
            0,
            divDimensions.w,
            divDimensions.h
        )

        context.fillStyle = "#ffffff"
        context.font = "bold 40px Arial"
        context.fillText(
            "READY?",
            divDimensions.w / 2 - 70,
            divDimensions.h / 3
        )

        context.font = "bold 20px Arial"
        context.fillText(
            "Press A to continue",
            divDimensions.w / 2 - 95,
            divDimensions.h / 2
        )
        context.restore()
    }

    drawStageSummary(context, canvas) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const completed = this.stage.result === "completed"

        context.save()
        context.fillStyle = "#181818cb"
        context.fillRect(centerX - 170, centerY - 150, 340, 300)
        context.textAlign = "center"
        context.fillStyle = completed ? "#2ea300" : "#e40f0f"
        context.font = "bold 36px Arial"
        context.fillText(
            completed ? "STAGE COMPLETED" : "STAGE FAILED",
            centerX,
            centerY - 70
        )
        context.fillStyle = "#fff"
        context.font = "20px Arial"
        context.fillText(`Score: ${this.score}`, centerX, centerY)
        context.fillText("Press A to Continue", centerX, centerY + 80)
        context.restore()
    }

}

