import { getCurrentTime } from "../utils/videoPlayer";
import { h } from "preact";
import { useState } from "preact/hooks";
import { AddMarkForm, AddMarkFormValues } from "./AddMarkForm";
import { Mark } from "../types";
import { MarkItem } from "./MarkItem";
import "../styles.css";
import "../assets/plus-circle.svg";

const addSvg = chrome.runtime.getURL("assets/plus-circle.svg");

interface ControlPanelProps {
    videoId?: string;
    marks: Record<string, Mark>;
    onAddMark: (mark: Mark, videoId?: string) => Promise<void>;
    onDeleteMark: (mark: Mark, videoId?: string) => Promise<void>;
}

export const ControlPanel = (props: ControlPanelProps) => {
    const [selectedMark, setSelectedMark] = useState<
        AddMarkFormValues | undefined
    >(undefined);

    const { onAddMark, onDeleteMark, marks, videoId } = props;

    const handleAddMark = () => {
        const newMark: AddMarkFormValues = {
            time: getCurrentTime() ?? 0,
        };
        setSelectedMark(newMark);
    };

    const handleDeleteMark = async (mark: Mark) => {
        return onDeleteMark(mark, videoId);
    };

    const handleEditMark = async (mark: Mark) => {
        setSelectedMark(mark);
    };

    const handleSubmitMark = async (mark: Mark) => {
        await onAddMark(mark, videoId);
        setSelectedMark(undefined);
    };

    return (
        <div className="yt-control-panel">
            <div className="panel-header">
                <h1 className="title">Riff Reapeter</h1>
                <button className="add-button" onClick={handleAddMark}>
                    <img src={addSvg} alt="Add" />
                </button>
            </div>
            <div className="marks-container">
                {Object.values(marks).map((mark) => (
                    <MarkItem
                        key={mark.hotkey}
                        mark={mark}
                        onDelete={handleDeleteMark}
                        onEdit={handleEditMark}
                        onJump={() => {}}
                    />
                ))}
            </div>

            {selectedMark && (
                <AddMarkForm
                    initialValues={selectedMark}
                    onSubmit={handleSubmitMark}
                    onCancel={() => setSelectedMark(undefined)}
                />
            )}

            <style>{`
                .bookmark-dialog {
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
                .bookmark-dialog-content {
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
