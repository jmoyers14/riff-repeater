import { h } from "preact";
import { Mark } from "../types";
import { formatTime } from "../utils/formatTime";
import "../assets/edit.svg";

const editSvg = chrome.runtime.getURL("assets/edit.svg");

interface BookmarkItemProps {
    mark: Mark;
    onDelete: (mark: Mark) => void;
    onEdit: (mark: Mark) => void;
    onJump: (time: number) => void;
}

export const MarkItem = (props: BookmarkItemProps) => {
    const { mark, onDelete, onEdit, onJump } = props;

    const { hotkey, name, time } = mark;

    return (
        <div className="mark-item">
            <span className="mark-hotkey">{hotkey}</span>
            <span className="mark-name">{name}</span>
            <span className="mark-timestamp"> {formatTime(time)}</span>
            <button
                className="edit-button"
                onClick={() => {
                    onEdit(mark);
                }}
                title="Edit"
            >
                <img src={editSvg} alt="Edit" />
            </button>
        </div>
    );
};
