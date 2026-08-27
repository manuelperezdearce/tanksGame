export class Collision {
    constructor() {

    }

    update() {

    }

    draw() {

    }

    getAABB(entity) {

        return {
            x: entity.position.x - entity.dimensions.w / 2,
            y: entity.position.y - entity.dimensions.h / 2,
            w: entity.dimensions.w,
            h: entity.dimensions.h
        }

    }


    checkAABB(a, b) {
        const hitboxA = this.getAABB(a)
        const hitboxB = this.getAABB(b)

        return (
            hitboxA.x < hitboxB.x + hitboxB.w &&
            hitboxA.x + hitboxA.w > hitboxB.x &&
            hitboxA.y < hitboxB.y + hitboxB.h &&
            hitboxA.y + hitboxA.h > hitboxB.y
        )
    }

    checkWorldBounds(entity, worldBounds) {

        const hitbox = this.getAABB(entity)

        return {
            left: hitbox.x < 0,
            right: hitbox.x + hitbox.w > worldBounds.width,
            top: hitbox.y < 0,
            bottom: hitbox.y + hitbox.h > worldBounds.height
        }
    }

}