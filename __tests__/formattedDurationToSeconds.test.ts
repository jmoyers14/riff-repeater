import { formattedDurationToSeconds } from "../src/utils/formattedDurationToSeconds";

describe("formattedDurationToSeconds", () => {
    test("parses plain seconds", () => {
        expect(formattedDurationToSeconds("0")).toBe(0);
        expect(formattedDurationToSeconds("00")).toBe(0);
        expect(formattedDurationToSeconds("8")).toBe(8);
        expect(formattedDurationToSeconds("80")).toBe(80);
        expect(formattedDurationToSeconds("8000")).toBe(8000);
    });

    test("parses minutes:seconds format", () => {
        expect(formattedDurationToSeconds("1:00")).toBe(60);
        expect(formattedDurationToSeconds("1:30")).toBe(90);
        expect(formattedDurationToSeconds("01:30")).toBe(90);
        expect(formattedDurationToSeconds("01:90")).toBe(150);
        expect(formattedDurationToSeconds("5:00")).toBe(300);
        expect(formattedDurationToSeconds("16:30")).toBe(990);
    });

    test("parses hours:minutes:seconds format", () => {
        expect(formattedDurationToSeconds("1:00:00")).toBe(3600);
        expect(formattedDurationToSeconds("1:30:45")).toBe(5445);
        expect(formattedDurationToSeconds("01:00:00")).toBe(3600);
        expect(formattedDurationToSeconds("24:00:00")).toBe(86400);
        expect(formattedDurationToSeconds("100:00:00")).toBe(360000);
    });

    test("returns null for invalid formats", () => {
        expect(formattedDurationToSeconds("")).toBeNull();
        expect(formattedDurationToSeconds("abc")).toBeNull();
        expect(formattedDurationToSeconds("1:")).toBeNull();
        expect(formattedDurationToSeconds("1:2:")).toBeNull();
        expect(formattedDurationToSeconds("100:100:100")).toBeNull();
    });
});
