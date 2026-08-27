import { Game } from "./game/game.js";
import { Menu } from "./menu/menu.js";
import { Score } from "./score/score.js";
import { Settings } from "./settings/Settings.js";
import { About } from "./about/About.js";
import { Controller } from "./controller/Controller.js";

export class App {
    constructor(inputElements) {

        this.canvas = inputElements.canvas
        this.context = this.canvas.getContext("2d")

        this.previousState = null
        this.state = "menu" /// menu score game pause
        this.controller = new Controller(inputElements)
        this.menu = new Menu()
        this.score = new Score()
        this.settings = new Settings().load()
        this.about = new About()
        this.game = null

        this.musicEnabled = this.settings.music.enabled
        this.musicVolume = this.settings.music.volume
        this.effectsEnabled = this.settings.effects.enabled
        this.effectsVolume = this.settings.effects.volume
        this.menu.setAudioSettings(this.settings)

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
    }

    update(deltaTime) {

        this.controller.beginFrame()
        const input = this.controller.getInput()

        if (
            this.state !== "menu" &&
            input.touchButtons.pressed.start
        ) {
            if (this.state === "game") {
                this.setContinueAvailable(true)
            }

            if (
                this.state === "score" &&
                this.game?.state === "finished"
            ) {
                this.destroyGame()
            }

            this.setState("menu")
            this.score.state = "ranking"
            this.controller.endFrame()
            return
        }

        if (this.state === "menu") {

            let selectedOption =
                this.menu.update(input.touchButtons, input.keyboard.pressed, this.canvas)

            if (selectedOption) {

                if (selectedOption.appState === "continue game" && this.game !== null) {
                    this.game.prepareToContinue()
                    this.setState("game")
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
                if (selectedOption.appState === "settings") {
                    this.settings.resetSelection()
                    this.setState("settings")
                }
                if (selectedOption.appState === "about") {
                    this.setState("about")
                }


            }

        }

        else if (this.state === "game") {

            if (this.game !== null) {
                const gameAction = this.game.update(
                    deltaTime,
                    input
                )

                if (gameAction?.action === "menu") {
                    this.setContinueAvailable(true)
                    this.setState("menu")
                    this.score.state = "ranking"
                }
                else if (this.game.state === "finished") {
                    this.score.prepareNewScore(
                        this.game.score,
                        this.game.result
                    )
                    this.setState("score")
                }
            }

        }

        else if (this.state === "score") {

            const scoreAction = this.score.update(input)

            if (scoreAction?.action === "back") {
                if (this.game?.state === "finished") {
                    this.destroyGame()
                }
                this.setState("menu")
            }
        }

        else if (this.state === "settings") {
            const settingsAction = this.settings.update(input)

            if (settingsAction?.action === "changed") {
                this.musicEnabled = this.settings.music.enabled
                this.musicVolume = this.settings.music.volume
                this.effectsEnabled = this.settings.effects.enabled
                this.effectsVolume = this.settings.effects.volume
                this.mainMusic.volume = this.musicVolume
                this.gameMusic.volume = this.musicVolume

                if (this.game !== null) {
                    this.game.setEffectsSettings(
                        this.effectsEnabled,
                        this.effectsVolume
                    )
                }

                this.settings.save()
                this.menu.setAudioSettings(this.settings)
                this.updateMusic()
            }

            if (settingsAction?.action === "back") {
                this.setState("menu")
            }
        }

        else if (this.state === "about") {
            const aboutAction = this.about.update(
                input.touchButtons,
                input.keyboard.pressed
            )

            if (aboutAction?.action === "back") {
                this.setState("menu")
            }
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
            else if (this.state === "settings") {
                this.setState("menu")
            }
            else if (this.state === "about") {
                this.setState("menu")
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
        if (this.state === "settings") {
            this.settings.draw(this.context, {
                x: this.canvas.width / 2,
                y: this.canvas.height / 2
            })
        }
        if (this.state === "about") {
            this.about.draw(this.context, {
                x: this.canvas.width / 2,
                y: this.canvas.height / 2
            })
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
                this.state !== "game"
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
