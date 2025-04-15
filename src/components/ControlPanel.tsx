import { colors, fontFamilies } from "../theme";
import { css } from "goober";
import { getCurrentTime } from "../utils/videoPlayer";
import { h } from "preact";
import { useState } from "preact/hooks";
import { RiffDialog, RiffDialogValues } from "./RiffDialog";
import { Riff } from "../types";
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
    riffs: Record<string, Riff>;
    onAddRiff: (riff: Riff, videoId?: string) => Promise<void>;
    onDeleteRiff: (riff: Riff, videoId?: string) => Promise<void>;
}

export const ControlPanel = (props: ControlPanelProps) => {
    const [selectedRiff, setSelectedRiff] = useState<
        RiffDialogValues | undefined
    >(undefined);

    const { onAddRiff, onDeleteRiff, riffs, videoId } = props;

    const handleAddRiff = () => {
        const newRiff: RiffDialogValues = {
            time: getCurrentTime() ?? 0,
        };
        setSelectedRiff(newRiff);
    };

    const handleDeleteRiff = async (riff: Riff) => {
        return onDeleteRiff(riff, videoId);
    };

    const handleEditRiff = async (riff: Riff) => {
        setSelectedRiff(riff);
    };

    const handleSubmitRiff = async (riff: Riff) => {
        await onAddRiff(riff, videoId);
        setSelectedRiff(undefined);
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
                {Object.values(riffs).map((riff) => (
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
                    onSubmit={handleSubmitRiff}
                    onCancel={() => setSelectedRiff(undefined)}
                />
            )}
        </div>
    );
};
