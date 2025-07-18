export type Video = {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    riffs: SavedRiff[];
};

export type SavedVideo = {
    createdDate: Date;
    modifiedDate: Date;
} & Video;

export type Riff = {
    hotkey: string;
    name: string;
    time: number;
};

export type SavedRiff = { id: string } & Riff;
