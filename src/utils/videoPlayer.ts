const VIDEO_SELECTOR = "video";

export const getVideoPlayer = (): HTMLVideoElement | null => {
    const video = document.querySelector(VIDEO_SELECTOR);
    if (!video) {
        console.log("video not found");
    }
    return video;
};

export const jumpToTime = (time: number) => {
    const video = getVideoPlayer();
    if (!video) {
        return;
    }
    console.log(`jumping to time ${time}`);
    video.currentTime = time;
};

export const getCurrentTime = (): number | null => {
    console.log("Get Current Time");
    const video = getVideoPlayer();
    if (!video) {
        return null;
    }
    return video.currentTime;
};
