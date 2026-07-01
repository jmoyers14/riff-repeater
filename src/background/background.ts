import {
    ANALYTICS_ENABLED,
    POSTHOG_API_KEY,
    POSTHOG_CAPTURE_ENDPOINT,
} from "../constants/analytics";
import { AnalyticsCaptureMessage } from "../analytics/analytics";
import { AnalyticsEvent } from "../analytics/events";
import { ChromeStorageSettingsRepository } from "../settingsRepository/chromeStorageSettingsRepository";
import { SettingsRepository } from "../settingsRepository/settingsRepository";

const DISTINCT_ID_KEY = "analytics:distinctId";

const settingsRepository: SettingsRepository =
    new ChromeStorageSettingsRepository();

// A stable, anonymous identifier for this install. Generated once and persisted
// in local storage — never tied to any personal information.
const getDistinctId = async (): Promise<string> => {
    const stored = await chrome.storage.local.get(DISTINCT_ID_KEY);
    const existing = stored[DISTINCT_ID_KEY];
    if (typeof existing === "string" && existing.length > 0) {
        return existing;
    }

    const id = crypto.randomUUID();
    await chrome.storage.local.set({ [DISTINCT_ID_KEY]: id });
    return id;
};

const sendEvent = async (
    event: AnalyticsEvent,
    properties: Record<string, unknown> = {}
): Promise<void> => {
    if (!ANALYTICS_ENABLED || POSTHOG_API_KEY.startsWith("<")) {
        return;
    }

    if (await settingsRepository.getAnalyticsOptedOut()) {
        return;
    }

    try {
        const distinctId = await getDistinctId();

        const payload = {
            api_key: POSTHOG_API_KEY,
            event,
            distinct_id: distinctId,
            properties: {
                ...properties,
                extension_version: chrome.runtime.getManifest().version,
                $lib: "riff-repeater",
            },
            timestamp: new Date().toISOString(),
        };

        const response = await fetch(POSTHOG_CAPTURE_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
        });

        if (!response.ok) {
            console.error(
                `Analytics send failed: ${event} → HTTP ${response.status}`
            );
        }
    } catch (error) {
        console.error(`Analytics send failed: ${event} →`, error);
    }
};

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        void sendEvent("extension_installed");
    } else if (details.reason === "update") {
        void sendEvent("extension_updated", {
            previous_version: details.previousVersion,
        });
    }
});

chrome.runtime.onMessage.addListener((message: AnalyticsCaptureMessage) => {
    if (message?.type !== "analytics:capture") {
        return false;
    }

    // Fire-and-forget: we don't hold the message channel open for a response.
    // The fetch uses keepalive so it can complete even if the worker suspends.
    void sendEvent(message.event, message.properties);
    return false;
});
