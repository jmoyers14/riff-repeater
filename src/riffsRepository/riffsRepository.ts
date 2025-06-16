import { Riff, SavedRiff, SavedVideo, Video } from "../types";

export interface RiffsRepositroy {
    addVideo(video: Video): Promise<SavedVideo>;
    addRiff(videoId: string, riff: Riff): Promise<SavedRiff[]>;
    deleteRiff(videoId: string, riff: SavedRiff): Promise<SavedRiff[]>;
    getRiffs(videoId: string): Promise<SavedRiff[]>;
    getVideo(videoId: string): Promise<SavedVideo | null>;
    getVideos(): Promise<SavedVideo[]>;
    updateRiff(videoId: string, riff: SavedRiff): Promise<SavedRiff[]>;
    upsertRiff(videoId: string, riff: Riff): Promise<SavedRiff[]>;
}
