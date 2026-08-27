export class Settings {
    constructor(values = {}) {
        this.storageKey = "tanksStorage"
        this.dimensions = { w: 360, h: 460 }
        this.selectedIndex = 0

        this.music = {
            enabled: values.music?.enabled ?? true,
            volume: this.normalizeVolume(values.music?.volume ?? 0.3)
        }

        this.effects = {
            enabled: values.effects?.enabled ?? true,
            volume: this.normalizeVolume(values.effects?.volume ?? 0.3)
        }
    }

    update(input) {
        const touchButtons = input.touchButtons
        const keysPressed = input.keyboard.pressed

        const optionsLength = 5

        if (
            keysPressed.ArrowDown ||
            keysPressed.s ||
            touchButtons.pressed.dBottom
        ) {
            this.selectedIndex =
                (this.selectedIndex + 1) % optionsLength
        }

        if (
            keysPressed.ArrowUp ||
            keysPressed.w ||
            touchButtons.pressed.dTop
        ) {
            this.selectedIndex =
                (this.selectedIndex - 1 + optionsLength) % optionsLength
        }

        if (keysPressed.Escape || touchButtons.pressed.B) {
            return { action: "back" }
        }

        if (keysPressed[" "] || touchButtons.pressed.A) {
            return this.selectOption()
        }

        if (
            keysPressed.a ||
            keysPressed.ArrowLeft ||
            touchButtons.pressed.dLeft
        ) {
            return this.changeSelectedVolume(-1)
        }

        if (
            keysPressed.d ||
            keysPressed.ArrowRight ||
            touchButtons.pressed.dRight
        ) {
            return this.changeSelectedVolume(1)
        }

        return null
    }

    resetSelection() {
        this.selectedIndex = 0
    }

    selectOption() {
        if (this.selectedIndex === 0) {
            this.toggleMusic()
            return { action: "changed" }
        }

        if (this.selectedIndex === 2) {
            this.toggleEffects()
            return { action: "changed" }
        }

        if (this.selectedIndex === 4) {
            return { action: "back" }
        }

        return null
    }

    changeSelectedVolume(direction) {
        if (this.selectedIndex === 1) {
            this.changeMusicVolume(direction)
            return { action: "changed" }
        }

        if (this.selectedIndex === 3) {
            this.changeEffectsVolume(direction)
            return { action: "changed" }
        }

        return null
    }

    load() {
        const defaults = {
            music: { enabled: true, volume: 0.3 },
            effects: { enabled: true, volume: 0.3 }
        }

        try {
            const data = localStorage.getItem(this.storageKey)
            const storage = data ? JSON.parse(data) : {}
            const values = storage.settings ?? defaults

            this.music = {
                enabled: typeof values.music?.enabled === "boolean"
                    ? values.music.enabled
                    : defaults.music.enabled,
                volume: this.normalizeVolume(
                    values.music?.volume ?? defaults.music.volume
                )
            }

            this.effects = {
                enabled: typeof values.effects?.enabled === "boolean"
                    ? values.effects.enabled
                    : defaults.effects.enabled,
                volume: this.normalizeVolume(
                    values.effects?.volume ?? defaults.effects.volume
                )
            }
        }
        catch (error) {
            console.log("Error loading settings", error)
        }

        return this
    }

    save() {
        try {
            const data = localStorage.getItem(this.storageKey)
            const parsedStorage = data ? JSON.parse(data) : {}
            const storage =
                parsedStorage &&
                    typeof parsedStorage === "object" &&
                    !Array.isArray(parsedStorage)
                    ? parsedStorage
                    : {}

            storage.version = 1
            storage.settings = {
                music: { ...this.music },
                effects: { ...this.effects }
            }
            storage.scores = Array.isArray(storage.scores)
                ? storage.scores
                : []

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(storage)
            )
        }
        catch (error) {
            console.log("Error saving settings", error)
        }
    }

    toggleMusic() {
        this.music.enabled = !this.music.enabled
    }

    toggleEffects() {
        this.effects.enabled = !this.effects.enabled
    }

    changeMusicVolume(direction) {
        this.music.volume = this.changeVolume(
            this.music.volume,
            direction
        )
    }

    changeEffectsVolume(direction) {
        this.effects.volume = this.changeVolume(
            this.effects.volume,
            direction
        )
    }

    changeVolume(currentVolume, direction) {
        return this.normalizeVolume(
            Math.round((currentVolume + direction * 0.1) * 10) / 10
        )
    }

    normalizeVolume(volume) {
        return Math.min(1, Math.max(0, Number(volume) || 0))
    }

    draw(context, position) {
        const objectPosition = {
            x: position.x - this.dimensions.w / 2,
            y: position.y - this.dimensions.h / 2
        }

        context.save()
        context.translate(objectPosition.x, objectPosition.y)

        context.fillStyle = "#181818e6"
        context.fillRect(
            0,
            0,
            this.dimensions.w,
            this.dimensions.h
        )

        context.fillStyle = "#ffffff"
        context.font = "bold 38px Arial"
        context.textAlign = "center"
        context.fillText("Settings", this.dimensions.w / 2, 70)

        const values = [
            `Music: ${this.music.enabled ? "ON" : "OFF"}`,
            `Music Volume: ${Math.round(this.music.volume * 100)}%`,
            `Effects: ${this.effects.enabled ? "ON" : "OFF"}`,
            `Effects Volume: ${Math.round(this.effects.volume * 100)}%`,
            "Back"
        ]

        context.font = "21px Arial"

        values.forEach((value, index) => {
            context.fillStyle = index === this.selectedIndex
                ? "#e7e408"
                : "#ffffff"

            context.fillText(
                value,
                this.dimensions.w / 2,
                140 + index * 50
            )
        })

        context.fillStyle = "#d24a38"
        context.font = "bold 16px Arial"
        context.fillText(
            'D-Pad: Move - A: Select - B: Back',
            this.dimensions.w / 2,
            this.dimensions.h - 20
        )

        context.restore()
    }
}