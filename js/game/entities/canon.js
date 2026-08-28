import { Bullet } from "./bullet.js"

export class Canon {
    constructor() {
        this.width = 25
        this.height = 50
        this.speedPlus = 1.6
        this.rotationSpeed = 2
        this.color = "#054d1d"
        this.angle = 0
        this.canonImage = new Image()
        this.canonImage.src = "./assets/canons/canon_basic1.png"
        this.direction = {
            x: 0,
            y: 0
        }
        this.startPosition = {
            x: 0,
            y: 0
        }
        this.exitPosition = {
            x: 0,
            y: 0
        }
        this.pivot = {
            x: this.width / 2,
            y: this.height / 1.25
        }
        this.canonOffset = Math.PI / 2

        this.muzzleFlashTime = 0
        this.muzzleFlashDuration = 0.08

    }

    update(mousePosition, canonMount, deltaTime) {
        this.calcularPosicionCanon(mousePosition, canonMount, deltaTime)
        this.calcularPosicionSalidaCanon()
        // if (this.muzzleFlashTime > 0) {
        //     this.muzzleFlashTime -= deltaTime
        // }

    }

    draw(context) {

        context.save();

        context.translate(this.startPosition.x, this.startPosition.y);
        context.rotate(this.angle + this.canonOffset);


        context.drawImage(
            this.canonImage,
            -this.pivot.x,
            -this.pivot.y,
            this.width,
            this.height
        );

        context.restore();
    }

    //// UTILIDADES //////
    createBullet(canvas, canon) {
        const bullet = new Bullet(canvas, canon)
        return bullet

    }

    /// ACTIONS
    getShotData() {
        this.muzzleFlashTime = this.muzzleFlashDuration
        return {
            position: {
                x: this.exitPosition.x,
                y: this.exitPosition.y
            },

            direction: {
                x: this.direction.x,
                y: this.direction.y
            },

            angle: this.angle,

            speedPlus: this.speedPlus
        };
    }



    //// UTILIDADES //////

    calcularPosicionSalidaCanon() {
        this.exitPosition.x =
            this.startPosition.x +
            this.direction.x * this.height;

        this.exitPosition.y =
            this.startPosition.y +
            this.direction.y * this.height;
        return this.exitPosition
    }

    calcularPosicionCanon(mousePosition, canonMount, deltaTime) {

        this.startPosition.x = canonMount.x;
        this.startPosition.y = canonMount.y;

        const targetDirectionX = mousePosition.x - this.startPosition.x;
        const targetDirectionY = mousePosition.y - this.startPosition.y;
        const targetAngle = Math.atan2(
            targetDirectionY,
            targetDirectionX
        );
        const angleDifference = Math.atan2(
            Math.sin(targetAngle - this.angle),
            Math.cos(targetAngle - this.angle)
        );
        const maxRotation = this.rotationSpeed * deltaTime;

        this.angle += Math.max(
            -maxRotation,
            Math.min(maxRotation, angleDifference)
        );

        this.direction.x = Math.cos(this.angle);
        this.direction.y = Math.sin(this.angle);
    }

}