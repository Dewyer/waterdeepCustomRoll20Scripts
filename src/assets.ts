import { TavernState } from "./models";

export const CustomEffects = {
    "thunderwave": {
        maxParticles: 1000,
        size: 5,
        sizeRandom: 20,
        lifeSpan: 50,
        lifeSpanRandom: 0,
        emissionRate: 20000,
        speed: 4,
        speedRandom: 0,
        gravity: { x: 0.01, y: 0.01 },
        angle: 90.0,
        angleRandom: 360,
        startColour: [90, 90, 175, 1],
        startColourRandom: [0, 0, 0, 0.25],
        endColour: [125, 125, 255, 0],
        endColourRandom: [0, 0, 0, 0]
    },
    "acid": {
        maxParticles: 200,
        size: 15,
        sizeRandom: 3,
        lifeSpan: 20,
        lifeSpanRandom: 5,
        speed: 7,
        speedRandom: 2,
        gravity: { x: 0.01, y: 0.65 },
        angle: 270,
        angleRandom: 35,
        emissionRate: 1,
        startColour: [0, 35, 10, 1],
        startColourRandom: [0, 10, 10, 0.25],
        endColour: [0, 75, 30, 0],
        endColourRandom: [0, 20, 20, 0]
    },
    "orb": {
        maxParticles: 200,
        size: 260,
        sizeRandom: 0,
        lifeSpan: 60,
        lifeSpanRandom: 0,
        emissionRate: 2,
        speed: 0,
        speedRandom: 0,
        gravity: { x: 0.0001, y: 0.0001 },
        angle: 0.0,
        angleRandom: 360,
        startColour: [10, 10, 50, 0],
        startColourRandom: [10, 10, 10, 0],
        endColour: [0, 0, 0, 1],
        endColourRandom: [10, 10, 5, 0],
        sharpness: 55,
        sharpnessRandom: 40
    }
};

export const DefaultTavernState:TavernState = {
    reputation: 0,
    innkeeperModifier: 0,
    serverModifier: 0,
    guardModifier: 0,
    inv: {
        "root-beer": 0,
        "shadow-ale": 0,
        "basic-wine": 0,
        "good-wine": 0
    },
    defs: {
        "root-beer": {
            chance: 0.20,
            sellPrice: 3,
            buyPrice: { price: 632, for: 316 }
        },
        "shadow-ale": {
            chance: 0.30,
            sellPrice: 2,
            buyPrice: { price: 316, for: 316 }

        },
        "basic-wine": {
            chance: 0.40,
            sellPrice: 2,
            buyPrice: { price: 90, for: 100 }

        },
        "good-wine": {
            chance: 0.1,
            sellPrice: 4,
            buyPrice: { price: 180, for: 100 }
        }
    }

};
