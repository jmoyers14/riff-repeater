const VIDEO_SELECTOR = "video";

const getVideoPlayer = (): HTMLVideoElement | null => {
    const video = document.querySelector(VIDEO_SELECTOR);
    if (!video) {
        console.log("video not found");
    }
    return video;
};

const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const groupByHotkey = (marks: Mark[]): Record<string, Mark> => {
    return marks.reduce(
        (acc, curr) => {
            acc[curr.hotkey] = curr;
            return acc;
        },
        {} as Record<string, Mark>
    );
};

type HTMLContent = string;

type MarkStore = Record<string, Mark[]>;

type Mark = {
    hotkey: string;
    name: string;
    time: number;
};

interface MarksRepositroy {
    addMark(song: string, mark: Mark): Promise<void>;
    deleteMark(song: string, mark: Mark): Promise<void>;
    getMarks(song: string): Promise<Mark[]>;
}

class ChromeStorageMarksRepository implements MarksRepositroy {
    private storageKey(videoId: string): string {
        return `marks_${videoId}`;
    }

    async addMark(videoId: string, mark: Mark): Promise<void> {
        const marks = await this.getMarks(videoId);
        marks.push(mark);
        await chrome.storage.local.set({ [this.storageKey(videoId)]: marks });
    }

    async deleteMark(videoId: string, mark: Mark): Promise<void> {
        const marks = await this.getMarks(videoId);
        const filtered = marks.filter((m) => m.hotkey !== mark.hotkey);
        await chrome.storage.local.set({
            [this.storageKey(videoId)]: filtered,
        });
    }

    async getMarks(videoId: string): Promise<Mark[]> {
        const key = this.storageKey(videoId);
        const result = await chrome.storage.local.get(key);
        return result[key] ?? [];
    }
}
let marks: Record<string, Mark> = {};
const marksRepository: MarksRepositroy = new ChromeStorageMarksRepository();

let controlPanel: HTMLDivElement | null = null;

const onLoad = async () => {
    console.log("initialize extension");
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v");
    console.log("loading video", videoId);

    if (!videoId) {
        return;
    }
    const currentMarks = await marksRepository.getMarks(videoId);
    console.log("current marks", currentMarks);
    marks = groupByHotkey(currentMarks);

    console.log("grouped marks", marks);

    waitForElement("#above-the-fold").then(() => {
        createControlPanel();
        setupKeyboardListeners();
    });
};

window.addEventListener("load", onLoad);

const addMark = () => {
    const video = getVideoPlayer();
    if (!video) {
        return;
    }

    const currentTime = Math.floor(video.currentTime);

    // Create modal dialog
    const dialog = document.createElement("div");
    dialog.className = "bookmark-dialog";
    dialog.innerHTML = `
        <div class="bookmark-dialog-content">
            <h3>Add New Bookmark</h3>
            <form id="bookmark-form">
                <div class="form-group">
                    <label for="bookmark-name">Name:</label>
                    <input type="text" id="bookmark-name" required>
                </div>
                <div class="form-group">
                    <label for="bookmark-hotkey">Hotkey (single character):</label>
                    <input type="text" id="bookmark-hotkey" maxlength="1" required>
                </div>
                <div class="form-group">
                    <label for="bookmark-time">Time (seconds):</label>
                    <input type="number" id="bookmark-time" value="${currentTime}" required>
                </div>
                <div class="dialog-buttons">
                    <button type="submit">Save</button>
                    <button type="button" id="cancel-bookmark">Cancel</button>
                </div>
            </form>
        </div>
        <style>
            .bookmark-dialog {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .bookmark-dialog-content {
                background: #2f2f2f;
                padding: 20px;
                border-radius: 8px;
                min-width: 300px;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
                color: white;
            }
            .form-group input {
                width: 100%;
                padding: 8px;
                border: 1px solid #444;
                border-radius: 4px;
                background: #1f1f1f;
                color: white;
            }
            .dialog-buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            .dialog-buttons button {
                padding: 8px 16px;
                border-radius: 4px;
                border: none;
                cursor: pointer;
            }
            .dialog-buttons button[type="submit"] {
                background: #065fd4;
                color: white;
            }
            .dialog-buttons button[type="button"] {
                background: #444;
                color: white;
            }
        </style>
    `;

    document.body.appendChild(dialog);

    const form = dialog.querySelector("#bookmark-form");
    const cancelButton = dialog.querySelector("#cancel-bookmark");

    cancelButton?.addEventListener("click", () => {
        document.body.removeChild(dialog);
    });

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nameInput = document.querySelector(
            "#bookmark-name"
        ) as HTMLInputElement;
        const hotkeyInput = document.querySelector(
            "#bookmark-hotkey"
        ) as HTMLInputElement;
        const timeInput = document.querySelector(
            "#bookmark-time"
        ) as HTMLInputElement;

        const name = nameInput.value;
        const hotkey = hotkeyInput.value;
        const time = parseInt(timeInput.value);

        if (hotkey.length !== 1) {
            alert("Please enter a single character as the hotkey");
            return;
        }

        const mark: Mark = {
            name,
            hotkey,
            time,
        };

        marks[hotkey] = mark;

        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get("v");
        if (videoId) {
            console.log("adding mark to repository");
            await marksRepository.addMark(videoId, mark);
        }

        console.log(
            `Added bookmark "${name}" at ${time} seconds with hotkey: ${hotkey}`
        );

        document.body.removeChild(dialog);
        updateControlPanel();
    });
};

