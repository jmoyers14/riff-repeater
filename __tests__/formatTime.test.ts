import { formatTime } from "../src/utils/formatTime";

describe("formatTime", () => {
    test("should floor fractions of a second", () => {
        const input = 30.32123;
        const output = formatTime(input);
        expect(output).toEqual("00:30");
    });

    test("should format time under one minute", () => {
        const input = 30;
        const output = formatTime(input);
        expect(output).toEqual("00:30");
    });

    test("should format one minute", () => {
        const input = 60;
        const output = formatTime(input);
        expect(output).toEqual("01:00");
    });

    test("should format half hour", () => {
        const input = 1800;
        const output = formatTime(input);
        expect(output).toEqual("30:00");
    });

    test("should format minutes and seconds", () => {
        const input = 1845;
        const output = formatTime(input);
        expect(output).toEqual("30:45");
    });

    test("should format one hour", () => {
        const input = 3600;
        const output = formatTime(input);
        expect(output).toEqual("01:00:00");
    });

    test("should format hours minutes and seconds", () => {
        const input = 3600 * 24 + 60 * 30 + 24;
        const output = formatTime(input);
        expect(output).toEqual("24:30:24");
    });
});
