import { h, render, Fragment } from "preact";
import { Mark } from "../types";
import { formatTime } from "../utils/formatTime";

interface BookmarkItemProps {
    mark: Mark;
    onDelete: (hotkey: string) => void;
    onJump: (time: number) => void;
}

export const BookmarkItem = ({ mark, onDelete, onJump }: BookmarkItemProps) => {
    const { hotkey, name, time } = mark;

    return (
        <div className="bookmark-item">
            <div className="bookmark-info">
                <span className="bookmark-name">{name}</span>
                <span className="bookmark-hotkey"> {hotkey}</span>
                <span className="bookmark-time"> {formatTime(time)}</span>
            </div>
            <div className="bookmark-actions">
                <button
                    className="jump-bookmark"
                    onClick={() => onJump(time)}
                    title="Jump to this time"
                >
                    ▶
                </button>
                <button
                    className="delete-bookmark"
                    onClick={() => onDelete(hotkey)}
                    title="Delete bookmark"
                >
                    ×
                </button>
            </div>
        </div>
    );
};
