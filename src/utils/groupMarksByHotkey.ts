import { Mark } from "../types";

export const groupMarksByHotkey = (marks: Mark[]): Record<string, Mark> => {
    return marks.reduce(
        (acc, curr) => {
            acc[curr.hotkey] = curr;
            return acc;
        },
        {} as Record<string, Mark>
    );
};
