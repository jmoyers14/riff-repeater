/** @type {import('ts-jest').JestConfigWithTsJest} **/
import { TS_EXT_TO_TREAT_AS_ESM, ESM_TS_TRANSFORM_PATTERN } from "ts-jest";

export default {
    extensionsToTreatAsEsm: [...TS_EXT_TO_TREAT_AS_ESM],
    testMatch: [
        "<rootDir>/__tests__/**/*.spec.ts?(x)",
        "<rootDir>/__tests__/**/*.test.ts?(x)",
    ],
    transform: {
        [ESM_TS_TRANSFORM_PATTERN]: [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
    setupFiles: ["<rootDir>/__tests__/jest.setup.js"],
    injectGlobals: true,
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
};
