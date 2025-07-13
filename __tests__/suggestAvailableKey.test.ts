import { suggestAvailableKey } from "../src/utils/suggestAvailablekey";
import { PREFERRED_KEYS } from "../src/constants/hotkeys";

describe("suggestAvailableKey", () => {
    test("should return first available alphabetical key when no user keys are chosen", () => {
        const result = suggestAvailableKey([]);
        expect(result).toBe("a");
    });

    test("should skip user chosen keys and return next available key", () => {
        const result = suggestAvailableKey(["a", "s", "d"]);
        expect(result).toBe("f");
    });

    test("should fallback to alpha keys", () => {
        const result = suggestAvailableKey(PREFERRED_KEYS);
        expect(result).toBe("b");
    });

    test("should return null when all alphabetical keys are unavailable", () => {
        const allAlphabeticalKeys = "abcdefghijklmnopqrstuvwxyz".split("");
        const result = suggestAvailableKey(allAlphabeticalKeys);
        expect(result).toBe(null);
    });
});
