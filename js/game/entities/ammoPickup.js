export class AmmoPickup {
    constructor(position, amount = 5) {
        this.position = position
        this.amount = amount
        this.dimensions = { w: 28, h: 42 }
        this.isActive = true

        this.image = new Image()
        this.image.src = "./assets/bullets/bullets.png"
        this.source = {
            x: 100,
            y: 190,
            w: 130,
            h: 280
        }
    }

    draw(context) {
        context.save()
        context.translate(this.position.x, this.position.y)

        if (this.image.complete && this.image.naturalWidth > 0) {
            context.drawImage(
                this.image,
                this.source.x,
                this.source.y,
                this.source.w,
                this.source.h,
                -this.dimensions.w / 2,
                -this.dimensions.h / 2,
                this.dimensions.w,
                this.dimensions.h
            )
        }

        context.restore()
    }
}
