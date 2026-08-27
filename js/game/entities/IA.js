export class IA {
    constructor(controlledPlayer, target = null, options = {}) {
        this.controlledPlayer = controlledPlayer
        this.target = target

        this.minDistance = options.minDistance ?? 180
        this.maxDistance = options.maxDistance ?? 320
        this.fireCooldown = options.fireCooldown ?? 2.5
        this.fireCooldownVariation =
            options.fireCooldownVariation ?? 0.5
        this.initialShotDelay = options.initialShotDelay ?? 1
        this.initialShotDelayVariation =
            options.initialShotDelayVariation ?? 0.5
        this.fireCooldownMin = options.fireCooldownMin
        this.fireCooldownMax = options.fireCooldownMax
        this.initialShotDelayMin = options.initialShotDelayMin
        this.initialShotDelayMax = options.initialShotDelayMax
        this.timeUntilNextShot = this.randomDelay(
            this.initialShotDelay,
            this.initialShotDelayVariation,
            this.initialShotDelayMin,
            this.initialShotDelayMax
        )
        this.accuracy = this.normalizeAccuracy(options.accuracy ?? 0.01)
        this.maxAimError = options.maxAimError ?? 200

        this.input = this.createInput()
    }

    update(deltaTime, worldState = {}) {
        const controlledPlayer =
            worldState.controlledPlayer ?? this.controlledPlayer
        const target = worldState.target ?? this.target

        this.input = this.createInput()

        if (!controlledPlayer || !target) {
            return this.input
        }

        const dx = target.position.x - controlledPlayer.position.x
        const dy = target.position.y - controlledPlayer.position.y
        const distance = Math.hypot(dx, dy)
        const targetAngle = Math.atan2(dy, dx)
        const angleDifference = Math.atan2(
            Math.sin(targetAngle - controlledPlayer.angle),
            Math.cos(targetAngle - controlledPlayer.angle)
        )

        const movement = distance > this.maxDistance
            ? 1
            : distance < this.minDistance
                ? -1
                : 0

        this.input.keyboard.held = {
            w: movement > 0,
            s: movement < 0,
            a: angleDifference < -0.05,
            d: angleDifference > 0.05
        }
        this.input.pointer.position = {
            x: target.position.x,
            y: target.position.y
        }

        this.timeUntilNextShot -= deltaTime
        if (this.timeUntilNextShot <= 0) {
            const aimOffset = this.createAimOffset()

            this.input.pointer.position = {
                x: target.position.x + aimOffset.x,
                y: target.position.y + aimOffset.y
            }
            this.input.pointer.pressed = true
            this.timeUntilNextShot = this.randomDelay(
                this.fireCooldown,
                this.fireCooldownVariation,
                this.fireCooldownMin,
                this.fireCooldownMax
            )
        }

        return this.input
    }

    createAimOffset() {
        if (Math.random() < this.accuracy) {
            return { x: 0, y: 0 }
        }

        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * this.maxAimError

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance
        }
    }

    normalizeAccuracy(accuracy) {
        return Math.min(1, Math.max(0, Number(accuracy) || 0))
    }

    randomDelay(baseDelay, variation, minimum, maximum) {
        const base = Math.max(0, Number(baseDelay) || 0)
        const range = Math.max(0, Number(variation) || 0)
        const calculatedMinimum = base * Math.max(0, 1 - range)
        const calculatedMaximum = base * (1 + range)
        const delayMinimum = minimum ?? calculatedMinimum
        const delayMaximum = maximum ?? calculatedMaximum

        return delayMinimum +
            Math.random() * (delayMaximum - delayMinimum)
    }

    createInput() {
        return {
            keyboard: {
                held: {},
                pressed: {}
            },
            pointer: {
                position: { x: 0, y: 0 },
                held: false,
                pressed: false
            },
            joystick: {
                active: false,
                direction: null,
                magnitude: 0
            },
            touchButtons: {
                held: {},
                pressed: {}
            }
        }
    }
}
