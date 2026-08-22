export const stages = {

    1: {
        id: 1,
        name: "First Contact",
        bgImageSRC: "./assets/backgrounds/bg_stage1.png",
        timeLimit: 60,

        events: [
            {
                time: 2,
                type: "spawnEnemy",
                amount: 1,
                side: "top",
                target: { x: 400, y: 250 }
            },

            {
                time: 10,
                type: "spawnEnemy",
                amount: 1,
                side: "left",
                target: { x: 250, y: 400 }
            },

            {
                time: 15,
                type: "spawnEnemy",
                amount: 2,
                side: "right",
                target: { x: 550, y: 400 }
            }
        ]
    },


    2: {
        id: 2,
        name: "Crossfire",
        bgImageSRC: "./assets/backgrounds/bg_stage2.png",
        timeLimit: 60,

        events: [
            {
                time: 2,
                type: "spawnEnemy",
                amount: 2,
                side: "top",
                target: { x: 400, y: 250 }
            },

            {
                time: 10,
                type: "spawnEnemy",
                amount: 2,
                side: "left",
                target: { x: 250, y: 400 }
            },

            {
                time: 15,
                type: "spawnEnemy",
                amount: 2,
                side: "right",
                target: { x: 550, y: 400 }
            },

            {
                time: 20,
                type: "spawnEnemy",
                amount: 3,
                side: "bottom",
                target: { x: 400, y: 550 }
            }
        ]
    }
}
