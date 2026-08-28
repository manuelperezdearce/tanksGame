export class Controller {
    constructor(inputElements) {

        this.canvas = inputElements.canvas
        this.touchButtons = inputElements.touchButtons
        this.joysticks = Array.from(inputElements.joysticks || [])

        this.joystickL = this.joysticks?.find(
            joystick => joystick.dataset.joystick === "L"
        )
        this.joystickR = this.joysticks?.find(
            joystick => joystick.dataset.joystick === "R"
        )

        this.input = {
            keyboard: {
                held: {},
                pressed: {}
            },
            pointer: {
                position: { x: 0, y: 0 },
                held: false,
                pressed: false
            },
            joystickL: {
                active: false,
                direction: null,
                magnitude: 0
            },
            joystickR: {
                active: false,
                direction: null,
                magnitude: 0
            },
            touchButtons: {
                held: {},
                pressed: {}
            }
        }

        this.detectarTeclado()
        this.detectarPuntero()
        this.detectarControlesTactiles()
        this.detectarJoystick(this.joystickL, this.input.joystickL)
        this.detectarJoystick(this.joystickR, this.input.joystickR)

        this.input.joystick = this.input.joystickL
    }

    beginFrame() {

    }
    endFrame() {
        this.input.keyboard.pressed = {}
        this.input.pointer.pressed = false
        this.input.touchButtons.pressed = {}
    }

    getInput() {
        return this.input
    }

    detectarTeclado() {
        window.addEventListener("keydown", (event) => {
            const key = event.key

            if (!event.repeat && !this.input.keyboard.held[key]) {
                this.input.keyboard.pressed[key] = true
            }

            this.input.keyboard.held[key] = true
        })

        window.addEventListener("keyup", (event) => {
            this.input.keyboard.held[event.key] = false
        })
    }
    detectarPuntero() {
        this.canvas.addEventListener("pointermove", (event) => {
            if (event.pointerType === "mouse" && !event.isPrimary) {
                return
            }

            this.input.pointer.position = this.getPointerPosition(event)
        })

        this.canvas.addEventListener("pointerdown", (event) => {
            if (
                event.pointerType === "mouse" &&
                (!event.isPrimary || event.button !== 0)
            ) {
                return
            }

            event.preventDefault()
            this.input.pointer.position = this.getPointerPosition(event)

            if (!this.input.pointer.held) {
                this.input.pointer.pressed = true
            }

            this.input.pointer.held = true
        })

        this.canvas.addEventListener("pointerup", () => {
            this.input.pointer.held = false
        })

        this.canvas.addEventListener("pointerleave", () => {
            this.input.pointer.held = false
        })
    }

    detectarControlesTactiles() {
        const buttons = this.touchButtons

        buttons.forEach(button => {
            const control = button.dataset.control

            button.addEventListener("pointerdown", (event) => {
                event.preventDefault()
                this.requestFullscreenOnMobile()
                button.setPointerCapture(event.pointerId)
                button.classList.add("is-active")
                // this.updateMusic()

                if (!this.input.touchButtons.held[control]) {
                    this.input.touchButtons.pressed[control] = true
                }
                this.input.touchButtons.held[control] = true
            })

            const releaseControl = () => {
                button.classList.remove("is-active")
                this.input.touchButtons.held[control] = false
            }
            button.addEventListener("pointerup", releaseControl)
            button.addEventListener("pointercancel", releaseControl)
            button.addEventListener("lostpointercapture", releaseControl)
        })
    }

    detectarJoystick(joystick, joystickInput) {

        if (!joystick) {
            return
        }

        const knob = joystick.querySelector(".joystick-knob")
        let activePointerId = null

        const resetJoystick = () => {
            activePointerId = null
            knob.style.transform = "translate(-50%, -50%)"

            joystickInput.active = false
            joystickInput.direction = null
            joystickInput.magnitude = 0
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

            const limitedDistance =
                Math.min(distance, maxDistance)

            const ratio = distance === 0
                ? 0
                : limitedDistance / distance

            const positionX = deltaX * ratio
            const positionY = deltaY * ratio

            knob.style.transform =
                `translate(calc(-50% + ${positionX}px), ` +
                `calc(-50% + ${positionY}px))`

            if (distance <= deadZone) {
                joystickInput.active = true
                joystickInput.direction = null
                joystickInput.magnitude = 0
                return
            }

            const magnitude =
                (limitedDistance - deadZone) /
                (maxDistance - deadZone)

            joystickInput.active = true
            joystickInput.direction = {
                x: deltaX / distance,
                y: deltaY / distance
            }
            joystickInput.magnitude = Math.min(
                1,
                Math.max(0, magnitude)
            )
        }

        joystick.addEventListener("pointerdown", (event) => {
            if (activePointerId !== null) {
                return
            }

            event.preventDefault()

            activePointerId = event.pointerId
            joystick.setPointerCapture(event.pointerId)
            this.requestFullscreenOnMobile()

            updateJoystick(event)
        })

        joystick.addEventListener("pointermove", updateJoystick)

        joystick.addEventListener("pointerup", (event) => {
            if (event.pointerId === activePointerId) {
                resetJoystick()
            }
        })

        joystick.addEventListener("pointercancel", (event) => {
            if (event.pointerId === activePointerId) {
                resetJoystick()
            }
        })

        joystick.addEventListener("lostpointercapture", (event) => {
            if (event.pointerId === activePointerId) {
                resetJoystick()
            }
        })
    }

    getPointerPosition(event) {
        const rect = this.canvas.getBoundingClientRect()
        const style = getComputedStyle(this.canvas)

        const borderLeft = parseFloat(style.borderLeftWidth)
        const borderTop = parseFloat(style.borderTopWidth)
        const borderRight = parseFloat(style.borderRightWidth)
        const borderBottom = parseFloat(style.borderBottomWidth)

        const renderedWidth = rect.width - borderLeft - borderRight
        const renderedHeight = rect.height - borderTop - borderBottom

        const scaleX = this.canvas.width / renderedWidth
        const scaleY = this.canvas.height / renderedHeight

        return {
            x: (event.clientX - rect.left - borderLeft) * scaleX,
            y: (event.clientY - rect.top - borderTop) * scaleY
        }
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

}