export type Riff = {
    hotkey: string;
    name: string;
    time: number;
};

export type SavedRiff = { id: string } & Riff;
