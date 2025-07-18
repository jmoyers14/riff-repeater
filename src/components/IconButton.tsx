import { colors, fontFamilies } from "../theme";
import { css } from "goober";
import { h } from "preact";

const $button = css({
    position: "relative",
    backgroundColor: "transparent",
    border: "none",
    margin: "0",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
    "&:hover::after": {
        content: "attr(data-tooltip)",
        position: "absolute",
        bottom: "-35px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: colors.surface0,
        color: colors.text,
        padding: "6px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontFamily: fontFamilies.sans,
        whiteSpace: "nowrap",
        zIndex: 1000,
        border: `1px solid ${colors.surface1}`,
        boxShadow: `0 2px 8px ${colors.overlay0}33`,
    },
    "&:hover::before": {
        content: "",
        position: "absolute",
        bottom: "-5px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "0",
        height: "0",
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderBottom: `5px solid ${colors.surface0}`,
        zIndex: 1001,
    },
});

const $iconStyle = (filter: string, hoverFilter?: string) =>
    css({
        width: "24px",
        height: "24px",
        filter: filter,
        ":hover": {
            filter: hoverFilter || filter,
        },
    });

interface IconButtonProps {
    src: string;
    alt: string;
    tooltip: string;
    onClick: () => void;
    filter: string;
    hoverFilter?: string;
}

export const IconButton = ({
    src,
    alt,
    tooltip,
    onClick,
    filter,
    hoverFilter,
}: IconButtonProps) => {
    return (
        <button className={$button} onClick={onClick} data-tooltip={tooltip}>
            <img
                className={$iconStyle(filter!, hoverFilter)}
                src={src}
                alt={alt}
            />
        </button>
    );
};
