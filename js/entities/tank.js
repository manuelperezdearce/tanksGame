export class Tank {

    constructor(playerPosition) {

        this.width = 40
        this.height = 53
        this.hp = 10

        this.speed = 50
        this.rotationSpeed = 1

        this.centerOf = {
            x: playerPosition.x,
            y: playerPosition.y
        }

        this.angle = 0

        this.image = new Image()
        this.image.src = "./assets/tanks/tank_basic.png"

        this.spriteOffset = Math.PI / 2

        this.canonMount = {
            x: 0,
            y: 0
        }
    }

    update(playerPosition, angle) {

        this.calcularPlayerMount(playerPosition)
        this.calcularAngle(angle)
        this.calcularCanonPosition()
    }

    draw(context) {

        context.save()

        context.translate(
            this.centerOf.x,
            this.centerOf.y
        )

        context.rotate(
            this.angle + this.spriteOffset
        )

        context.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        )

        context.restore()
    }

    /// UTILIDADES

    calcularPlayerMount(playerPosition) {

        this.centerOf.x = playerPosition.x
        this.centerOf.y = playerPosition.y
    }

    calcularAngle(angle) {
        this.angle = angle
    }

    calcularCanonPosition() {
        this.canonMount.x = this.centerOf.x
        this.canonMount.y = this.centerOf.y
    }

    takeDamge(bulletDamage) {
        this.hp -= bulletDamage
    }
}