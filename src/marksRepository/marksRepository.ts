import { Mark } from "../types";

export interface MarksRepositroy {
    addMark(song: string, mark: Mark): Promise<void>;
    deleteMark(song: string, mark: Mark): Promise<void>;
    getMarks(song: string): Promise<Mark[]>;
}
