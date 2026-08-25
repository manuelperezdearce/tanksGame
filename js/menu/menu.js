export class Menu {
    constructor() {
        this.dimensions = { w: 360, h: 460 }
        this.position = { x: 0, y: 0 }

        this.state = "main"
        this.selectedIndex = 0
        this.settingsSelectedIndex = 0
        this.availableOptions = []

        this.options = [
            {
                menuName: "Continue",
                appState: "continue game",
                isAvailable: false
            },
            {
                menuName: "New Game",
                appState: "new game",
                isAvailable: true
            },
            {
                menuName: "Scores",
                appState: "score",
                isAvailable: true
            },
            {
                menuName: "Settings",
                appState: "settings",
                isAvailable: true
            },
            {
                menuName: "About",
                appState: "about",
                isAvailable: true
            }
        ]

        this.settingsOptions = [
            "musicEnabled",
            "musicVolume",
            "effectsEnabled",
            "effectsVolume",
            "back"
        ]

        this.audioSettings = {
            music: { enabled: true, volume: 0.3 },
            effects: { enabled: true, volume: 0.3 }
        }
    }

    update(keysPressed, canvas) {
        this.position = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        if (this.state === "settings") {
            return this.updateSettings(keysPressed)
        }

        return this.updateMain(keysPressed)
    }

    updateMain(keysPressed) {
        this.availableOptions = this.options.filter(
            option => option.isAvailable
        )

        this.selectedIndex = this.moveSelection(
            keysPressed,
            this.selectedIndex,
            this.availableOptions.length
        )

        if (keysPressed[" "]) {
            const selectedOption =
                this.availableOptions[this.selectedIndex]

            if (selectedOption.appState === "settings") {
                this.state = "settings"
                this.settingsSelectedIndex = 0
                return null
            }

            return selectedOption
        }

        return null
    }

    updateSettings(keysPressed) {
        if (keysPressed.Escape) {
            this.state = "main"
            return null
        }

        this.settingsSelectedIndex = this.moveSelection(
            keysPressed,
            this.settingsSelectedIndex,
            this.settingsOptions.length
        )

        const selectedSetting =
            this.settingsOptions[this.settingsSelectedIndex]

        if (keysPressed[" "]) {
            if (selectedSetting === "musicEnabled") {
                return { action: "toggleMusic" }
            }

            if (selectedSetting === "effectsEnabled") {
                return { action: "toggleEffects" }
            }

            if (selectedSetting === "back") {
                this.state = "main"
            }
        }

        const decrease =
            keysPressed.a || keysPressed.ArrowLeft
        const increase =
            keysPressed.d || keysPressed.ArrowRight

        if (decrease || increase) {
            const direction = increase ? 1 : -1

            if (selectedSetting === "musicVolume") {
                return {
                    action: "changeMusicVolume",
                    direction
                }
            }

            if (selectedSetting === "effectsVolume") {
                return {
                    action: "changeEffectsVolume",
                    direction
                }
            }
        }

        return null
    }

    moveSelection(keysPressed, currentIndex, optionsLength) {
        if (keysPressed.ArrowDown || keysPressed.s) {
            return (currentIndex + 1) % optionsLength
        }

        if (keysPressed.ArrowUp || keysPressed.w) {
            return (currentIndex - 1 + optionsLength) % optionsLength
        }

        return currentIndex
    }

    setAudioSettings(settings) {
        this.audioSettings = settings
    }

    draw(context) {
        const objectPosition = {
            x: this.position.x - this.dimensions.w / 2,
            y: this.position.y - this.dimensions.h / 2
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

        if (this.state === "settings") {
            this.drawSettings(context)
        }
        else {
            this.drawMain(context)
        }

        context.restore()
    }

    drawMain(context) {
        context.fillStyle = "#ffffff"
        context.font = "bold 40px Arial"
        context.textAlign = "center"
        context.fillText("Main Menu", this.dimensions.w / 2, 80)

        context.font = "24px Arial"

        this.availableOptions.forEach((option, index) => {
            context.fillStyle = index === this.selectedIndex
                ? "#e7e408"
                : "#ffffff"

            context.fillText(
                option.menuName,
                this.dimensions.w / 2,
                180 + index * 50
            )
        })

        this.drawHelp(
            context,
            'Use "W/S" to Move - "Space" to Select'
        )
    }

    drawSettings(context) {
        context.fillStyle = "#ffffff"
        context.font = "bold 38px Arial"
        context.textAlign = "center"
        context.fillText("Settings", this.dimensions.w / 2, 70)

        const values = [
            `Music: ${this.audioSettings.music.enabled ? "ON" : "OFF"}`,
            `Music Volume: ${Math.round(this.audioSettings.music.volume * 100)}%`,
            `Effects: ${this.audioSettings.effects.enabled ? "ON" : "OFF"}`,
            `Effects Volume: ${Math.round(this.audioSettings.effects.volume * 100)}%`,
            "Back"
        ]

        context.font = "21px Arial"

        values.forEach((value, index) => {
            context.fillStyle = index === this.settingsSelectedIndex
                ? "#e7e408"
                : "#ffffff"

            context.fillText(
                value,
                this.dimensions.w / 2,
                140 + index * 50
            )
        })

        this.drawHelp(
            context,
            'W/S: Move  A/D: Volume  Space: Toggle'
        )
    }

    drawHelp(context, text) {
        context.fillStyle = "#d24a38"
        context.font = "bold 13px Arial"
        context.textAlign = "center"
        context.fillText(
            text,
            this.dimensions.w / 2,
            this.dimensions.h - 20
        )
    }
}
