import { Video } from "../types";

const isHtmlMetaElement = (
    element: Element | null
): element is HTMLMetaElement => {
    return element !== null && element.tagName === "META";
};

const getTextContent = (selector: string): string | null => {
    const element = document.querySelector(selector);
    if (!element) {
        return null;
    }
    if (isHtmlMetaElement(element)) {
        return (element as HTMLMetaElement).content;
    }

    return element.textContent?.trim() || "";
};

export const extractVideoInfo = (videoId: string): Omit<Video, "riffs"> => {
    const titleSelectors = [
        "h1.ytd-watch-metadata yt-formatted-string",
        "h1.ytd-video-primary-info-renderer",
        'h1 yt-formatted-string[class*="title"]',
        "#above-the-fold h1",
        'meta[name="title"]',
    ];

    let title = null;
    for (const selector of titleSelectors) {
        title = getTextContent(selector);
        if (title) {
            break;
        }
    }

    if (!title) {
        title = document.title.replace(" - YouTube", "");
    }
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    const url = window.location.href;
    return {
        id: videoId,
        title,
        thumbnail,
        url,
    };
};
