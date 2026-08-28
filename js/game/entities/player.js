import { Tank } from "./tank.js"
import { Canon } from "./canon.js"

export class Player {
    constructor(isAlly, isHuman, positionX, positionY) {
        this.isAlly = isAlly
        this.team = isAlly ? "ally" : "enemy"
        this.isHuman = isHuman
        this.humanOrCPU = ""
        this.position = { x: positionX, y: positionY }
        this.tank = new Tank(this.position, this.team)
        this.canon = new Canon(this.tank.mount)
        this.tank.hp = this.isAlly ? 5 : 2
        this.maxLife = 5
        this.life = this.tank.hp
        this.maxAmmo = isHuman ? 10 : 8
        this.ammo = this.maxAmmo
        this.pointer = { x: positionX + 200, y: positionY }
        this.joystickRAiming = false
        this.dimensions = { w: this.tank.width, h: this.tank.height }
        this.speed = this.tank.speed
        this.rotationSpeed = this.tank.rotationSpeed
        this.angle = - Math.PI / 2
        this.isAlive = true
    }

    ////// GAME ///////
    update(
        deltaTime,
        input
    ) {
        if (input.joystick.direction) {
            this.moveWithJoystick(
                deltaTime,
                input.joystick.direction
            )
        } else {
            this.move(deltaTime, input.keyboard.held)
        }

        if (input.joystickR?.active) {
            if (input.joystickR.direction) {
                const aimDistance = 200

                this.pointer.x =
                    this.position.x + input.joystickR.direction.x * aimDistance
                this.pointer.y =
                    this.position.y + input.joystickR.direction.y * aimDistance
                this.joystickRAiming = true
            }
        } else if (!this.joystickRAiming) {
            this.aim({
                ...input.pointer.position
            })
        }

        this.tank.update(
            this.position,
            this.angle
        )

        this.canon.update(
            this.pointer,
            this.tank.canonMount,
            deltaTime
        )

    }

    draw(context, canvas) {

        this.tank.draw(context, canvas)
        this.canon.draw(context, canvas)
        if (this.isAlly) {
            this.drawAim(context)
        }
        this.drawSelf(context, canvas)
    }

    drawAim(context) {
        context.save()
        context.strokeStyle = "#ffffff"
        context.lineWidth = 2
        context.beginPath()
        context.arc(this.pointer.x, this.pointer.y, 10, 0, Math.PI * 2)
        context.moveTo(this.pointer.x - 16, this.pointer.y)
        context.lineTo(this.pointer.x + 16, this.pointer.y)
        context.moveTo(this.pointer.x, this.pointer.y - 16)
        context.lineTo(this.pointer.x, this.pointer.y + 16)
        context.stroke()
        context.restore()
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

    move(deltaTime, keysHeld) {

        let movement = 0;
        let steering = 0;

        if (keysHeld.w) {
            movement = 1;
        }

        if (keysHeld.s) {
            movement = -1;
        }

        if (keysHeld.a) {
            steering = -1;
        }

        if (keysHeld.d) {
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

    moveWithJoystick(deltaTime, direction) {
        const targetAngle = Math.atan2(direction.y, direction.x)
        const angleDifference = Math.atan2(
            Math.sin(targetAngle - this.angle),
            Math.cos(targetAngle - this.angle)
        )
        const maxRotation = this.rotationSpeed * deltaTime

        this.angle += Math.max(
            -maxRotation,
            Math.min(maxRotation, angleDifference)
        )

        this.position.x +=
            Math.cos(this.angle) *
            this.speed *
            deltaTime

        this.position.y +=
            Math.sin(this.angle) *
            this.speed *
            deltaTime
    }

    aim(mousePosition) {
        this.pointer.x = mousePosition.x
        this.pointer.y = mousePosition.y
    }

    shoot() {
        if (this.ammo <= 0) {
            return null
        }

        this.ammo--
        const shotData = this.canon.getShotData()
        shotData.team = this.isAlly ? "ally" : "enemy"

        return shotData
    }

    ////// UTILIDADES //////

    takeDamage(bulletDamage) {
        this.tank.takeDamge(bulletDamage)
        this.life = this.tank.hp
        if (this.life <= 0) { this.isAlive = false }
    }

    recoverLife(amount) {
        this.tank.hp = Math.min(
            this.maxLife,
            this.tank.hp + amount
        )
        this.life = this.tank.hp
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



