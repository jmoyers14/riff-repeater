// https://support.google.com/youtube/answer/7631406?hl=en
import { YOUTUBE_KEYBOARD_SHORTCUTS } from "../constants/hotkeys";

type YouTubeShortcutKey = (typeof YOUTUBE_KEYBOARD_SHORTCUTS)[number];

export const youTubeKeyboardShortcuts: Set<string> = new Set(
    YOUTUBE_KEYBOARD_SHORTCUTS
);

export const youTubeKeyboardShortcutDescription: Record<
    YouTubeShortcutKey,
    string
> = {
    k: "Pause/Play in player.",
    m: "Mute/unmute the video.",
    j: "Seek backward 10 seconds in player.",
    l: "Seek forward 10 seconds in player.",
    i: "Open the Miniplayer",
    ".": "While the video is paused, skip to the next frame",
    ",": "While the video is paused go back to the previous frame",
    ">": "Speed up the video playback rate.",
    "<": "Slow down the video playback rate.",
    "0": "Seek to the beginning of the video.",
    "1": "Seek to 10% of the video",
    "2": "Seek to 20% of the video.",
    "3": "Seek to 30% of the video.",
    "4": "Seek to 40% of the video.",
    "5": "Seek to 50% of the video.",
    "6": "Seek to 60% of the video.",
    "7": "Seek to 70% of the video.",
    "8": "Seek to 80% of the video.",
    "9": "Seek to 90% of the video.",
} as const;

export const isYouTubeKeyboardShortcut = (
    key: string
): key is YouTubeShortcutKey => {
    return youTubeKeyboardShortcuts.has(key);
};
