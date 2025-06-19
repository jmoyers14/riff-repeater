import { colors, fontFamilies } from "../theme";
import { css } from "goober";
import { getCurrentTime } from "../utils/videoPlayer";
import { h } from "preact";
import { useState } from "preact/hooks";
import { RiffDialog } from "./RiffDialog";
import { Riff, SavedRiff } from "../types";
import { RiffItem } from "./RiffItem";
import "../assets/plus-circle.svg";

const addSvg = chrome.runtime.getURL("assets/plus-circle.svg");

const $panel = css({
    border: `2px solid ${colors.sapphire}`,
    borderRadius: "10px",
    padding: "16px",
    backgroundColor: colors.base,
    margin: "16px 0px",
});

const $panelHeader = css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
});

const $title = css({
    color: colors.text,
    margin: "0px",
    fontSize: "1.8em",
    fontWeight: "bold",
    fontFamily: fontFamilies.sans,
});

const $addButton = css({
    backgroundColor: "transparent",
    border: "none",
    margin: "0",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
});

const $addButtonImg = css({
    width: "24px",
    height: "24px",
    filter: "invert(48%) sepia(82%) saturate(463%) hue-rotate(71deg) brightness(96%) contrast(89%)",
    ":hover": {
        filter: "invert(48%) sepia(97%) saturate(463%) hue-rotate(152deg) brightness(91%) contrast(95%)",
    },
});

const $riffsContainer = css({
    marginTop: "24px",
});

interface ControlPanelProps {
    videoId?: string;
    riffs: Record<string, SavedRiff>;
    onDeleteRiff: (riff: SavedRiff, videoId: string) => Promise<void>;
    onSubmitRiff: (riff: Riff | SavedRiff, videoId: string) => Promise<void>;
    onDialogOpen?: () => void;
    onDialogClose?: () => void;
}

export const ControlPanel = (props: ControlPanelProps) => {
    const [selectedRiff, setSelectedRiff] = useState<
        Partial<SavedRiff> | undefined
    >(undefined);

    const {
        onDeleteRiff,
        onDialogClose,
        onDialogOpen,
        onSubmitRiff,
        riffs,
        videoId,
    } = props;

    const openDialog = (riff: Partial<SavedRiff>) => {
        setSelectedRiff(riff);
        if (onDialogOpen) {
            onDialogOpen();
        }
    };

    const closeDialog = () => {
        setSelectedRiff(undefined);
        if (onDialogClose) {
            onDialogClose();
        }
    };

    const handleAddRiff = () => {
        const newRiff: Partial<SavedRiff> = {
            time: getCurrentTime() ?? 0,
        };
        openDialog(newRiff);
    };

    const handleCancel = () => {
        closeDialog();
    };

    const handleDeleteRiff = async (riff: SavedRiff) => {
        if (!videoId) {
            return;
        }
        onDeleteRiff(riff, videoId);
        closeDialog();
    };

    const handleEditRiff = async (riff: SavedRiff) => {
        openDialog(riff);
    };

    const handleSubmitRiff = async (riff: Riff | SavedRiff) => {
        if (!videoId) {
            return;
        }
        await onSubmitRiff(riff, videoId);
        closeDialog();
    };

    const sortAsc = (riffA: SavedRiff, riffB: SavedRiff) => {
        return riffA.time - riffB.time;
    };

    return (
        <div className={$panel}>
            <div className={$panelHeader}>
                <h1 className={$title}>Riff Reapeter</h1>
                <button className={$addButton} onClick={handleAddRiff}>
                    <img className={$addButtonImg} src={addSvg} alt="Add" />
                </button>
            </div>
            <div className={$riffsContainer}>
                {Object.values(riffs)
                    .sort(sortAsc)
                    .map((riff) => (
                        <RiffItem
                            key={riff.hotkey}
                            riff={riff}
                            onDelete={handleDeleteRiff}
                            onEdit={handleEditRiff}
                            onJump={() => {}}
                        />
                    ))}
            </div>

            {selectedRiff && (
                <RiffDialog
                    initialValues={selectedRiff}
                    onCancel={handleCancel}
                    onDelete={handleDeleteRiff}
                    onSubmit={handleSubmitRiff}
                />
            )}
        </div>
    );
};
