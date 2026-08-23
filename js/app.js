import { Game } from "./game.js";
import { Menu } from "./menu.js";
import { Score } from "./score.js";

export class App {
    constructor(canvas) {

        this.canvas = canvas
        this.context = canvas.getContext("2d")

        /// USER INPUTS
        this.keysHeld = {}
        this.keysPressed = {}
        this.mousePosition = { x: 0, y: 0 }
        this.mousePressed = false

        this.previousState = null
        this.state = "menu" /// menu score game pause
        this.menu = new Menu()
        this.score = new Score()
        this.game = null

        this.storageKey = "tanksStorage"
        this.settings = this.loadSettings()
        this.musicEnabled = this.settings.music.enabled
        this.musicVolume = this.settings.music.volume
        this.effectsEnabled = this.settings.effects.enabled
        this.effectsVolume = this.settings.effects.volume
        this.menu.setAudioSettings(this.settings)
        this.saveSettings()

        this.gameMusic =
            new Audio("./assets/audio/gameSoundBg.wav")
        this.gameMusic.loop = true
        this.gameMusic.volume = this.musicVolume
        this.gameMusic.preload = "auto"

        this.mainMusic =
            new Audio("./assets/audio/mainSoundBg.wav")
        this.mainMusic.loop = true
        this.mainMusic.volume = this.musicVolume
        this.mainMusic.preload = "auto"

        this.previousTime = null
        this.deltaTime = null

        this.debug = false

        /// INPUT LAUNCH
        this.detectarTeclado()
        this.detectarPuntero()
        this.detectarControlesTactiles()
    }

    update(deltaTime) {

        if (this.state === "menu") {

            let selectedOption =
                this.menu.update(this.keysPressed, this.canvas)

            if (selectedOption) {

                if (selectedOption.action) {
                    this.handleSettingsAction(selectedOption)
                }

                if (selectedOption.appState === "new game") {
                    this.game = new Game(
                        this.effectsEnabled,
                        this.effectsVolume
                    )
                    this.gameMusic.currentTime = 0
                    this.setContinueAvailable(false)
                    this.setState("game")
                }
                if (selectedOption.appState === "score") {
                    this.score.setState("ranking")
                    this.setState("score")
                }

                if (selectedOption.appState === "continue game" && this.game !== null) {
                    this.game.prepareToContinue()
                    this.setState("game")
                }
            }

        }

        else if (this.state === "game") {

            if (this.game !== null) {
                this.game.update(
                    deltaTime,
                    this.keysPressed,
                    this.keysHeld,
                    this.mousePosition,
                    this.mousePressed
                )
                if (this.game.state === "finished") {
                    this.score.prepareNewScore(
                        this.game.score,
                        this.game.result
                    )
                    this.setState("score")
                    this.keysPressed = {}
                    this.mousePressed = false
                    return
                }
            }

        }

        else if (this.state === "score") {

            this.score.update(
                this.keysPressed,
                this.keysHeld,
                this.mousePosition,
                this.mousePressed
            )
        }

        if (this.keysPressed.Escape) {

            if (this.state === "score") {
                if (this.game?.state === "finished") {
                    this.destroyGame()
                }
                this.setState("menu")
            }
            else if (this.state === "game") {
                this.setContinueAvailable(true)
                this.setState("menu")
                this.score.state = "ranking"
            }





        }

        this.keysPressed = {}
        this.mousePressed = false
    }

    draw() {


        if (this.game !== null) {
            this.game.draw(this.context, this.canvas)
        }
        if (this.state === "score") {
            this.score.draw(this.context, this.canvas)
        }
        if (this.state === "menu") {
            this.menu.draw(this.context, this.canvas)
        }

        if (this.debug) {
            this.selfDebug()
        }

    }

    appLoop(currentTime) {

        /// Calcular deltaTime
        if (this.previousTime == null) {
            this.previousTime = currentTime
        }
        this.deltaTime = (currentTime - this.previousTime) / 1000
        this.previousTime = currentTime

        //Update
        this.update(this.deltaTime)
        //Clear
        this.clear()
        //Draw
        this.draw()

        requestAnimationFrame((time) => this.appLoop(time));
    }

