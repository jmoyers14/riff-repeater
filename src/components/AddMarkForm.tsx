import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";

import { Mark } from "../types";

interface AddMarkFormProps {
    initialTime: number;
    onSubmit: (mark: Mark) => void;
    onCancel: () => void;
}

export const AddMarkForm = ({
    initialTime,
    onSubmit,
    onCancel,
}: AddMarkFormProps) => {
    const [name, setName] = useState("");
    const [hotkey, setHotkey] = useState("");
    const [time, setTime] = useState(initialTime);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus the name input when the form appears
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e: Event) => {
        e.preventDefault();

        if (hotkey.length !== 1) {
            alert("Please enter a single character as the hotkey");
            return;
        }

        onSubmit({
            name,
            hotkey,
            time,
        });
    };

    return (
        <div className="bookmark-dialog">
            <div className="bookmark-dialog-content">
                <h3>Add New Bookmark</h3>
                <form id="bookmark-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="bookmark-name">Name:</label>
                        <input
                            type="text"
                            id="bookmark-name"
                            ref={nameInputRef}
                            value={name}
                            onInput={(e) =>
                                setName((e.target as HTMLInputElement).value)
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bookmark-hotkey">
                            Hotkey (single character):
                        </label>
                        <input
                            type="text"
                            id="bookmark-hotkey"
                            maxLength={1}
                            value={hotkey}
                            onInput={(e) =>
                                setHotkey((e.target as HTMLInputElement).value)
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bookmark-time">Time (seconds):</label>
                        <input
                            type="number"
                            id="bookmark-time"
                            value={time}
                            onInput={(e) =>
                                setTime(
                                    parseInt(
                                        (e.target as HTMLInputElement).value
                                    )
                                )
                            }
                            required
                        />
                    </div>
                    <div className="dialog-buttons">
                        <button type="submit">Save</button>
                        <button
                            type="button"
                            id="cancel-bookmark"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
