import { Riff, SavedRiff, SavedVideo, Video } from "../types";
import { RiffsRepositroy } from "./riffsRepository";
import { generateId } from "../utils/generateId";
import { isSavedRiff } from "../utils/isSavedRiff";

export class DuplicateHotkeyError extends Error {
    constructor(public hotkey: string) {
        super(
            `Hotkey "${hotkey}" is already in use. Please choose a different hotkey.`
        );
    }
}

export class RiffNotFoundError extends Error {
    constructor(
        public videoId: string,
        public id: string
    ) {
        super(`Riff ${videoId} ${id} not found.`);
    }
}

export class VideoNotFoundError extends Error {
    constructor(public videoId: string) {
        super(`Video ${videoId} not found.`);
    }
}

export class ChromeStorageRiffsRepository implements RiffsRepositroy {
    private videoKeyPrefix = "video";
    private videoKey(videoId: string): string {
        return `${this.videoKeyPrefix}:${videoId}`;
    }

    private createSavedVideo(video: Video): SavedVideo {
        return {
            ...video,
            createdDate: new Date(),
            updatedAt: new Date(),
        };
    }

    private createRiff(riff: Riff): SavedRiff {
        return {
            ...riff,
            id: generateId(),
        };
    }

    async addRiff(videoId: string, riff: Riff): Promise<SavedRiff[]> {
        const video = await this.getVideo(videoId);
        if (!video) {
            throw new VideoNotFoundError(videoId);
        }

        const { riffs } = video;

        const existingRiff = riffs.find((r) => r.hotkey === riff.hotkey);
        if (existingRiff) {
            throw new DuplicateHotkeyError(riff.hotkey);
        }

        const updatedVideo = await this.updateVideo({
            ...video,
            riffs: [...riffs, this.createRiff(riff)],
        });

        return updatedVideo.riffs;
    }

    async addVideo(video: Video): Promise<SavedVideo> {
        const existingVideo = await this.getVideo(video.id);

        if (existingVideo) {
            const riffs = [...existingVideo.riffs, ...video.riffs];
            const updatedVideo: SavedVideo = {
                ...existingVideo,
                ...video,
                riffs,
                createdDate: existingVideo.createdDate,
                updatedAt: new Date(),
            };

            await chrome.storage.local.set({
                [this.videoKey(video.id)]: updatedVideo,
            });
            return updatedVideo;
        }

        const savedVideo = this.createSavedVideo(video);
        await chrome.storage.local.set({
            [this.videoKey(video.id)]: savedVideo,
        });
        return savedVideo;
    }

    async deleteRiff(videoId: string, riff: SavedRiff): Promise<SavedRiff[]> {
        const video = await this.getVideo(videoId);
        if (!video) {
            throw new VideoNotFoundError(videoId);
        }

        const updatedRiffs = video.riffs.filter((m) => m.id !== riff.id);

        if (updatedRiffs.length === video.riffs.length) {
            return video.riffs;
        }

        const updatedVideo = await this.updateVideo({
            ...video,
            riffs: updatedRiffs,
        });

        return updatedVideo.riffs;
    }

    async getRiffs(videoId: string): Promise<SavedRiff[]> {
        const result = await chrome.storage.local.get(this.videoKey(videoId));
        return result[this.videoKey(videoId)]?.riffs ?? [];
    }

    async getVideo(videoId: string): Promise<SavedVideo | null> {
        const videoKey = this.videoKey(videoId);
        const result = await chrome.storage.local.get(videoKey);
        return result[videoKey] || null;
    }

    async getVideos(): Promise<SavedVideo[]> {
        const result = await chrome.storage.local.get();
        return Object.entries(result)
            .filter(([key]) => key.startsWith(this.videoKeyPrefix + ":"))
            .map(([, value]) => value) as SavedVideo[];
    }

    async updateRiff(videoId: string, riff: SavedRiff): Promise<SavedRiff[]> {
        const video = await this.getVideo(videoId);
        if (!video) {
            throw new VideoNotFoundError(videoId);
        }
        const index = video.riffs.findIndex((r) => r.id === riff.id);
        if (index >= 0) {
            video.riffs[index] = riff;
        } else {
            throw new RiffNotFoundError(videoId, riff.id);
        }
        const updatedVideo = await this.updateVideo(video);
        return updatedVideo.riffs;
    }

    async updateVideo(video: SavedVideo): Promise<SavedVideo> {
        const existingVideo = await this.getVideo(video.id);
        if (!existingVideo) {
            throw new VideoNotFoundError(video.id);
        }

        const updatedVideo = {
            ...video,
            updatedAt: new Date(),
        };

        await chrome.storage.local.set({
            [this.videoKey(video.id)]: updatedVideo,
        });
        return updatedVideo;
    }

    async upsertRiff(
        videoId: string,
        riff: SavedRiff | Riff
    ): Promise<SavedRiff[]> {
        if (isSavedRiff(riff)) {
            return this.updateRiff(videoId, riff);
        } else {
            return this.addRiff(videoId, riff);
        }
    }
}