const markItems = (): HTMLContent => {
    const markItems = Object.entries(marks)
        .map(([key, mark]) => {
            const { hotkey, name, time } = mark;
            return `
            <div class="bookmark-item">
                <div class="bookmark-info">
                    <span class="bookmark-hotkey">${name}</span>
                    <span class="bookmark-hotkey"> ${hotkey}</span>
                    <span class="bookmark-time"> ${formatTime(time)}</span>
                </div>
                <button class="delete-bookmark" data-key="${key}">×</button>
            </div>
        `;
        })
        .join("");
    return markItems;
};

const updateControlPanel = () => {
    const container = document.getElementById("bookmarks-container");
    if (!container) {
        console.log("bookmarks container not found");
        return;
    }
    container.innerHTML = markItems();
};

const createControlPanel = () => {
    console.log("create control panel");
    if (controlPanel) {
        console.log("control panel already exists");
        return;
    }

    controlPanel = document.createElement("div");
    controlPanel.className = "yt-practice-control-panel";
    controlPanel.innerHTML = `
      <div class="panel-header">
        <h3>Practice Bookmarks</h3>
        <button id="add-bookmark-btn">Add Bookmark</button>
      </div>
      <div id="bookmarks-container" style="
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      ">${markItems()}</div>
      <style>
        .bookmark-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: #2f2f2f;
          border-radius: 4px;
          color: white;
          position: relative;
          z-index: 1;
          pointer-events: auto;
        }
        .yt-practice-control-panel {
          position: relative;
          z-index: 1;
          pointer-events: auto;
          background: #0f0f0f;
          padding: 16px;
          border-radius: 8px;
          margin: 16px 0;
        }
      </style>
    `;

    const playerContainer = document.querySelector("#above-the-fold");
    if (playerContainer === null) {
        console.log("player container not found");
        return;
    }

    const parentNode = playerContainer.parentNode;
    if (parentNode === null) {
        console.log("parent node node found");
        return;
    }
    try {
        parentNode.insertBefore(controlPanel, playerContainer.nextSibling);
    } catch (error) {
        console.log("Error inserting", error);
    }

    const markButton = document.getElementById("add-bookmark-btn");

    if (!markButton) {
        console.log("mark button not found.");
        return;
    }

    markButton.addEventListener("click", addMark);
};

const setupKeyboardListeners = () => {
    console.log("Setup Keyboard Listeners");
};

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
    const video = getVideoPlayer();
    if (!video) {
        return;
    }
    console.log(`jumping to time ${time}`);
    video.currentTime = time;
};
