import { Riff, SavedRiff } from "../types";

export const isSavedRiff = (riff: Riff | SavedRiff): riff is SavedRiff => {
    return "id" in riff && !!riff.id;
};
