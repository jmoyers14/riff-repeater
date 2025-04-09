import { colors, fontFamilies } from "../theme";
import { css } from "goober";
import { h } from "preact";
import { Riff } from "../types";
import { formatTime } from "../utils/formatTime";
import "../assets/edit.svg";

const editSvg = chrome.runtime.getURL("assets/edit.svg");

const $riffItemContainer = css({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
    "&:first-child": {
        marginTop: "0",
    },
});

const $riffHotkey = css({
    border: `1px solid ${colors.border}`,
    fontFamily: fontFamilies.serif,
    backgroundColor: colors.mantle,
    color: colors.mauve,
    padding: "4px",
    borderRadius: "6px",
    fontWeight: "bold",
    width: "24px",
    height: "24px",
    textAlign: "center",
    fontSize: "1.6em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

const $riffName = css({
    fontFamily: fontFamilies.sans,
    color: colors.text,
    flexGrow: 1,
    fontSize: "1.2em",
});

const $riffTimestamp = css({
    color: colors.blue,
    fontFamily: fontFamilies.sans,
    marginRight: "12px",
    fontSize: "1.2em",
});

const $editButton = css({
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
});

const $editButtonImg = css({
    width: "20px",
    height: "20px",
    filter: "invert(57%) sepia(86%) saturate(1921%) hue-rotate(203deg) brightness(101%) contrast(96%)",
    ":hover": {
        filter: "invert(42%) sepia(99%) saturate(7404%) hue-rotate(256deg) brightness(101%) contrast(98%)",
    },
});

interface RiffItemProps {
    riff: Riff;
    onDelete: (riff: Riff) => void;
    onEdit: (riff: Riff) => void;
    onJump: (time: number) => void;
}

export const RiffItem = (props: RiffItemProps) => {
    const { riff, onDelete, onEdit, onJump } = props;

    const { hotkey, name, time } = riff;

    return (
        <div className={$riffItemContainer}>
            <span className={$riffHotkey}>{hotkey}</span>
            <span className={$riffName}>{name}</span>
            <span className={$riffTimestamp}> {formatTime(time)}</span>
            <button
                className={$editButton}
                onClick={() => {
                    onEdit(riff);
                }}
                title="Edit"
            >
                <img className={$editButtonImg} src={editSvg} alt="Edit" />
            </button>
        </div>
    );
};
