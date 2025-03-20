import { h, render } from "preact";
import { waitForElement } from "./utils/waitForElement";
import { ChromeStorageMarksRepository } from "./marksRepository/chromeStorageMarksRepository";
import { Mark } from "./types";
import { MarksRepositroy } from "./marksRepository/marksRepository";
import { ControlPanel } from "./components/ControlPanel";

const VIDEO_SELECTOR = "video";

const getVideoPlayer = (): HTMLVideoElement | null => {
    const video = document.querySelector(VIDEO_SELECTOR);
    if (!video) {
        console.log("video not found");
    }
    return video;
};

let marks: Record<string, Mark> = {};

let rootContainer: HTMLDivElement | null = null;

const initializeRootContainer = () => {
    if (!rootContainer) {
        rootContainer = document.createElement("div");
        rootContainer.id = "yt-practice-root";
    }
    return rootContainer;
};

const init = async () => {
    console.log("initialize extension");

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v") ?? undefined;
    console.log("loading video", videoId);

    await waitForElement("#above-the-fold");

    const playerContainer = document.querySelector("#above-the-fold");
    if (!playerContainer || !playerContainer.parentNode) {
        console.log("Player container not found");
        return;
    }

    const root = initializeRootContainer();
    playerContainer.parentNode.insertBefore(root, playerContainer.nextSibling);

    render(<ControlPanel videoId={videoId} />, root);
};

window.addEventListener("load", init);

document.addEventListener("keydown", (event) => {
    console.log(`keydown: ${event.key}`);
    const video = document.querySelector("video");
    if (!video) {
        console.log("Video not found.");
        return;
    }

    const mark = marks[event.key];

    if (!mark) {
        console.log(`no event found for ${event.key}`);
        return;
    }

    jumpToTime(mark.time);
});

const jumpToTime = (time: number) => {
    const video = getVideoPlayer();
    if (!video) {
        return;
    }
    console.log(`jumping to time ${time}`);
    video.currentTime = time;
};
