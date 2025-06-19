type Time = {
    hours?: number;
    minutes?: number;
    seconds?: number;
};

const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

const timeToSeconds = (time: Time): number => {
    const { hours = 0, minutes = 0, seconds = 0 } = time;
    return hours * SECONDS_IN_HOUR + minutes * SECONDS_IN_MINUTE + seconds;
};

export const formattedDurationToSeconds = (
    formattedDuration: string
): number | null => {
    const matchSeconds = formattedDuration.match(/^(\d+)$/);
    if (matchSeconds) {
        const [_, seconds] = matchSeconds;
        return timeToSeconds({
            seconds: parseInt(seconds),
        });
    }

    const matchMinutes = formattedDuration.match(/^(\d{1,2}):(\d\d)$/);
    if (matchMinutes) {
        const [_, minutes, seconds] = matchMinutes;
        return timeToSeconds({
            minutes: parseInt(minutes),
            seconds: parseInt(seconds),
        });
    }

    const matchHours = formattedDuration.match(/^(\d+):(\d\d):(\d\d)$/);
    if (matchHours) {
        const [_, hours, minutes, seconds] = matchHours;
        return timeToSeconds({
            hours: parseInt(hours),
            minutes: parseInt(minutes),
            seconds: parseInt(seconds),
        });
    }

    return null;
};
