import { generateId } from "../src/utils/generateId";

describe("generateId", () => {
    it("should generate a string of the correct length", () => {
        const id = generateId();
        expect(id.length).toBe(10);
    });

    it("should only contain allowed characters", () => {
        const id = generateId();
        expect(id).toMatch(/^[0-9a-z]+$/);
    });

    it("should generate unique IDs", () => {
        const ids = new Set();
        for (let i = 0; i < 1000; i++) {
            ids.add(generateId());
        }
        expect(ids.size).toBe(1000);
    });

    it("should be a string type", () => {
        const id = generateId();
        expect(typeof id).toBe("string");
    });
});
