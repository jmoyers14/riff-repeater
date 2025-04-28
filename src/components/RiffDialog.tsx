import { colors, fontFamilies } from "../theme";
import { css } from "goober";
import { h } from "preact";
import { isSavedRiff } from "../utils/isSavedRiff";
import { useState, useEffect, useRef } from "preact/hooks";
import { DurationInput } from "./DurationInput";

import { Riff, SavedRiff } from "../types";

interface RiffDialogProps {
    initialValues: Partial<SavedRiff>;
    onCancel: () => void;
    onDelete: (riff: SavedRiff) => void;
    onSubmit: (riff: Riff | SavedRiff) => void;
}

const $riffDialog = css({
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
});

const $dialogContent = css({
    background: colors.base,
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px",
});

const $formGroup = css({
    marginBottom: "15px",
});

const $formLabel = css({
    display: "block",
    marginBottom: "8px",
    color: colors.text,
    fontSize: "14px",
    fontFamily: fontFamilies.sans,
});

const $formInput = css({
    width: "100%",
    padding: "8px 12px",
    border: "1px solid",
    borderColor: colors.overlay0,
    borderRadius: "4px",
    background: colors.crust,
    color: colors.text,
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
    "&:focus": {
        outline: "none",
        borderColor: colors.lavender,
        boxShadow: `0 0 0 1px ${colors.lavender}`,
    },
});

const $dialogButtons = css({
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
});

const $submitButton = css({
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    background: colors.lavender,
    color: "white",
});

const $cancelButton = css({
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    background: colors.overlay0,
    color: "white",
});

const $deleteButton = css({
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    background: colors.red,
    color: "white",
});

export const RiffDialog = (props: RiffDialogProps) => {
    const { initialValues, onCancel, onDelete, onSubmit } = props;
    const [name, setName] = useState(initialValues.name);
    const [hotkey, setHotkey] = useState(initialValues.hotkey);
    const [time, setTime] = useState(initialValues.time);

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const handleDelete = (e: Event) => {
        e.preventDefault();
        if (!isSavedRiff(initialValues)) {
            return;
        }
        onDelete(initialValues);
    };

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
            id: initialValues.id,
            name,
            hotkey,
            time,
        });
    };

    return (
        <div className={$riffDialog}>
            <div className={$dialogContent}>
                <form id="riff-form" onSubmit={handleSubmit}>
                    <div className={$formGroup}>
                        <label className={$formLabel} htmlFor="riff-name">
                            Name:
                        </label>
                        <input
                            className={$formInput}
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
                    <div className={$formGroup}>
                        <label className={$formLabel} htmlFor="riff-hotkey">
                            Hotkey (single character):
                        </label>
                        <input
                            className={$formInput}
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
                    <div className={$formGroup}>
                        <label className={$formLabel} htmlFor="riff-time">
                            Time:
                        </label>
                        <DurationInput
                            className={$formInput}
                            id="riff-time"
                            value={time}
                            required
                            onDurationChanged={(duration: number) => {
                                setTime(duration);
                            }}
                        />
                    </div>
                    <div className={$dialogButtons}>
                        <button className={$submitButton} type="submit">
                            Save
                        </button>
                        {initialValues.id ? (
                            <button
                                className={$deleteButton}
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        ) : null}
                        <button
                            className={$cancelButton}
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
