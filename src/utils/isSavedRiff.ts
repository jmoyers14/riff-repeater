import { SavedRiff } from "../types";

export const isSavedRiff = (riff: Partial<SavedRiff>): riff is SavedRiff => {
    return "id" in riff && !!riff.id;
};
