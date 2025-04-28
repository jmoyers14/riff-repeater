import { Riff, SavedRiff } from "../types";

export interface RiffsRepositroy {
    addRiff(videoId: string, riff: Riff): Promise<SavedRiff>;
    deleteRiff(videoId: string, riff: Riff): Promise<void>;
    getRiffs(videoId: string): Promise<SavedRiff[]>;
    updateRiff(videoId: string, riff: SavedRiff): Promise<SavedRiff>;
    upsertRiff(videoId: string, riff: Riff): Promise<SavedRiff>;
}
