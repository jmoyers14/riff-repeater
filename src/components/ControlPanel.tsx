import { h } from "preact";
import { useState } from "preact/hooks";
import { AddMarkForm } from "./AddMarkForm";
import { Mark } from "../types";
import { MarkItem } from "./MarkItem";

interface ControlPanelProps {
    videoId?: string;
    marks: Record<string, Mark>;
    onAddMark: (mark: Mark, videoId?: string) => Promise<void>;
    onDeleteMark: (mark: Mark, videoId?: string) => Promise<void>;
}

export const ControlPanel = (props: ControlPanelProps) => {
    const [showAddDialog, setShowAddDialog] = useState(false);

    const { onAddMark, onDeleteMark, marks, videoId } = props;

    const handleAddMark = () => {
        setShowAddDialog(true);
    };

    const handleSubmitMark = async (mark: Mark) => {
        await onAddMark(mark, videoId);
        setShowAddDialog(false);
    };

    const handleDeleteMark = async (mark: Mark) => {
        return onDeleteMark(mark, videoId);
    };

    return (
        <div className="yt-practice-control-panel">
            <div className="panel-header">
                <h3>Practice Bookmarks</h3>
                <button id="add-bookmark-btn" onClick={handleAddMark}>
                    Add Bookmark
                </button>
            </div>
            <div
                id="bookmarks-container"
                style={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                {Object.values(marks).map((mark) => (
                    <MarkItem
                        key={mark.hotkey}
                        mark={mark}
                        onDelete={handleDeleteMark}
                        onJump={() => {}}
                    />
                ))}
            </div>

            {showAddDialog && (
                <AddMarkForm
                    initialTime={0}
                    onSubmit={handleSubmitMark}
                    onCancel={() => setShowAddDialog(false)}
                />
            )}

            <style>{`
                .bookmark-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px;
                    background: #2f2f2f;
                    border-radius: 4px;
                    color: white;
                    position: relative;
                    z-index: 1;
                    pointer-events: auto;
                }
                .bookmark-actions {
                    display: flex;
                    gap: 4px;
                }
                .yt-practice-control-panel {
                    position: relative;
                    z-index: 1;
                    pointer-events: auto;
                    background: #0f0f0f;
                    padding: 16px;
                    border-radius: 8px;
                    margin: 16px 0;
                }
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
