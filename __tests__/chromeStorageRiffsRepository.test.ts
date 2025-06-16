import { Riff, SavedRiff, SavedVideo, Video } from "../src/types";
import { RiffsRepositroy } from "../src/riffsRepository/riffsRepository";
import { mock } from "node:test";

const mockGenerateId = jest.fn();
// @ts-expect-error jest set globally in jest.setup.js
jest.unstable_mockModule("../src/utils/generateId", () => ({
    generateId: mockGenerateId,
}));
const { ChromeStorageRiffsRepository, DuplicateHotkeyError } = await import(
    "../src/riffsRepository/chromeStorageRiffsRepository"
);

const videoKey = (id: string): string => {
    return `video:${id}`;
};

describe("ChromeStorageRiffsRepository", () => {
    const mockChromeGet = jest.fn();
    chrome.storage.local.get = mockChromeGet;

    let repository: RiffsRepositroy;
    const videoId = "test-video-id";
    const mockRiff: Riff = {
        hotkey: "a",
        name: "Sample riff text",
        time: 15,
    };
    const savedMockRiff: SavedRiff = {
        id: "1234567890",
        ...mockRiff,
    };

    const mockVideo: Video = {
        id: videoId,
        title: "Test Video",
        thumbnail: "",
        url: "https://youtube.com/watch?v=" + videoId,
        riffs: [],
    };

    beforeEach(() => {
        repository = new ChromeStorageRiffsRepository();
        jest.clearAllMocks();
    });

    describe("addVideo", () => {
        it("should create a new video when it doesn't exist", async () => {
            mockChromeGet.mockResolvedValue({});

            const result = await repository.addVideo(mockVideo);

            expect(mockChromeGet).toHaveBeenCalledWith(videoKey(videoId));

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [videoKey(videoId)]: {
                    ...mockVideo,
                    createdDate: expect.any(Date),
                    updatedAt: expect.any(Date),
                },
            });

            expect(result).toEqual(
                expect.objectContaining({
                    ...mockVideo,
                    createdDate: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });

        it("should update an existing video", async () => {
            const existingVideo: SavedVideo = {
                ...mockVideo,
                title: "Old Title",
                createdDate: new Date(2024, 0, 1),
                updatedAt: new Date(2024, 0, 1),
                riffs: [],
            };

            mockChromeGet.mockResolvedValue({
                [videoKey(existingVideo.id)]: existingVideo,
            });

            const updatedVideo: Video = {
                ...mockVideo,
                title: "New Title",
            };

            const result = await repository.addVideo(updatedVideo);

            expect(mockChromeGet).toHaveBeenCalledWith(videoKey(videoId));

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [videoKey(videoId)]: expect.objectContaining({
                    ...updatedVideo,
                    createdDate: existingVideo.createdDate,
                    updatedAt: expect.any(Date),
                }),
            });

            expect(result).toEqual(
                expect.objectContaining({
                    ...updatedVideo,
                    createdDate: existingVideo.createdDate,
                    updatedAt: expect.any(Date),
                })
            );

            expect(result.updatedAt.getTime()).toBeGreaterThan(
                existingVideo.updatedAt.getTime()
            );
        });

        it("should preserve existing riffs when updating a video", async () => {
            const existingRiffs = [
                { id: "riff1", hotkey: "a", name: "Riff 1", time: 10 },
                { id: "riff2", hotkey: "b", name: "Riff 2", time: 20 },
            ];

            const existingVideo: SavedVideo = {
                ...mockVideo,
                riffs: existingRiffs,
                createdDate: new Date(2024, 0, 1),
                updatedAt: new Date(2024, 0, 1),
            };

            mockChromeGet.mockResolvedValue({
                [videoKey(existingVideo.id)]: existingVideo,
            });

            const updatedVideo: Video = {
                ...mockVideo,
                title: "New Title",
                riffs: [],
            };

            const result = await repository.addVideo(updatedVideo);

            expect(result.riffs).toEqual(existingRiffs);
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [videoKey(videoId)]: expect.objectContaining({
                    ...updatedVideo,
                    riffs: existingRiffs,
                    createdDate: existingVideo.createdDate,
                    updatedAt: expect.any(Date),
                }),
            });
        });
    });

    describe("getRiffs", () => {
        it("should return empty array when no riffs exist", async () => {
            mockChromeGet.mockResolvedValue({});
            const result = await repository.getRiffs(videoId);
            expect(mockChromeGet).toHaveBeenCalledWith(videoKey(videoId));
            expect(result).toEqual([]);
        });

        it("should return riffs when they exist", async () => {
            const existingRiffs = [mockRiff];
            const existingVideo = {
                ...mockVideo,
                riffs: existingRiffs,
            };

            mockChromeGet.mockResolvedValue({
                [videoKey(videoId)]: existingVideo,
            });

            const result = await repository.getRiffs(videoId);

            expect(mockChromeGet).toHaveBeenCalledWith(videoKey(videoId));
            expect(result).toEqual(existingRiffs);
        });
    });

    describe("addRiff", () => {
        it("should add a riff to an empty array", async () => {
            const video = {
                ...mockVideo,
                riffs: [],
            };
            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });
            mockGenerateId.mockReturnValue(savedMockRiff.id);

            await repository.addRiff(videoId, mockRiff);

            expect(mockChromeGet).toHaveBeenCalledWith(videoKey(videoId));
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [videoKey(videoId)]: {
                    ...video,
                    riffs: [savedMockRiff],
                    updatedAt: expect.any(Date),
                },
            });
        });

        it("should add a riff to existing riffs", async () => {
            const existingRiff = {
                id: "abcdefghij",
                hotkey: "b",
                text: "Existing riff",
                timestamp: 10,
            };

            const video = {
                ...mockVideo,
                riffs: [existingRiff],
            };

            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });
            mockGenerateId.mockReturnValue(savedMockRiff.id);

            await repository.addRiff(videoId, mockRiff);

            expect(mockChromeGet).toHaveBeenCalledWith(videoKey(videoId));
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [videoKey(videoId)]: {
                    ...video,
                    riffs: [existingRiff, savedMockRiff],
                    updatedAt: expect.any(Date),
                },
            });
        });

        it("should throw duplicate error when a riff already exists for a hotkey", async () => {
            const existingRiffs = [savedMockRiff];
            const video = {
                ...mockVideo,
                riffs: existingRiffs,
            };
            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });

            const duplicateRiff: Riff = {
                hotkey: savedMockRiff.hotkey,
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
                savedMockRiff,
                { hotkey: "b", text: "Another riff", timestamp: 20 },
            ];
            const video = {
                ...mockVideo,
                riffs: existingRiffs,
            };
            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });

            const result = await repository.deleteRiff(videoId, savedMockRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [videoKey(videoId)]: {
                    ...video,
                    riffs: [
                        { hotkey: "b", text: "Another riff", timestamp: 20 },
                    ],
                    updatedAt: expect.any(Date),
                },
            });
            expect(result).toEqual([
                { hotkey: "b", text: "Another riff", timestamp: 20 },
            ]);
        });

        it("should not change anything if riff doesn't exist", async () => {
            const existingRiffs = [
                { hotkey: "b", text: "Another riff", timestamp: 20 },
            ];
            const video = {
                ...mockVideo,
                riffs: existingRiffs,
            };
            mockChromeGet.mockResolvedValue({ [videoKey(videoId)]: video });

            const result = await repository.deleteRiff(videoId, savedMockRiff);

            expect(chrome.storage.local.set).not.toHaveBeenCalled();
            expect(result).toEqual(existingRiffs);
        });
    });

    describe("updateRiff", () => {
        it("should update an existing riff", async () => {
            const existingRiffs = [savedMockRiff];
            const video = {
                ...mockVideo,
                riffs: existingRiffs,
            };
            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });

            const updatedRiff: SavedRiff = {
                ...savedMockRiff,
                name: "Updated riff name",
                time: 30,
            };

            const result = await repository.updateRiff(videoId, updatedRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [videoKey(videoId)]: {
                    ...video,
                    riffs: [updatedRiff],
                    updatedAt: expect.any(Date),
                },
            });
            expect(result).toEqual([updatedRiff]);
        });

        it("should throw RiffNotFoundError when riff does not exist", async () => {
            const video = {
                ...mockVideo,
                riffs: [],
            };
            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });

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
            const video = {
                ...mockVideo,
                riffs: [],
            };
            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });
            mockGenerateId.mockReturnValue(savedMockRiff.id);

            const result = await repository.upsertRiff(videoId, mockRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [videoKey(videoId)]: {
                    ...video,
                    riffs: [savedMockRiff],
                    updatedAt: expect.any(Date),
                },
            });
            expect(result).toEqual([savedMockRiff]);
        });

        it("should update an existing riff when given a saved riff", async () => {
            const existingRiffs = [savedMockRiff];
            const video = {
                ...mockVideo,
                riffs: existingRiffs,
            };
            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });

            const updatedRiff: SavedRiff = {
                ...savedMockRiff,
                name: "Updated riff name",
                time: 30,
            };

            const result = await repository.upsertRiff(videoId, updatedRiff);

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [videoKey(videoId)]: {
                    ...video,
                    riffs: [updatedRiff],
                    updatedAt: expect.any(Date),
                },
            });

            expect(result).toEqual([updatedRiff]);
        });

        it("should throw RiffNotFoundError when updating non-existent saved riff", async () => {
            const video = {
                ...mockVideo,
                riffs: [],
            };
            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });

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
            const existingRiffs = [savedMockRiff];
            const video = {
                ...mockVideo,
                riffs: existingRiffs,
            };
            mockChromeGet.mockResolvedValue({ [videoKey(video.id)]: video });

            const duplicateRiff: Riff = {
                hotkey: savedMockRiff.hotkey,
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
