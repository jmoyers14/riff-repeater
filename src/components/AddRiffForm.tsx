import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import "../styles.css";
import { DurationInput } from "./DurationInput";

import { Riff } from "../types";

export type AddRiffFormValues = Partial<Riff>;

interface AddRiffFormProps {
    initialValues: Partial<Riff>;
    onSubmit: (riff: Riff) => void;
    onCancel: () => void;
}

export const AddRiffForm = (props: AddRiffFormProps) => {
    const { initialValues, onCancel, onSubmit } = props;
    const [name, setName] = useState(initialValues.name);
    const [hotkey, setHotkey] = useState(initialValues.hotkey);
    const [time, setTime] = useState(initialValues.time);

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
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
        <div className="riff-dialog">
            <div className="riff-dialog-content">
                <h3>Add New Bookriff</h3>
                <form id="riff-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="riff-name">Name:</label>
                        <input
                            type="text"
                            id="riff-name"
                            ref={nameInputRef}
                            value={name}
                            onInput={(e) =>
                                setName((e.target as HTMLInputElement).value)
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="riff-hotkey">
                            Hotkey (single character):
                        </label>
                        <input
                            type="text"
                            id="riff-hotkey"
                            maxLength={1}
                            value={hotkey}
                            onInput={(e) =>
                                setHotkey((e.target as HTMLInputElement).value)
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="riff-time">Time (seconds):</label>
                        <DurationInput
                            id="riff-time"
                            value={time}
                            required
                        />
                    </div>
                    <div className="dialog-buttons">
                        <button type="submit">Save</button>
                        <button
                            type="button"
                            id="cancel-riff"
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
