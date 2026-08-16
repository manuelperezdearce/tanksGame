export class HUD {
    constructor() {
        this.enemiesKilled = ""
        this.score = ""
        this.playerLife = ""
        this.fontSize = 20
        this.mousePosition = { x: 0, y: 0 }
        this.qEnemies = ""
        this.qAllies = ""
    }

    /// UPDATE ///

    update(playerLife, enemiesKilled, score, mousePosition, qEnemies, qAllies) {
        this.enemiesKilled = enemiesKilled
        this.playerLife = playerLife
        this.score = score
        this.mousePosition = mousePosition
        this.qAllies = qAllies
        this.qEnemies = qEnemies
    }

    /// DRAW ////

    draw(canvas, context) {
        context.fillStyle = "white";
        context.font = `${this.fontSize}px Arial`;

        /// Enemies Killed
        context.fillText(
            `Enemies killed: ${this.enemiesKilled}`,
            20,
            30
        );
        /// SCORE
        context.fillText(
            `Score ${this.score}`,
            20,
            60
        );
        /// Player Life
        context.fillText(
            `Life ${this.playerLife}`,
            canvas.width / 2,
            canvas.height - this.fontSize
        );

        /// Allies
        context.fillText(
            `Allies ${this.qAllies}`,
            canvas.width / 2 - 100,
            canvas.height - this.fontSize
        );
        /// Enemies
        context.fillText(
            `Enemies ${this.qEnemies}`,
            canvas.width / 2 + 100,
            canvas.height - this.fontSize
        );

        this.dibujarPuntero(context)

    }

    dibujarPuntero(context) {

        context.beginPath()
        context.fillStyle = "#e60bc931"
        context.arc(
            this.mousePosition.x,
            this.mousePosition.y,
            20,
            0,
            2 * Math.PI,
            true

        )
        context.fill()
    }

}