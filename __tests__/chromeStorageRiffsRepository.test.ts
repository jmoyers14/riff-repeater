import { ChromeStorageRiffsRepository } from "../src/riffsRepository/chromeStorageRiffsRepository";
import { Riff } from "../src/types";
import { RiffsRepositroy } from "../src/riffsRepository/riffsRepository";
import { chrome } from "jest-chrome";

describe("ChromeStorageRiffsRepository", () => {
    const mockChromeGet = jest.fn();
    chrome.storage.local.get = mockChromeGet;

    let repository: RiffsRepositroy;
    const videoId = "test-video-id";
    const sampleRiff: Riff = {
        hotkey: "a",
        name: "Sample riff text",
        time: 15,
    };

    beforeEach(() => {
        repository = new ChromeStorageRiffsRepository();
        jest.clearAllMocks();
    });

    describe("getRiffs", () => {
        it("should return empty array when no riffs exist", async () => {
            mockChromeGet.mockResolvedValue({});
            const result = await repository.getRiffs(videoId);
            expect(mockChromeGet).toHaveBeenCalledWith(`riffs_${videoId}`);
            expect(result).toEqual([]);
        });

        it("should return riffs when they exist", async () => {
            const existingRiffs = [sampleRiff];
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: existingRiffs,
            });

            const result = await repository.getRiffs(videoId);

            expect(mockChromeGet).toHaveBeenCalledWith(`riffs_${videoId}`);
            expect(result).toEqual(existingRiffs);
        });
    });

    describe("addRiff", () => {
        it("should add a riff to an empty array", async () => {
            mockChromeGet.mockResolvedValue({});

            await repository.addRiff(videoId, sampleRiff);

            expect(mockChromeGet).toHaveBeenCalledWith(`riffs_${videoId}`);
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [sampleRiff],
            });
        });

        it("should add a riff to existing riffs", async () => {
            const existingRiff = {
                hotkey: "b",
                text: "Existing riff",
                timestamp: 10,
            };

            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: [existingRiff],
            });

            await repository.addRiff(videoId, sampleRiff);

            expect(mockChromeGet).toHaveBeenCalledWith(`riffs_${videoId}`);
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [existingRiff, sampleRiff],
            });
        });
    });

    describe("deleteRiff", () => {
        it("should remove a riff based on hotkey", async () => {
            const existingRiffs = [
                sampleRiff,
                { hotkey: "b", text: "Another riff", timestamp: 20 },
            ];
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: existingRiffs,
            });

            await repository.deleteRiff(videoId, sampleRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [
                    { hotkey: "b", text: "Another riff", timestamp: 20 },
                ],
            });
        });

        it("should not change anything if riff doesn't exist", async () => {
            const existingRiffs = [
                { hotkey: "b", text: "Another riff", timestamp: 20 },
            ];
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: existingRiffs,
            });

            await repository.deleteRiff(videoId, sampleRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: existingRiffs,
            });
        });
    });

    describe("upsertRiff", () => {
        it("should add a new riff if hotkey doesn't exist", async () => {
            mockChromeGet.mockResolvedValue({});

            await repository.upsertRiff(videoId, sampleRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [sampleRiff],
            });
        });

        it("should update an existing riff with the same hotkey", async () => {
            const existingRiffs = [
                { hotkey: "a", text: "Old text", timestamp: 5 },
            ];
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: existingRiffs,
            });

            const updatedRiff = { ...sampleRiff, text: "Updated text" };
            await repository.upsertRiff(videoId, updatedRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [updatedRiff],
            });
        });
    });
});