    start() {
        requestAnimationFrame(
            (time) => this.appLoop(time)
        )
    }

    clear() {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )
    }

    /// UTILIDADES

    selfDebug() {
        this.context.fillStyle = "white";
        this.context.font = `20px Arial`;

        this.context.fillText(
            `appState : ${this.state}`,
            20,
            this.canvas.height - 20
        );
        this.context.fillText(
            `fps : ${(1 / this.deltaTime).toFixed(1)}`,
            20,
            this.canvas.height - 40
        );
    }

    /// UTILIDADES

    detectarTeclado() {
        window.addEventListener("keydown", (event) => {
            if (!this.keysHeld[event.key]) {
                this.keysPressed[event.key] = true
            }

            this.keysHeld[event.key] = true
            this.updateMusic()
        })


        window.addEventListener("keyup", (event) => {
            this.keysHeld[event.key] = false
        })

    }
    detectarPuntero() {
        this.canvas.addEventListener("pointermove", (event) => {
            if (!event.isPrimary) {
                return
            }

            this.mousePosition = this.getPointerPosition(event)
        })

        this.canvas.addEventListener("pointerdown", (event) => {
            if (
                !event.isPrimary ||
                (event.pointerType === "mouse" && event.button !== 0)
            ) {
                return
            }

            event.preventDefault()
            this.requestFullscreenOnMobile()
            this.mousePosition = this.getPointerPosition(event)
            this.mousePressed = true
            this.updateMusic()
        })
    }

    detectarControlesTactiles() {
        const controlKeys = {
            up: "w",
            left: "a",
            down: "s",
            right: "d",
            select: " ",
            back: "Escape"
        }

        const buttons =
            document.querySelectorAll("[data-control]")

        buttons.forEach(button => {
            const control = button.dataset.control

            button.addEventListener("pointerdown", (event) => {
                event.preventDefault()
                this.requestFullscreenOnMobile()
                button.setPointerCapture(event.pointerId)
                button.classList.add("is-active")
                this.updateMusic()

                const key = controlKeys[control]

                if (!this.keysHeld[key]) {
                    this.keysPressed[key] = true
                }

                this.keysHeld[key] = true
            })

            const releaseControl = () => {
                button.classList.remove("is-active")
                this.keysHeld[controlKeys[control]] = false
            }

            button.addEventListener("pointerup", releaseControl)
            button.addEventListener("pointercancel", releaseControl)
            button.addEventListener("lostpointercapture", releaseControl)
        })
    }

    requestFullscreenOnMobile() {
        const isMobileLandscape = window.matchMedia(
            "(pointer: coarse) and (orientation: landscape)"
        ).matches

        if (
            !isMobileLandscape ||
            document.fullscreenElement ||
            !document.documentElement.requestFullscreen
        ) {
            return
        }

        document.documentElement
            .requestFullscreen()
            .catch(() => {
                // El layout continúa usando el viewport disponible.
            })
    }

    getPointerPosition(event) {

        const rect = this.canvas.getBoundingClientRect()
        const style = getComputedStyle(this.canvas)

        const borderLeft = parseFloat(style.borderLeftWidth)
        const borderTop = parseFloat(style.borderTopWidth)
        const borderRight = parseFloat(style.borderRightWidth)
        const borderBottom = parseFloat(style.borderBottomWidth)

        const renderedWidth =
            rect.width - borderLeft - borderRight

        const renderedHeight =
            rect.height - borderTop - borderBottom

        const scaleX =
            this.canvas.width / renderedWidth

        const scaleY =
            this.canvas.height / renderedHeight

        return {
            x:
                (event.clientX - rect.left - borderLeft) *
                scaleX,
            y:
                (event.clientY - rect.top - borderTop) *
                scaleY
        }
    }

    /// STATES

    setState(newState) {
        if (this.state === newState) {
            return
        }
        else {
            this.previousState = this.state
            this.state = newState
            this.onEnterState(newState)
            this.updateMusic()
        }


    }

    onEnterState(state) {

        if (state === "score") {
            if (this.game === null) {
                this.score.state = "ranking"
            }

        }
    }

    updateMusic() {
        const shouldPlayGameMusic =
            this.musicEnabled &&
            this.state === "game"

        const shouldPlayMainMusic =
            this.musicEnabled &&
            (
                this.state === "menu" ||
                this.state === "score"
            )

        if (shouldPlayGameMusic && this.gameMusic.paused) {
            this.gameMusic.play().catch(() => {
                // El navegador puede esperar otra interacción del usuario.
            })
        }

        if (!shouldPlayGameMusic && !this.gameMusic.paused) {
            this.gameMusic.pause()
        }

        if (shouldPlayMainMusic && this.mainMusic.paused) {
            this.mainMusic.play().catch(() => {
                // El navegador puede esperar otra interacción del usuario.
            })
        }

        if (!shouldPlayMainMusic && !this.mainMusic.paused) {
            this.mainMusic.pause()
        }
    }

    handleSettingsAction(selection) {
        if (selection.action === "toggleMusic") {
            this.musicEnabled = !this.musicEnabled
            this.settings.music.enabled = this.musicEnabled
        }

        if (selection.action === "toggleEffects") {
            this.effectsEnabled = !this.effectsEnabled
            this.settings.effects.enabled = this.effectsEnabled
        }

        if (selection.action === "changeMusicVolume") {
            this.musicVolume = this.changeVolume(
                this.musicVolume,
                selection.direction
            )
            this.settings.music.volume = this.musicVolume
        }

        if (selection.action === "changeEffectsVolume") {
            this.effectsVolume = this.changeVolume(
                this.effectsVolume,
                selection.direction
            )
            this.settings.effects.volume = this.effectsVolume
        }

        this.mainMusic.volume = this.musicVolume
        this.gameMusic.volume = this.musicVolume

        if (this.game !== null) {
            this.game.setEffectsSettings(
                this.effectsEnabled,
                this.effectsVolume
            )
        }

        this.menu.setAudioSettings(this.settings)
        this.saveSettings()
        this.updateMusic()
    }

    changeVolume(currentVolume, direction) {
        const newVolume =
            currentVolume + direction * 0.1

        return Math.round(
            Math.min(1, Math.max(0, newVolume)) * 10
        ) / 10
    }

    loadSettings() {
        const defaultSettings = {
            music: { enabled: true, volume: 0.3 },
            effects: { enabled: true, volume: 0.3 }
        }

        try {
            const data = localStorage.getItem(this.storageKey)

            if (!data) {
                return defaultSettings
            }

            const storage = JSON.parse(data)
            const savedSettings = storage.settings

            if (!savedSettings) {
                return defaultSettings
            }

            const musicVolume =
                Number.isFinite(savedSettings.music?.volume)
                    ? savedSettings.music.volume
                    : 0.3
            const effectsVolume =
                Number.isFinite(savedSettings.effects?.volume)
                    ? savedSettings.effects.volume
                    : 0.3

            return {
                music: {
                    enabled:
                        typeof savedSettings.music?.enabled === "boolean"
                            ? savedSettings.music.enabled
                            : true,
                    volume:
                        Math.min(1, Math.max(0, musicVolume))
                },
                effects: {
                    enabled:
                        typeof savedSettings.effects?.enabled === "boolean"
                            ? savedSettings.effects.enabled
                            : true,
                    volume:
                        Math.min(1, Math.max(0, effectsVolume))
                }
            }
        }
        catch (error) {
            console.log("Error loading settings", error)
            return defaultSettings
        }
    }

    saveSettings() {
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
            storage.settings = this.settings
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

    setContinueAvailable(isAvailable) {
        const continueOption = this.menu.options.find(
            option => option.appState === "continue game"
        )

        if (continueOption) {
            continueOption.isAvailable = isAvailable
        }
    }

    destroyGame() {
        if (this.game !== null) {
            this.game.destroyEntities()
            this.game = null
        }

        this.setContinueAvailable(false)
    }

}
