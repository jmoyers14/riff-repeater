import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { css } from "goober";
import { colors, fontFamilies } from "../theme";
import { ChromeStorageRiffsRepository } from "../riffsRepository/chromeStorageRiffsRepository";
import { RiffsRepositroy } from "../riffsRepository/riffsRepository";
import { SavedVideo } from "../types";
import { ChromeStorageSettingsRepository } from "../settingsRepository/chromeStorageSettingsRepository";
import { SettingsRepository } from "../settingsRepository/settingsRepository";
import { IconButton } from "../components/IconButton";
import "../assets/eye.svg";

const $popup = css({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: "400px",
    width: "340px",
    backgroundColor: colors.base,
    color: colors.text,
    fontFamily: fontFamilies.sans,
});

const $header = css({
    padding: "16px",
    backgroundColor: colors.sapphire,
    color: "white",
    borderBottom: `1px solid ${colors.overlay2}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

const $headerContent = css({
    display: "flex",
    flexDirection: "column",
});

const $headerTitle = css({
    fontSize: "18px",
    marginBottom: "4px",
    fontWeight: "bold",
    margin: 0,
    fontFamily: fontFamilies.sans,
});

const $subtitle = css({
    fontSize: "12px",
    opacity: 0.9,
    margin: 0,
});

const $content = css({
    flex: 1,
    overflowY: "auto",
    padding: "8px",
});

const $videoList = css({
    display: "flex",
    flexDirection: "column",
    gap: "12px",
});

const $videoItem = css({
    display: "flex",
    padding: "8px",
    borderRadius: "8px",
    backgroundColor: colors.mantle,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    },
});

const $thumbnail = css({
    width: "96px",
    height: "54px",
    borderRadius: "4px",
    overflow: "hidden",
    flexShrink: 0,
});

const $thumbnailImg = css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
});

const $videoDetails = css({
    marginLeft: "12px",
    flex: 1,
    overflow: "hidden",
});

const $videoTitle = css({
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: colors.text,
});

const $videoMeta = css({
    fontSize: "12px",
    color: colors.subtext0,
});

const $loading = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    textAlign: "center",
    height: "300px",
    color: colors.text,
});

const $error = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    textAlign: "center",
    height: "300px",
    color: colors.red,
});

const $emptyState = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    textAlign: "center",
    height: "300px",
    color: colors.text,
});

const $hint = css({
    marginTop: "12px",
    fontSize: "12px",
    color: colors.subtext0,
    maxWidth: "240px",
});

const $footer = css({
    padding: "12px 16px",
    borderTop: `1px solid ${colors.overlay0}`,
    textAlign: "center",
    fontSize: "12px",
});

const $footerLink = css({
    color: colors.subtext0,
    textDecoration: "none",
    "&:hover": {
        textDecoration: "underline",
    },
});

interface PopupProps {}

const riffsRepository: RiffsRepositroy = new ChromeStorageRiffsRepository();
const settingsRepository: SettingsRepository =
    new ChromeStorageSettingsRepository();

const eyeSvg = chrome.runtime.getURL("assets/eye.svg");

const Popup = ({}: PopupProps) => {
    const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSavedVideos = async () => {
            try {
                setLoading(true);
                const videos = await riffsRepository.getVideos();
                setSavedVideos(videos);
            } catch (err) {
                console.error("Failed to load saved videos:", err);
                setError("Failed to load your saved videos. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadSavedVideos();
    }, []);

    const openVideo = (url: string) => {
        // Open the video URL in a new tab
        chrome.tabs.create({ url });
    };

    return (
        <div className={$popup}>
            <header className={$header}>
                <div className={$headerContent}>
                    <h1 className={$headerTitle}>Riff Repeater</h1>
                    <p className={$subtitle}>
                        Your saved YouTube practice videos
                    </p>
                </div>
                <IconButton
                    src={eyeSvg}
                    alt="Show UI"
                    tooltip="Show Riff Repeater on current tab"
                    onClick={() =>
                        settingsRepository.setControlPanelHidden(false)
                    }
                    filter="invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"
                    hoverFilter="invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(100%)"
                />
            </header>

            <div className={$content}>
                {loading ? (
                    <div className={$loading}>Loading your videos...</div>
                ) : error ? (
                    <div className={$error}>{error}</div>
                ) : savedVideos.length === 0 ? (
                    <div className={$emptyState}>
                        <p>You haven't saved any videos yet.</p>
                        <p className={$hint}>
                            Go to any YouTube video and use the extension to add
                            hotkeys and save videos.
                        </p>
                    </div>
                ) : (
                    <div className={$videoList}>
                        {savedVideos.map((video) => (
                            <div
                                key={video.id}
                                className={$videoItem}
                                onClick={() => openVideo(video.url)}
                            >
                                <div className={$thumbnail}>
                                    <img
                                        className={$thumbnailImg}
                                        src={video.thumbnail}
                                        alt={video.title}
                                    />
                                </div>
                                <div className={$videoDetails}>
                                    <h3 className={$videoTitle}>
                                        {video.title}
                                    </h3>
                                    <div className={$videoMeta}>
                                        {/*new Date(
                                            video.timestamp
                                        ).toLocaleDateString()*/}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className={$footer}>
                <a
                    className={$footerLink}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        chrome.tabs.create({ url: "options.html" });
                    }}
                >
                    Settings
                </a>
            </footer>
        </div>
    );
};

// Render the Popup component into the DOM
render(<Popup />, document.getElementById("popup")!);
