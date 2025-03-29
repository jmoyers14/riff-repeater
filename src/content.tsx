import { groupMarksByHotkey } from "./utils/groupMarksByHotkey";
import { h, render } from "preact";
import { jumpToTime } from "./utils/videoPlayer";
import { waitForElement } from "./utils/waitForElement";
import { ChromeStorageMarksRepository } from "./marksRepository/chromeStorageMarksRepository";
import { ControlPanel } from "./components/ControlPanel";
import { Mark } from "./types";
import { MarksRepositroy } from "./marksRepository/marksRepository";

const ROOT_ID = "yt-practice-root";
const ABOVE_THE_FOLD_SELECTOR = "#above-the-fold";

const marksRepository: MarksRepositroy = new ChromeStorageMarksRepository();

let marks: Record<string, Mark> = {};

let rootContainer: HTMLDivElement | null = null;

const loadMarks = async (videoId: string) => {
    try {
        const loadedMarks = await marksRepository.getMarks(videoId);
        marks = groupMarksByHotkey(loadedMarks);
    } catch (error) {
        console.error("Error loading marks:", error);
    }
};

const handleAddMark = async (mark: Mark, videoId?: string) => {
    marks[mark.hotkey] = mark;
    if (videoId) {
        await marksRepository.addMark(videoId, mark);
    }
    renderControlPanel(videoId);
};

const handleDeleteMark = async (mark: Mark, videoId?: string) => {
    delete marks[mark.hotkey];
    if (videoId) {
        await marksRepository.deleteMark(videoId, mark);
    }
};

const initializeRootContainer = () => {
    if (!rootContainer) {
        rootContainer = document.createElement("div");
        rootContainer.id = ROOT_ID;
    }
    return rootContainer;
};

const renderControlPanel = (videoId: string | undefined) => {
    if (!rootContainer) {
        return;
    }
    render(
        <ControlPanel
            videoId={videoId}
            marks={marks}
            onAddMark={handleAddMark}
            onDeleteMark={handleDeleteMark}
        />,
        rootContainer
    );
};

const init = async () => {
    console.log("initialize extension");

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v") ?? undefined;
    console.log("loading video", videoId);

    await waitForElement(ABOVE_THE_FOLD_SELECTOR);

    if (videoId) {
        await loadMarks(videoId);
    }

    const playerContainer = document.querySelector(ABOVE_THE_FOLD_SELECTOR);
    if (!playerContainer || !playerContainer.parentNode) {
        console.log("Player container not found");
        return;
    }

    const root = initializeRootContainer();
    playerContainer.parentNode.insertBefore(root, playerContainer.nextSibling);
    renderControlPanel(videoId);
};

window.addEventListener("load", init);

document.addEventListener("keydown", (event) => {
    console.log(`keydown: ${event.key}`);
    const mark = marks[event.key];

    if (!mark) {
        console.log(`no event found for ${event.key}`);
        return;
    }

    jumpToTime(mark.time);
});
