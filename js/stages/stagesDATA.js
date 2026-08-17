export const stages = {

    1: {
        id: 1,
        name: "First Contact",
        bgImageSRC: "./assets/backgrounds/map_test.png",
        totalEnemies: 10,
        timeLimit: 60,

        events: [
            {
                time: 2,
                type: "spawnEnemy",
                amount: 3,
                side: "top",
                target: { x: 400, y: 250 }
            },

            {
                time: 10,
                type: "spawnEnemy",
                amount: 3,
                side: "left",
                target: { x: 250, y: 400 }
            },

            {
                time: 20,
                type: "spawnEnemy",
                amount: 4,
                side: "right",
                target: { x: 550, y: 400 }
            }
        ]
    },


    2: {
        id: 2,
        name: "Crossfire",
        bgImageSRC: "./assets/backgrounds/map_test.png",
        totalEnemies: 15,
        timeLimit: 75,

        events: [
            {
                time: 2,
                type: "spawnEnemy",
                amount: 4,
                side: "top",
                target: { x: 400, y: 250 }
            },

            {
                time: 12,
                type: "spawnEnemy",
                amount: 4,
                side: "left",
                target: { x: 250, y: 400 }
            },

            {
                time: 22,
                type: "spawnEnemy",
                amount: 4,
                side: "right",
                target: { x: 550, y: 400 }
            },

            {
                time: 35,
                type: "spawnEnemy",
                amount: 3,
                side: "bottom",
                target: { x: 400, y: 550 }
            }
        ]
    }
}