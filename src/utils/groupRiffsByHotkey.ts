import { Riff } from "../types";

export const groupRiffsByHotkey = (riffs: Riff[]): Record<string, Riff> => {
    return riffs.reduce(
        (acc, curr) => {
            acc[curr.hotkey] = curr;
            return acc;
        },
        {} as Record<string, Riff>
    );
};
