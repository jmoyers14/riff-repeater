import { h } from "preact";
import { Riff } from "../types";
import { formatTime } from "../utils/formatTime";
import "../assets/edit.svg";

const editSvg = chrome.runtime.getURL("assets/edit.svg");

interface BookriffItemProps {
    riff: Riff;
    onDelete: (riff: Riff) => void;
    onEdit: (riff: Riff) => void;
    onJump: (time: number) => void;
}

export const RiffItem = (props: BookriffItemProps) => {
    const { riff, onDelete, onEdit, onJump } = props;

    const { hotkey, name, time } = riff;

    return (
        <div className="riff-item">
            <span className="riff-hotkey">{hotkey}</span>
            <span className="riff-name">{name}</span>
            <span className="riff-timestamp"> {formatTime(time)}</span>
            <button
                className="edit-button"
                onClick={() => {
                    onEdit(riff);
                }}
                title="Edit"
            >
                <img src={editSvg} alt="Edit" />
            </button>
        </div>
    );
};
