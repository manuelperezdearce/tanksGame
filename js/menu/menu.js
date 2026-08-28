export class Menu {
    constructor() {
        this.dimensions = { w: 360, h: 520 }
        this.position = { x: 0, y: 0 }

        this.state = "main"
        this.selectedIndex = 0
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
            },
            {
                menuName: "How to Play",
                appState: "how to play",
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

    update(touchButtons, keysPressed, canvas) {
        this.position = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        return this.updateMain(touchButtons, keysPressed)
    }

    updateMain(touchButtons, keysPressed) {
        this.availableOptions = this.options.filter(
            option => option.isAvailable
        )

        this.selectedIndex = this.moveSelection(
            touchButtons,
            keysPressed,
            this.selectedIndex,
            this.availableOptions.length
        )

        if (keysPressed[" "] || touchButtons.pressed.A) {
            const selectedOption =
                this.availableOptions[this.selectedIndex]

            return selectedOption
        }

        return null
    }

    moveSelection(touchButtons, keysPressed, currentIndex, optionsLength) {
        if (
            keysPressed.ArrowDown ||
            keysPressed.s ||
            touchButtons.pressed.dBottom
        ) {
            return (currentIndex + 1) % optionsLength
        }

        if (
            keysPressed.ArrowUp ||
            keysPressed.w ||
            touchButtons.pressed.dTop
        ) {
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

        this.drawMain(context)

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
            'D-Pad: Move - A: Select'
        )
    }

    drawHelp(context, text) {
        context.fillStyle = "#d24a38"
        context.font = "bold 16px Arial"
        context.textAlign = "center"
        context.fillText(
            text,
            this.dimensions.w / 2,
            this.dimensions.h - 20
        )
    }
}
