import { ANALYTICS_ENABLED } from "../constants/analytics";
import { AnalyticsEvent } from "./events";

export interface AnalyticsCaptureMessage {
    type: "analytics:capture";
    event: AnalyticsEvent;
    properties?: Record<string, unknown>;
}

// Fire-and-forget event capture used by the content script and popup.
//
// Events are routed to the background service worker (rather than POSTed from
// here) for two reasons:
//   1. The content script runs in YouTube's page context, whose strict CSP
//      would block a direct network request to PostHog.
//   2. The service worker is the single place that owns the anonymous
//      distinct_id, so callers never have to think about identity.
//
// Analytics must never break the app, so every failure path is swallowed.
export const capture = (
    event: AnalyticsEvent,
    properties?: Record<string, unknown>
): void => {
    if (!ANALYTICS_ENABLED) {
        return;
    }

    const message: AnalyticsCaptureMessage = {
        type: "analytics:capture",
        event,
        properties,
    };

    try {
        // The service worker may be asleep or the runtime tearing down; ignore
        // any rejection ("Could not establish connection", etc.).
        void chrome.runtime.sendMessage(message).catch(() => {});
    } catch {
        // chrome.runtime can be unavailable during page teardown.
    }
};
