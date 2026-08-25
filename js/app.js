import { Game } from "./game/game.js";
import { Menu } from "./menu/menu.js";
import { Score } from "./score/score.js";
import { Controller } from "./controller/Controller.js";

export class App {
    constructor(inputElements) {

        this.canvas = inputElements.canvas
        this.context = this.canvas.getContext("2d")

        /// USER INPUTS
        this.joystickDirection = null

        this.previousState = null
        this.state = "menu" /// menu score game pause
        this.controller = new Controller(inputElements)
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
        this.detectarControlesTactiles()
        this.detectarJoystick()
    }

    update(deltaTime) {

        this.controller.beginFrame()
        const input = this.controller.getInput()

        if (this.state === "menu") {

            let selectedOption =
                this.menu.update(input.keyboard.pressed, this.canvas)

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
                    input.keyboard.pressed,
                    input.keyboard.held,
                    input.pointer.position,
                    input.pointer.pressed,
                    this.joystickDirection
                )
                if (this.game.state === "finished") {
                    this.score.prepareNewScore(
                        this.game.score,
                        this.game.result
                    )
                    this.setState("score")

                    input.pointer.pressed = false
                    return
                }
            }

        }

        else if (this.state === "score") {

            this.score.update(
                input.keyboard.pressed,
                input.keyboard.held,
                input.pointer.position,
                input.pointer.pressed
            )
        }

        if (input.keyboard.pressed.Escape) {

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

        this.controller.endFrame()
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


    detectarControlesTactiles() {
        const controlKeys = {
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

                if (!input.keyboard.held[key]) {
                    input.keyboard.pressed[key] = true
                }

                input.keyboard.held[key] = true
            })

            const releaseControl = () => {
                button.classList.remove("is-active")
                input.keyboard.held[controlKeys[control]] = false
            }

            button.addEventListener("pointerup", releaseControl)
            button.addEventListener("pointercancel", releaseControl)
            button.addEventListener("lostpointercapture", releaseControl)
        })
    }

    detectarJoystick() {
        const joystick = document.querySelector("[data-joystick]")

        if (!joystick) {
            return
        }

        const knob = joystick.querySelector(".joystick-knob")
        const joystickKeys = ["w", "a", "s", "d"]
        let activePointerId = null

        const setKey = (key, isActive) => {
            if (isActive && !input.keyboard.held[key]) {
                input.keyboard.pressed[key] = true
            }

            input.keyboard.held[key] = isActive
        }

        const updateJoystick = (event) => {
            if (event.pointerId !== activePointerId) {
                return
            }

            const rect = joystick.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const maxDistance =
                (rect.width - knob.offsetWidth) / 2 - 3
            const deadZone = maxDistance * 0.3

            const deltaX = event.clientX - centerX
            const deltaY = event.clientY - centerY
            const distance = Math.hypot(deltaX, deltaY)
            const ratio = distance > maxDistance
                ? maxDistance / distance
                : 1

            const positionX = deltaX * ratio
            const positionY = deltaY * ratio

            knob.style.transform =
                `translate(calc(-50% + ${positionX}px), ` +
                `calc(-50% + ${positionY}px))`

            if (this.state === "game") {
                joystickKeys.forEach(key => setKey(key, false))

                this.joystickDirection = distance > deadZone
                    ? {
                        x: deltaX / distance,
                        y: deltaY / distance
                    }
                    : null

                return
            }

            this.joystickDirection = null
            setKey("w", deltaY < -deadZone)
            setKey("s", deltaY > deadZone)
            setKey("a", deltaX < -deadZone)
            setKey("d", deltaX > deadZone)
        }

        const releaseJoystick = (event) => {
            if (event.pointerId !== activePointerId) {
                return
            }

            activePointerId = null
            this.joystickDirection = null
            knob.style.transform = "translate(-50%, -50%)"
            joystickKeys.forEach(key => setKey(key, false))
        }

        joystick.addEventListener("pointerdown", (event) => {
            if (activePointerId !== null) {
                return
            }

            event.preventDefault()
            activePointerId = event.pointerId
            joystick.setPointerCapture(event.pointerId)
            this.requestFullscreenOnMobile()
            this.updateMusic()
            updateJoystick(event)
        })

        joystick.addEventListener("pointermove", updateJoystick)
        joystick.addEventListener("pointerup", releaseJoystick)
        joystick.addEventListener("pointercancel", releaseJoystick)
        joystick.addEventListener("lostpointercapture", releaseJoystick)
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



    /// STATES

    setState(newState) {
        if (this.state === newState) {
            return
        }
        else {
            this.previousState = this.state
            this.state = newState
            this.joystickDirection = null



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
