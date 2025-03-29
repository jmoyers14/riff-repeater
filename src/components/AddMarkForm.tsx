import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import "../styles.css";

import { Mark } from "../types";

export type AddMarkFormValues = Partial<Mark>;

interface AddMarkFormProps {
    initialValues: Partial<Mark>;
    onSubmit: (mark: Mark) => void;
    onCancel: () => void;
}

export const AddMarkForm = (props: AddMarkFormProps) => {
    const { initialValues, onCancel, onSubmit } = props;
    const [name, setName] = useState(initialValues.name);
    const [hotkey, setHotkey] = useState(initialValues.hotkey);
    const [time, setTime] = useState(initialValues.time);

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus the name input when the form appears
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e: Event) => {
        e.preventDefault();

        if (!hotkey) {
            alert("Please enter a single character as the hotkey");
            return;
        }

        if (!name) {
            alert("Please enter a name");
            return;
        }

        if (!time) {
            alert("Please enter a time");
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
