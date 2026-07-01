// The full set of events we capture. Keeping this list small and explicit
// makes the data easy to reason about and avoids accidental PII collection.
export type AnalyticsEvent =
    | "extension_loaded"
    | "extension_installed"
    | "extension_updated"
    | "popup_opened"
    | "riff_created"
    | "riff_played";
