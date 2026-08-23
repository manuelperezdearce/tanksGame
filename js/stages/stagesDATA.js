export const stages = {
    1: {
        id: 1,
        name: "First Contact",
        bgImageSRC: "./assets/backgrounds/bg_stage1.png",
        timeLimit: 60,
        events: [
            { time: 2, type: "spawnEnemy", amount: 1, side: "top" },
            { time: 12, type: "spawnEnemy", amount: 1, side: "left" },
            { time: 22, type: "spawnEnemy", amount: 1, side: "right" }
        ]
    },
    2: {
        id: 2,
        name: "Crossfire",
        bgImageSRC: "./assets/backgrounds/bg_stage1.png",
        timeLimit: 65,
        events: [
            { time: 2, type: "spawnEnemy", amount: 1, side: "top" },
            { time: 10, type: "spawnEnemy", amount: 1, side: "left" },
            { time: 18, type: "spawnEnemy", amount: 1, side: "right" },
            { time: 28, type: "spawnEnemy", amount: 2, side: "bottom" }
        ]
    },
    3: {
        id: 3,
        name: "Border Patrol",
        bgImageSRC: "./assets/backgrounds/bg_stage2.png",
        timeLimit: 70,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 13, type: "spawnEnemy", amount: 1, side: "left" },
            { time: 24, type: "spawnEnemy", amount: 1, side: "right" },
            { time: 35, type: "spawnEnemy", amount: 2, side: "bottom" }
        ]
    },
    4: {
        id: 4,
        name: "Twin Assault",
        bgImageSRC: "./assets/backgrounds/bg_stage2.png",
        timeLimit: 75,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "left" },
            { time: 14, type: "spawnEnemy", amount: 2, side: "right" },
            { time: 27, type: "spawnEnemy", amount: 1, side: "top" },
            { time: 39, type: "spawnEnemy", amount: 2, side: "bottom" }
        ]
    },
    5: {
        id: 5,
        name: "Encirclement",
        bgImageSRC: "./assets/backgrounds/bg_stage3.png",
        timeLimit: 80,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 13, type: "spawnEnemy", amount: 2, side: "right" },
            { time: 25, type: "spawnEnemy", amount: 2, side: "bottom" },
            { time: 37, type: "spawnEnemy", amount: 2, side: "left" }
        ]
    },
    6: {
        id: 6,
        name: "Iron Passage",
        bgImageSRC: "./assets/backgrounds/bg_stage3.png",
        timeLimit: 85,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 12, type: "spawnEnemy", amount: 2, side: "bottom" },
            { time: 23, type: "spawnEnemy", amount: 2, side: "left" },
            { time: 34, type: "spawnEnemy", amount: 1, side: "right" },
            { time: 45, type: "spawnEnemy", amount: 2, side: "right" }
        ]
    },
    7: {
        id: 7,
        name: "Four Fronts",
        bgImageSRC: "./assets/backgrounds/bg_stage4.png",
        timeLimit: 90,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 12, type: "spawnEnemy", amount: 2, side: "right" },
            { time: 22, type: "spawnEnemy", amount: 2, side: "bottom" },
            { time: 32, type: "spawnEnemy", amount: 2, side: "left" },
            { time: 44, type: "spawnEnemy", amount: 2, side: "top" }
        ]
    },
    8: {
        id: 8,
        name: "Relentless",
        bgImageSRC: "./assets/backgrounds/bg_stage4.png",
        timeLimit: 95,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "left" },
            { time: 11, type: "spawnEnemy", amount: 2, side: "right" },
            { time: 20, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 30, type: "spawnEnemy", amount: 2, side: "bottom" },
            { time: 41, type: "spawnEnemy", amount: 1, side: "left" },
            { time: 50, type: "spawnEnemy", amount: 2, side: "right" }
        ]
    },
    9: {
        id: 9,
        name: "Siege Line",
        bgImageSRC: "./assets/backgrounds/bg_stage5.png",
        timeLimit: 100,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 11, type: "spawnEnemy", amount: 2, side: "left" },
            { time: 20, type: "spawnEnemy", amount: 2, side: "right" },
            { time: 29, type: "spawnEnemy", amount: 2, side: "bottom" },
            { time: 39, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 50, type: "spawnEnemy", amount: 2, side: "bottom" }
        ]
    },
    10: {
        id: 10,
        name: "Breaking Point",
        bgImageSRC: "./assets/backgrounds/bg_stage5.png",
        timeLimit: 105,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "left" },
            { time: 10, type: "spawnEnemy", amount: 2, side: "right" },
            { time: 18, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 27, type: "spawnEnemy", amount: 2, side: "bottom" },
            { time: 36, type: "spawnEnemy", amount: 2, side: "left" },
            { time: 46, type: "spawnEnemy", amount: 1, side: "right" },
            { time: 56, type: "spawnEnemy", amount: 2, side: "right" }
        ]
    },
    11: {
        id: 11,
        name: "Last Stand",
        bgImageSRC: "./assets/backgrounds/bg_stage6.png",
        timeLimit: 110,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 10, type: "spawnEnemy", amount: 2, side: "bottom" },
            { time: 18, type: "spawnEnemy", amount: 2, side: "left" },
            { time: 26, type: "spawnEnemy", amount: 2, side: "right" },
            { time: 35, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 44, type: "spawnEnemy", amount: 2, side: "bottom" },
            { time: 54, type: "spawnEnemy", amount: 2, side: "left" }
        ]
    },
    12: {
        id: 12,
        name: "Final Offensive",
        bgImageSRC: "./assets/backgrounds/bg_stage7.png",
        timeLimit: 120,
        events: [
            { time: 2, type: "spawnEnemy", amount: 2, side: "top" },
            { time: 10, type: "spawnEnemy", amount: 3, side: "right" },
            { time: 18, type: "spawnEnemy", amount: 3, side: "bottom" },
            { time: 26, type: "spawnEnemy", amount: 4, side: "left" },
            { time: 34, type: "spawnEnemy", amount: 4, side: "top" },
            { time: 42, type: "spawnEnemy", amount: 5, side: "right" },
            { time: 50, type: "spawnEnemy", amount: 5, side: "bottom" },
            { time: 60, type: "spawnEnemy", amount: 8, side: "left" }
        ]
    }
}
