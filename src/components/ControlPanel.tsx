import { getCurrentTime } from "../utils/videoPlayer";
import { h } from "preact";
import { useState } from "preact/hooks";
import { AddRiffForm, AddRiffFormValues } from "./AddRiffForm";
import { Riff } from "../types";
import { RiffItem } from "./RiffItem";
import "../styles.css";
import "../assets/plus-circle.svg";

const addSvg = chrome.runtime.getURL("assets/plus-circle.svg");

interface ControlPanelProps {
    videoId?: string;
    riffs: Record<string, Riff>;
    onAddRiff: (riff: Riff, videoId?: string) => Promise<void>;
    onDeleteRiff: (riff: Riff, videoId?: string) => Promise<void>;
}

export const ControlPanel = (props: ControlPanelProps) => {
    const [selectedRiff, setSelectedRiff] = useState<
        AddRiffFormValues | undefined
    >(undefined);

    const { onAddRiff, onDeleteRiff, riffs, videoId } = props;

    const handleAddRiff = () => {
        const newRiff: AddRiffFormValues = {
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
        <div className="yt-control-panel">
            <div className="panel-header">
                <h1 className="title">Riff Reapeter</h1>
                <button className="add-button" onClick={handleAddRiff}>
                    <img src={addSvg} alt="Add" />
                </button>
            </div>
            <div className="riffs-container">
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
                <AddRiffForm
                    initialValues={selectedRiff}
                    onSubmit={handleSubmitRiff}
                    onCancel={() => setSelectedRiff(undefined)}
                />
            )}

            <style>{`
                .bookriff-dialog {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .bookriff-dialog-content {
                    background: #2f2f2f;
                    padding: 20px;
                    border-radius: 8px;
                    min-width: 300px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: white;
                }
                .form-group input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #444;
                    border-radius: 4px;
                    background: #1f1f1f;
                    color: white;
                }
                .dialog-buttons {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }
                .dialog-buttons button {
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                }
                .dialog-buttons button[type="submit"] {
                    background: #065fd4;
                    color: white;
                }
                .dialog-buttons button[type="button"] {
                    background: #444;
                    color: white;
                }
            `}</style>
        </div>
    );
};
