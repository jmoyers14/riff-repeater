import { extractVideoInfo } from "./utils/extractVideoInfo";
import { getCurrentTime } from "./utils/videoPlayer";
import { groupRiffsByHotkey } from "./utils/groupRiffsByHotkey";
import { h, render } from "preact";
import { jumpToTime } from "./utils/videoPlayer";
import { setup } from "goober";
import { suggestAvailableKey } from "./utils/suggestAvailablekey";
import { waitForElement } from "./utils/waitForElement";
import { ChromeStorageRiffsRepository } from "./riffsRepository/chromeStorageRiffsRepository";
import { ChromeStorageSettingsRepository } from "./settingsRepository/chromeStorageSettingsRepository";
import { ControlPanel } from "./components/ControlPanel";
import { Riff, SavedRiff } from "./types";
import { RiffsRepositroy } from "./riffsRepository/riffsRepository";
import { QUICK_ADD_RIFF } from "./constants/hotkeys";
import { SettingsRepository } from "./settingsRepository/settingsRepository";

setup(h);

const ROOT_ID = "riff-repeater-practice-root";
const ABOVE_THE_FOLD_SELECTOR = "#above-the-fold";

const riffsRepository: RiffsRepositroy = new ChromeStorageRiffsRepository();
const settingsRepository: SettingsRepository =
    new ChromeStorageSettingsRepository();

// Listen for control panel visibility changes from popup
settingsRepository.onControlPanelHiddenChange((hidden) => {
    shouldRenderControlPanel = !hidden;
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v") ?? undefined;
    renderControlPanel(videoId);
});

let riffs: Record<string, SavedRiff> = {};

let rootContainer: HTMLDivElement | null = null;

let shouldRenderControlPanel = true;

const loadRiffs = async (videoId: string) => {
    try {
        const loadedRiffs = await riffsRepository.getRiffs(videoId);
        riffs = groupRiffsByHotkey(loadedRiffs);
    } catch (error) {
        console.error("Error loading riffs:", error);
    }
};

const handleQuickAddRiff = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v") ?? undefined;
    if (!videoId) {
        return;
    }

    let video = await riffsRepository.getVideo(videoId);
    if (!video) {
        const videoInfo = extractVideoInfo(videoId);
        video = await riffsRepository.addVideo({ ...videoInfo, riffs: [] });
    }

    const usedKeys = video.riffs.map((riff) => riff.hotkey);

    const name = `Riff ${video.riffs.length + 1}`;

    const hotkey = suggestAvailableKey(usedKeys);
    if (!hotkey) {
        console.warn("Cannot create riff: All available hotkeys are in use.");
        return;
    }

    const time = getCurrentTime();
    if (!time) {
        console.warn(
            "Cannot create riff: Unable to get current video playback time."
        );
        return;
    }
    const riff: Riff = {
        name,
        time,
        hotkey,
    };
    const updatedRiffs = await riffsRepository.upsertRiff(videoId, riff);
    riffs = groupRiffsByHotkey(updatedRiffs);
    renderControlPanel(videoId);
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

    const controlPanel = shouldRenderControlPanel ? (
        <ControlPanel
            videoId={videoId}
            riffs={riffs}
            onDeleteRiff={handleDeleteRiff}
            onDialogClose={handleDialogClose}
            onDialogOpen={handleDialogOpen}
            onHideControlPanel={handleHideControlPanel}
            onSubmitRiff={handleSubmitRiff}
        />
    ) : null;

    render(controlPanel, rootContainer);
};

const init = async () => {
    console.log("initialize extension");

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v") ?? undefined;
    console.log("loading video", videoId);

    const rootContainerSelector = ABOVE_THE_FOLD_SELECTOR;

    await waitForElement(rootContainerSelector);

    if (videoId) {
        await loadRiffs(videoId);
    }

    const playerContainer = document.querySelector(rootContainerSelector);
    if (!playerContainer || !playerContainer.parentNode) {
        console.log("Player container not found");
        return;
    }

    const controlPanelHidden = await settingsRepository.getControlPanelHidden();
    shouldRenderControlPanel = !controlPanelHidden;

    console.log("should render panel", shouldRenderControlPanel);

    const root = initializeRootContainer();
    playerContainer.insertBefore(root, playerContainer.firstChild);
    renderControlPanel(videoId);
};

window.addEventListener("load", init);

let keydownEnabled = true;

const handleDialogClose = () => {
    keydownEnabled = true;
};

const handleDialogOpen = () => {
    keydownEnabled = false;
};

const handleHideControlPanel = async (videoId: string) => {
    shouldRenderControlPanel = !shouldRenderControlPanel;
    await settingsRepository.setControlPanelHidden(true);
    renderControlPanel(videoId);
};

document.addEventListener("keydown", async (event) => {
    if (!keydownEnabled) {
        return;
    }

    if (event.key === QUICK_ADD_RIFF) {
        await handleQuickAddRiff();
        return;
    }

    const riff = riffs[event.key];

    if (!riff) {
        return;
    }

    jumpToTime(riff.time);
});
