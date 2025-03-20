import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import { AddMarkForm } from "./AddMarkForm";
import { Mark } from "../types";
import { MarkItem } from "./MarkItem";
import { MarksRepositroy } from "../marksRepository/marksRepository";
import { ChromeStorageMarksRepository } from "../marksRepository/chromeStorageMarksRepository";

interface ControlPanelProps {
    videoId?: string;
}

const marksRepository: MarksRepositroy = new ChromeStorageMarksRepository();

const groupByHotkey = (marks: Mark[]): Record<string, Mark> => {
    return marks.reduce(
        (acc, curr) => {
            acc[curr.hotkey] = curr;
            return acc;
        },
        {} as Record<string, Mark>
    );
};

export const ControlPanel = (props: ControlPanelProps) => {
    const [marks, setMarks] = useState<Record<string, Mark>>({});
    const [showAddDialog, setShowAddDialog] = useState(false);

    useEffect(() => {
        const { videoId } = props;
        if (videoId) {
            loadMarks(videoId);
        }
    }, []);

    const loadMarks = async (videoId: string) => {
        try {
            const loadedMarks = await marksRepository.getMarks(videoId);
            const groupedMarks = groupByHotkey(loadedMarks);
            setMarks(groupedMarks);
        } catch (error) {
            console.error("Error loading marks:", error);
        }
    };

    const handleAddMark = () => {
        setShowAddDialog(true);
    };

    const handleSubmitMark = async (mark: Mark) => {
        /*
        setMarks((prev) => ({
            ...prev,
            [mark.hotkey]: mark,
        }));

        marksMap[mark.hotkey] = mark;

        const videoId = videoIdRef.current;
        if (videoId) {
            await marksRepository.addMark(videoId, mark);
        }

        setShowAddDialog(false);
        */
    };

    const handleDeleteMark = async (hotkey: string) => {
        /*
        const newMarks = { ...marks };
        const deletedMark = newMarks[hotkey];
        delete newMarks[hotkey];
        setMarks(newMarks);

        delete marksMap[hotkey];

        const videoId = videoIdRef.current;
        if (videoId && deletedMark) {
            await marksRepository.removeMark(videoId, deletedMark);
        }
        */
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
