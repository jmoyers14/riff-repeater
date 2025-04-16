import { h } from "preact";
import { formatTime } from "../utils/formatTime";
import { useState } from "preact/hooks";

export interface DurationInputProps {
    className?: string;
    id: string;
    required: boolean;
    value?: number;
}

export const DurationInput = (props: DurationInputProps) => {
    const { className, id, required, value = 0 } = props;
    const [inputValue, setInputValue] = useState(formatTime(value));

    const formatDuration = (value: string): string => {
        const digits = value.replace(/\D/g, "");

        if (digits.length === 0) {
            return "";
        }

        if (digits.length <= 2) {
            return digits;
        }

        if (digits.length <= 4) {
            const minutes = digits.slice(0, digits.length - 2);
            const seconds = digits.slice(digits.length - 2);
            return `${minutes}:${seconds}`;
        }

        const hours = digits.slice(0, digits.length - 4);
        const minutes = digits.slice(digits.length - 4, digits.length - 2);
        const seconds = digits.slice(digits.length - 2);

        return `${hours}:${minutes}:${seconds}`;
    };

    const handleInput = (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        const target = e.currentTarget;
        const rawValue = target.value;

        const formattedValue = formatDuration(rawValue);

        setInputValue(formattedValue);
    };

    return (
        <input
            className={className}
            id={id}
            onInput={handleInput}
            required={required}
            type="text"
            value={inputValue}
        />
    );
};
