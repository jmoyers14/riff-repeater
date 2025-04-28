import { SavedRiff } from "../types";

export const groupRiffsByHotkey = (
    riffs: SavedRiff[]
): Record<string, SavedRiff> => {
    return riffs.reduce(
        (acc, curr) => {
            acc[curr.hotkey] = curr;
            return acc;
        },
        {} as Record<string, SavedRiff>
    );
};
