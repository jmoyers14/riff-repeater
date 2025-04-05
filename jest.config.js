export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testMatch: [
        "<rootDir>/__tests__/**/*.ts?(x)",
        "<rootDir>/__tests__/**/*.spec.ts?(x)",
        "<rootDir>/__tests__/**/*.test.ts?(x)",
    ],
    moduleNameMapper: {
        // Your module mappings
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.css$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
