import { Riff, SavedRiff } from "../types";
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

export class ChromeStorageRiffsRepository implements RiffsRepositroy {
    private storageKey(videoId: string): string {
        return `riffs_${videoId}`;
    }

    private createRiff(riff: Riff): SavedRiff {
        return {
            ...riff,
            id: generateId(),
        };
    }

    async addRiff(videoId: string, riff: Riff): Promise<SavedRiff[]> {
        const riffs = await this.getRiffs(videoId);

        const existingRiff = riffs.find((r) => r.hotkey === riff.hotkey);
        if (existingRiff) {
            throw new DuplicateHotkeyError(riff.hotkey);
        }

        const savedRiffs = [...riffs, this.createRiff(riff)];
        await chrome.storage.local.set({
            [this.storageKey(videoId)]: savedRiffs,
        });
        return savedRiffs;
    }

    async deleteRiff(videoId: string, riff: Riff): Promise<SavedRiff[]> {
        const riffs = await this.getRiffs(videoId);
        const filtered = riffs.filter((m) => m.hotkey !== riff.hotkey);
        await chrome.storage.local.set({
            [this.storageKey(videoId)]: filtered,
        });
        return filtered;
    }

    async getRiffs(videoId: string): Promise<SavedRiff[]> {
        const key = this.storageKey(videoId);
        const result = await chrome.storage.local.get(key);
        return result[key] ?? [];
    }

    async updateRiff(videoId: string, riff: SavedRiff): Promise<SavedRiff[]> {
        const key = this.storageKey(videoId);
        const riffs = await this.getRiffs(videoId);
        const index = riffs.findIndex((r) => r.id === riff.id);
        if (index >= 0) {
            riffs[index] = riff;
        } else {
            throw new RiffNotFoundError(videoId, riff.id);
        }
        await chrome.storage.local.set({ [key]: riffs });
        return riffs;
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
