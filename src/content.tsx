import { extractVideoInfo } from "./utils/extractVideoInfo";
import { groupRiffsByHotkey } from "./utils/groupRiffsByHotkey";
import { h, render } from "preact";
import { jumpToTime } from "./utils/videoPlayer";
import { setup } from "goober";
import { waitForElement } from "./utils/waitForElement";
import { ChromeStorageRiffsRepository } from "./riffsRepository/chromeStorageRiffsRepository";
import { ControlPanel } from "./components/ControlPanel";
import { Riff, SavedRiff, Video } from "./types";
import { RiffsRepositroy } from "./riffsRepository/riffsRepository";

setup(h);

const ROOT_ID = "yt-practice-root";
const ABOVE_THE_FOLD_SELECTOR = "#above-the-fold";

const riffsRepository: RiffsRepositroy = new ChromeStorageRiffsRepository();

let riffs: Record<string, SavedRiff> = {};

let rootContainer: HTMLDivElement | null = null;

const loadRiffs = async (videoId: string) => {
    try {
        const loadedRiffs = await riffsRepository.getRiffs(videoId);
        riffs = groupRiffsByHotkey(loadedRiffs);
    } catch (error) {
        console.error("Error loading riffs:", error);
    }
};

const handleSubmitRiff = async (riff: Riff | SavedRiff, videoId: string) => {
    const video = await riffsRepository.getVideo(videoId);
    if (!video) {
        const videoInfo = extractVideoInfo(videoId);
        await riffsRepository.addVideo({ ...videoInfo, riffs: [] });
    }
    const updatedRiffs = await riffsRepository.upsertRiff(videoId, riff);
    riffs = groupRiffsByHotkey(updatedRiffs);
    renderControlPanel(videoId);
};

const handleDeleteRiff = async (riff: SavedRiff, videoId: string) => {
    const updatedRiffs = await riffsRepository.deleteRiff(videoId, riff);
    riffs = groupRiffsByHotkey(updatedRiffs);
    renderControlPanel(videoId);
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
            riffs={riffs}
            onDeleteRiff={handleDeleteRiff}
            onDialogClose={onDialogClose}
            onDialogOpen={onDialogOpen}
            onSubmitRiff={handleSubmitRiff}
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
        await loadRiffs(videoId);
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

let keydownEnabled = true;

const onDialogClose = () => {
    keydownEnabled = true;
};

const onDialogOpen = () => {
    keydownEnabled = false;
};

document.addEventListener("keydown", (event) => {
    if (!keydownEnabled) {
        return;
    }
    const riff = riffs[event.key];

    if (!riff) {
        return;
    }

    jumpToTime(riff.time);
});
