// popup.tsx
import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { css } from "goober";
import { colors, fontFamilies } from "../theme";

interface VideoItem {
    id: string;
    title: string;
    thumbnail: string;
    timestamp: number;
    url: string;
}

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

export const testVideos = [
    {
        id: "dQw4w9WgXcQ",
        title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
        timestamp: 1619712450000, // April 29, 2021
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        hotkeys: {
            "1": { timestamp: 43, label: "Chorus start" },
            "2": { timestamp: 73, label: "Second verse" },
            "3": { timestamp: 118, label: "Bridge" },
        },
    },
    {
        id: "9bZkp7q19f0",
        title: "PSY - GANGNAM STYLE(강남스타일) M/V",
        thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg",
        timestamp: 1628611250000, // August 10, 2021
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
        hotkeys: {
            q: { timestamp: 71, label: "Main dance" },
            w: { timestamp: 95, label: "Elevator scene" },
        },
    },
    {
        id: "JGwWNGJdvx8",
        title: "Ed Sheeran - Shape of You (Official Music Video)",
        thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg",
        timestamp: 1645785650000, // February 25, 2022
        url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
        hotkeys: {
            a: { timestamp: 37, label: "First chorus" },
            s: { timestamp: 98, label: "Boxing scene" },
            d: { timestamp: 156, label: "End sequence" },
        },
    },
    {
        id: "kJQP7kiw5Fk",
        title: "Luis Fonsi - Despacito ft. Daddy Yankee",
        thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
        timestamp: 1655123250000, // June 13, 2022
        url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
        hotkeys: {
            z: { timestamp: 52, label: "First chorus" },
            x: { timestamp: 111, label: "Beach scene" },
            c: { timestamp: 170, label: "Bridge" },
        },
    },
    {
        id: "RgKAFK5djSk",
        title: "Wiz Khalifa - See You Again ft. Charlie Puth [Official Video]",
        thumbnail: "https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg",
        timestamp: 1672829850000, // January 4, 2023
        url: "https://www.youtube.com/watch?v=RgKAFK5djSk",
        hotkeys: {
            r: { timestamp: 45, label: "Chorus" },
            t: { timestamp: 121, label: "Wiz verse" },
            y: { timestamp: 207, label: "Final scene" },
        },
    },
    {
        id: "QH2-TGUlwu4",
        title: "Nyan Cat [original]",
        thumbnail: "https://i.ytimg.com/vi/QH2-TGUlwu4/mqdefault.jpg",
        timestamp: 1678433850000, // March 10, 2023
        url: "https://www.youtube.com/watch?v=QH2-TGUlwu4",
        hotkeys: {
            "1": { timestamp: 10, label: "Rainbow part" },
            "2": { timestamp: 30, label: "Still going" },
            "3": { timestamp: 60, label: "One minute in" },
        },
    },
    {
        id: "fJ9rUzIMcZQ",
        title: "Queen - Bohemian Rhapsody (Official Video)",
        thumbnail: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg",
        timestamp: 1683618450000, // May 9, 2023
        url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
        hotkeys: {
            b: { timestamp: 48, label: "Mama, just killed a man" },
            n: { timestamp: 178, label: "Rock section" },
            m: { timestamp: 295, label: "Outro" },
        },
    },
    {
        id: "KQ6zr6kCPj8",
        title: "LMFAO - Party Rock Anthem ft. Lauren Bennett, GoonRock",
        thumbnail: "https://i.ytimg.com/vi/KQ6zr6kCPj8/mqdefault.jpg",
        timestamp: 1688996450000, // July 10, 2023
        url: "https://www.youtube.com/watch?v=KQ6zr6kCPj8",
        hotkeys: {
            f: { timestamp: 51, label: "Every day I'm shuffling" },
            g: { timestamp: 95, label: "Shuffle dance" },
            h: { timestamp: 227, label: "Final dance sequence" },
        },
    },
];

const Popup = ({}: PopupProps) => {
    const [savedVideos, setSavedVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSavedVideos = async () => {
            try {
                setLoading(true);
                //const result = await chrome.storage.sync.get("savedVideos");
                //const videos = result.savedVideos || [];
                const videos = testVideos;
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
                <h1 className={$headerTitle}>Riff Repeater</h1>
                <p className={$subtitle}>Your saved YouTube practice videos</p>
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
                                        {new Date(
                                            video.timestamp
                                        ).toLocaleDateString()}
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
