import { testUtil } from "./utils";
console.log("Key logger initialized");

let controlPanel: HTMLDivElement | null = null;

const initializeExtension = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newVideoId = urlParams.get("v");

    testUtil();

    waitForElement("#above-the-fold").then(() => {
        createControlPanel();
        setupKeyboardListeners();
    });
};

window.addEventListener("load", initializeExtension);

const createControlPanel = () => {
    console.log("Create Control Panel 568");

    if (controlPanel) {
        console.log("conrol panel exists");
        return;
    }

    controlPanel = document.createElement("div");
    controlPanel.className = "yt-practice-control-panel";
    controlPanel.innerHTML = `
      <div class="panel-header">
        <h3>Practice Bookmarks</h3>
        <button id="add-bookmark-btn">Add Bookmark</button>
      </div>
      <div id="bookmarks-container"></div>
    `;

    const playerContainer = document.querySelector("#above-the-fold");
    console.log("playerContainer", playerContainer);
    if (playerContainer === null) {
        return;
    }

    const parentNode = playerContainer.parentNode;
    console.log("playerParent", parentNode);
    if (parentNode === null) {
        console.log("parent node node found");
        return;
    }
    console.log("insert before", playerContainer.nextSibling);
    try {
        parentNode.insertBefore(controlPanel, playerContainer.nextSibling);
    } catch (error) {
        console.log("Error inserting", error);
    }

    // Add event listener for the Add Bookmark button
    /*
    document
        .getElementById("add-bookmark-btn")?
        .addEventListener("click", addBookmark);
        */
};

const setupKeyboardListeners = () => {
    console.log("Setup Keyboard Listeners");
};

document.addEventListener("keydown", (event) => {
    const video = document.querySelector("video");
    if (!video) {
        console.log("Video not found.");
        return;
    }

    const time = Math.floor(video.currentTime);

    if (event.key === "g") {
        console.log("got g");
        jumpToTime(60);
    }

    console.log(`${time}`);
    console.log("Another message 12");
    console.log("Key pressed:", event.key);
});

const waitForElement = (selector: string): Promise<Element> => {
    console.log("wait for element", selector);
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }

        const observer = new MutationObserver((_) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
};

const jumpToTime = (time: number) => {
    const video = document.querySelector("video");
    if (!video) {
        console.log("Jump Failed");
        return;
    }
    video.currentTime = 60;
};
