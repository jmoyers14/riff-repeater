import { Mark } from "../types";
import { MarksRepositroy } from "./marksRepository";

export class ChromeStorageMarksRepository implements MarksRepositroy {
    private storageKey(videoId: string): string {
        return `marks_${videoId}`;
    }

    async addMark(videoId: string, mark: Mark): Promise<void> {
        const marks = await this.getMarks(videoId);
        marks.push(mark);
        await chrome.storage.local.set({ [this.storageKey(videoId)]: marks });
    }

    async deleteMark(videoId: string, mark: Mark): Promise<void> {
        const marks = await this.getMarks(videoId);
        const filtered = marks.filter((m) => m.hotkey !== mark.hotkey);
        await chrome.storage.local.set({
            [this.storageKey(videoId)]: filtered,
        });
    }

    async getMarks(videoId: string): Promise<Mark[]> {
        const key = this.storageKey(videoId);
        const result = await chrome.storage.local.get(key);
        return result[key] ?? [];
    }
}
