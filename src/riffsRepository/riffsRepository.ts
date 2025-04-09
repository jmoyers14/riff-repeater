import { Riff } from "../types";

export interface RiffsRepositroy {
    addRiff(song: string, riff: Riff): Promise<void>;
    deleteRiff(song: string, riff: Riff): Promise<void>;
    getRiffs(song: string): Promise<Riff[]>;
}
