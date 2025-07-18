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
            modifiedDate: new Date(),
        };
    }

    private createRiff(riff: Riff): SavedRiff {
        return {
            ...riff,
            id: generateId(),
        };
    }

    private serializeVideo(video: SavedVideo): any {
        return {
            ...video,
            createdDate: video.createdDate.toISOString(),
            modifiedDate: video.modifiedDate.toISOString(),
        };
    }

    private deserializeVideo(data: any): SavedVideo {
        return {
            ...data,
            createdDate: new Date(data.createdDate),
            modifiedDate: new Date(data.modifiedDate),
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
                modifiedDate: new Date(),
            };

            await chrome.storage.local.set({
                [this.videoKey(video.id)]: this.serializeVideo(updatedVideo),
            });
            return updatedVideo;
        }

        const savedVideo = this.createSavedVideo(video);
        await chrome.storage.local.set({
            [this.videoKey(video.id)]: this.serializeVideo(savedVideo),
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
        const data = result[this.videoKey(videoId)];
        return data ? this.deserializeVideo(data).riffs : [];
    }

    async getVideo(videoId: string): Promise<SavedVideo | null> {
        const videoKey = this.videoKey(videoId);
        const result = await chrome.storage.local.get(videoKey);
        const data = result[videoKey];
        return data ? this.deserializeVideo(data) : null;
    }

    async getVideos(): Promise<SavedVideo[]> {
        const result = await chrome.storage.local.get();
        return Object.entries(result)
            .filter(([key]) => key.startsWith(this.videoKeyPrefix + ":"))
            .map(([, value]) => this.deserializeVideo(value));
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
            modifiedDate: new Date(),
        };

        await chrome.storage.local.set({
            [this.videoKey(video.id)]: this.serializeVideo(updatedVideo),
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
