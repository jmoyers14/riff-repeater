import { Riff } from "../types";
import { RiffsRepositroy } from "./riffsRepository";

export class ChromeStorageRiffsRepository implements RiffsRepositroy {
    private storageKey(videoId: string): string {
        return `riffs_${videoId}`;
    }

    async addRiff(videoId: string, riff: Riff): Promise<void> {
        const riffs = await this.getRiffs(videoId);
        riffs.push(riff);
        await chrome.storage.local.set({ [this.storageKey(videoId)]: riffs });
    }

    async deleteRiff(videoId: string, riff: Riff): Promise<void> {
        const riffs = await this.getRiffs(videoId);
        const filtered = riffs.filter((m) => m.hotkey !== riff.hotkey);
        await chrome.storage.local.set({
            [this.storageKey(videoId)]: filtered,
        });
    }

    async getRiffs(videoId: string): Promise<Riff[]> {
        const key = this.storageKey(videoId);
        const result = await chrome.storage.local.get(key);
        return result[key] ?? [];
    }
}
