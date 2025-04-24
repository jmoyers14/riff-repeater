import { Riff } from "../types";

export interface RiffsRepositroy {
    addRiff(videoId: string, riff: Riff): Promise<void>;
    deleteRiff(videoId: string, riff: Riff): Promise<void>;
    getRiffs(videoId: string): Promise<Riff[]>;
    upsertRiff(videoId: string, riff: Riff): Promise<void>;
}
