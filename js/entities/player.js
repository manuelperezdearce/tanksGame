import { Tank } from "./tank.js"
import { Canon } from "./canon.js"

export class Player {
    constructor(isAlly, isHuman, positionX, positionY) {
        this.isAlly = isAlly
        this.team = ""
        this.isHuman = isHuman
        this.humanOrCPU = ""
        this.position = { x: positionX, y: positionY }
        this.tank = new Tank(this.position)
        this.canon = new Canon(this.tank.mount)
        this.life = this.tank.hp
        this.pointer = { x: 0, y: 0 }
        this.dimensions = { w: this.tank.width, h: this.tank.height }
        this.speed = this.tank.speed
        this.rotationSpeed = this.tank.rotationSpeed
        this.angle = - Math.PI / 2
        this.isAlive = true
        this.fireCooldown = 1.2
        this.timeUntilNextShot = 0
    }

    ////// GAME ///////
    update(deltaTime, keys, mousePosition, target) {

        if (this.isHuman) {

            this.move(deltaTime, keys)
            this.aim(mousePosition)

        } else {

            this.moveCPU(deltaTime, target)
            this.aimCPU(target)
        }
        if (!this.isHuman) {
            this.moveCPU(deltaTime, target)
            this.aimCPU(target)

            const shotData = this.shootCPU(deltaTime)

            if (shotData) {
                return shotData
            }
        }

        this.tank.update(
            this.position,
            this.angle
        )

        this.canon.update(
            this.pointer,
            this.tank.canonMount
        )
    }

    draw(context, canvas) {

        this.tank.draw(context, canvas)
        this.canon.draw(context, canvas)
        this.drawSelf(context, canvas)
    }

    drawSelf(context, canvas) {
        //// Aliado o enemigo

        if (this.isAlly) {
            this.team = "ally"
        } else {
            this.team = "enemy"
        }

        //// Point on Player
        context.beginPath()
        if (this.team == "ally") {
            context.fillStyle = " #1a28aa"
        }
        else { context.fillStyle = "#ff0000" }

        context.arc(
            this.position.x,
            this.position.y,
            5,
            0,
            2 * Math.PI,
            true
        )
        context.fill()

        context.fillStyle = "white";
        context.font = `10px Arial`;

        //// HUMAN O CPU

        if (this.isHuman) {
            this.humanOrCPU = "human"
        } else {
            this.humanOrCPU = "CPU"
        }

        //// Show Ally or Enemy
        context.fillText(
            this.team,
            this.position.x,
            this.position.y,
        );

        //// Show Human or IA
        context.fillText(
            this.humanOrCPU,
            this.position.x,
            this.position.y + 10,
        );

        context.fillText(
            this.life,
            this.position.x,
            this.position.y + 20,
        );
    }


    ///////////////////////////////////////////////////
    //////////////   ACCIONES  /////////////////////
    ///////////////////////////////////////////////////

    move(deltaTime, keys) {

        let movement = 0;
        let steering = 0;

        if (keys.w) {
            movement = 1;
        }

        if (keys.s) {
            movement = -1;
        }

        if (keys.a) {
            steering = -1;
        }

        if (keys.d) {
            steering = 1;
        }

        if (movement !== 0) {
            this.angle +=
                steering *
                this.rotationSpeed *
                deltaTime *
                movement;
        }

        const directionX = Math.cos(this.angle);
        const directionY = Math.sin(this.angle);

        const desplazamiento =
            this.speed *
            movement *
            deltaTime;

        this.position.x += directionX * desplazamiento;
        this.position.y += directionY * desplazamiento;

    }

    aim(mousePosition) {
        this.pointer.x = mousePosition.x
        this.pointer.y = mousePosition.y
    }
    aimCPU(target) {

        this.pointer.x =
            target.position.x

        this.pointer.y =
            target.position.y
    }

    shoot() {
        return this.canon.getShotData()
    }

    shootCPU(deltaTime) {

        this.timeUntilNextShot -= deltaTime

        if (this.timeUntilNextShot <= 0) {

            this.timeUntilNextShot = this.fireCooldown

            return this.shoot()
        }

        return null
    }

    ////// UTILIDADES //////

    takeDamage(bulletDamage) {
        this.tank.takeDamge(bulletDamage)
        this.life = this.tank.hp
        if (this.life <= 0) { this.isAlive = false }
    }

    moveCPU(deltaTime, target) {

        const dx =
            target.position.x -
            this.position.x

        const dy =
            target.position.y -
            this.position.y


        const distance = Math.sqrt(
            dx ** 2 +
            dy ** 2
        )


        const minDistance = 180
        const maxDistance = 320


        let movement = 0


        if (distance > maxDistance) {
            movement = 1
        }

        if (distance < minDistance) {
            movement = -1
        }


        const targetAngle =
            Math.atan2(dy, dx)


        let angleDifference =
            targetAngle -
            this.angle


        angleDifference =
            Math.atan2(
                Math.sin(angleDifference),
                Math.cos(angleDifference)
            )


        let steering = 0


        if (angleDifference < -0.05) {
            steering = -1
        }

        if (angleDifference > 0.05) {
            steering = 1
        }


        if (movement !== 0) {

            this.angle +=
                steering *
                this.rotationSpeed *
                deltaTime *
                movement
        }


        const directionX =
            Math.cos(this.angle)

        const directionY =
            Math.sin(this.angle)


        const desplazamiento =
            this.speed *
            movement *
            deltaTime


        this.position.x +=
            directionX *
            desplazamiento

        this.position.y +=
            directionY *
            desplazamiento

    }

    getHitbox() {
        return {
            x: this.position.x - this.dimensions.w / 2,
            y: this.position.y - this.dimensions.h / 2,
            w: this.dimensions.w,
            h: this.dimensions.h
        };
    }

    correctWorldCollision(bounds, worldBounds) {

        const halfWidth = this.dimensions.w / 2
        const halfHeight = this.dimensions.h / 2

        if (bounds.left) {
            this.position.x = halfWidth
        }

        if (bounds.right) {
            this.position.x = worldBounds.width - halfWidth
        }

        if (bounds.top) {
            this.position.y = halfHeight
        }

        if (bounds.bottom) {
            this.position.y = worldBounds.height - halfHeight
        }
    }
}



