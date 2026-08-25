export class Controller {
    constructor(inputElements) {

        this.canvas = inputElements.canvas
        this.touchButtons = inputElements.touchButtons
        this.joystick = inputElements.joystick

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
            joystick: {
                active: false,
                direction: null,
                magnitude: 0
            }
        }

        this.detectarTeclado()
        this.detectarPuntero()
    }

    beginFrame() {

    }
    endFrame() {
        this.input.keyboard.pressed = {}
        this.input.pointer.pressed = false
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

}