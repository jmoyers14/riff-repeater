import { Riff, SavedRiff } from "../src/types";
import { RiffsRepositroy } from "../src/riffsRepository/riffsRepository";

const mockGenerateId = jest.fn();
// @ts-expect-error jest set globally in jest.setup.js
jest.unstable_mockModule("../src/utils/generateId", () => ({
    generateId: mockGenerateId,
}));
const { ChromeStorageRiffsRepository, DuplicateHotkeyError } = await import(
    "../src/riffsRepository/chromeStorageRiffsRepository"
);

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
    const savedSampleRiff: SavedRiff = {
        id: "1234567890",
        ...sampleRiff,
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
            mockGenerateId.mockReturnValue(savedSampleRiff.id);

            await repository.addRiff(videoId, sampleRiff);

            expect(mockChromeGet).toHaveBeenCalledWith(`riffs_${videoId}`);
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [savedSampleRiff],
            });
        });

        it("should add a riff to existing riffs", async () => {
            const existingRiff = {
                id: "abcdefghij",
                hotkey: "b",
                text: "Existing riff",
                timestamp: 10,
            };

            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: [existingRiff],
            });
            mockGenerateId.mockReturnValue(savedSampleRiff.id);

            await repository.addRiff(videoId, sampleRiff);

            expect(mockChromeGet).toHaveBeenCalledWith(`riffs_${videoId}`);
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [existingRiff, savedSampleRiff],
            });
        });

        it("should throw duplicate error when a riff already exists for a hotkey", async () => {
            const existingRiffs = [savedSampleRiff];
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: existingRiffs,
            });

            const duplicateRiff: Riff = {
                hotkey: savedSampleRiff.hotkey,
                name: "Another riff",
                time: 30,
            };

            await expect(
                repository.addRiff(videoId, duplicateRiff)
            ).rejects.toThrow(DuplicateHotkeyError);

            expect(chrome.storage.local.set).not.toHaveBeenCalled();
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

            const result = await repository.deleteRiff(videoId, sampleRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [
                    { hotkey: "b", text: "Another riff", timestamp: 20 },
                ],
            });
            expect(result).toEqual([
                { hotkey: "b", text: "Another riff", timestamp: 20 },
            ]);
        });

        it("should not change anything if riff doesn't exist", async () => {
            const existingRiffs = [
                { hotkey: "b", text: "Another riff", timestamp: 20 },
            ];
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: existingRiffs,
            });

            const result = await repository.deleteRiff(videoId, sampleRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: existingRiffs,
            });
            expect(result).toEqual(existingRiffs);
        });
    });

    describe("updateRiff", () => {
        it("should update an existing riff", async () => {
            const existingRiffs = [savedSampleRiff];
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: existingRiffs,
            });

            const updatedRiff: SavedRiff = {
                ...savedSampleRiff,
                name: "Updated riff name",
                time: 30,
            };

            const result = await repository.updateRiff(videoId, updatedRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [updatedRiff],
            });
            expect(result).toEqual([updatedRiff]);
        });

        it("should throw RiffNotFoundError when riff does not exist", async () => {
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: [],
            });

            const nonExistentRiff: SavedRiff = {
                id: "nonexistent",
                hotkey: "x",
                name: "Non-existent riff",
                time: 10,
            };

            await expect(
                repository.updateRiff(videoId, nonExistentRiff)
            ).rejects.toThrow(
                `Riff ${videoId} ${nonExistentRiff.id} not found.`
            );

            expect(chrome.storage.local.set).not.toHaveBeenCalled();
        });
    });

    describe("upsertRiff", () => {
        it("should add a new riff when given an unsaved riff", async () => {
            mockChromeGet.mockResolvedValue({});
            mockGenerateId.mockReturnValue(savedSampleRiff.id);

            const result = await repository.upsertRiff(videoId, sampleRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [savedSampleRiff],
            });
            expect(result).toEqual([savedSampleRiff]);
        });

        it("should update an existing riff when given a saved riff", async () => {
            const existingRiffs = [savedSampleRiff];
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: existingRiffs,
            });

            const updatedRiff: SavedRiff = {
                ...savedSampleRiff,
                name: "Updated riff name",
                time: 30,
            };

            const result = await repository.upsertRiff(videoId, updatedRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [`riffs_${videoId}`]: [updatedRiff],
            });

            expect(result).toEqual([updatedRiff]);
        });

        it("should throw RiffNotFoundError when updating non-existent saved riff", async () => {
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: [],
            });

            const nonExistentRiff: SavedRiff = {
                id: "nonexistent",
                hotkey: "x",
                name: "Non-existent riff",
                time: 10,
            };

            await expect(
                repository.upsertRiff(videoId, nonExistentRiff)
            ).rejects.toThrow(
                `Riff ${videoId} ${nonExistentRiff.id} not found.`
            );

            expect(chrome.storage.local.set).not.toHaveBeenCalled();
        });

        it("should throw DuplicateHotkeyError when adding new riff with existing hotkey", async () => {
            const existingRiffs = [savedSampleRiff];
            mockChromeGet.mockResolvedValue({
                [`riffs_${videoId}`]: existingRiffs,
            });

            const duplicateRiff: Riff = {
                hotkey: savedSampleRiff.hotkey,
                name: "Another riff",
                time: 30,
            };

            await expect(
                repository.upsertRiff(videoId, duplicateRiff)
            ).rejects.toThrow(DuplicateHotkeyError);

            expect(chrome.storage.local.set).not.toHaveBeenCalled();
        });
    });
});
