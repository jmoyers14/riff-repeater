import {
    ALPHABETICAL_KEYS,
    PREFERRED_KEYS,
    QUICK_ADD_RIFF,
    YOUTUBE_KEYBOARD_SHORTCUTS,
} from "../constants/hotkeys";

export const suggestAvailableKey = (
    userChosenKeys: string[]
): string | null => {
    const unavailableKeys = new Set([
        ...QUICK_ADD_RIFF,
        ...YOUTUBE_KEYBOARD_SHORTCUTS,
        ...userChosenKeys,
    ]);

    for (const key of PREFERRED_KEYS) {
        if (!unavailableKeys.has(key)) {
            return key;
        }
    }

    for (const key of ALPHABETICAL_KEYS) {
        if (!unavailableKeys.has(key)) {
            return key;
        }
    }

    return null;
};
