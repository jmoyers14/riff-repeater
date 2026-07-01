# Privacy Policy for Riff Repeater

**Last updated: July 1, 2026**

Riff Repeater ("the extension") is a browser extension that lets you create
hotkeys for YouTube video timestamps so you can easily repeat sections of a
video for practice. This policy explains what data the extension handles, what
is collected, and the choices you have.

## Summary

- We do **not** collect any personally identifiable information.
- We do **not** require an account, and we never ask for your name, email, or
  any login credentials.
- Your saved riffs stay **on your own device**.
- We collect **anonymous usage analytics** to understand how the extension is
  used. You can turn this off at any time.

## Data stored on your device (not collected by us)

The following is stored locally in your browser (`chrome.storage.local`) and is
**never transmitted to us**:

- The videos you save riffs to (video title, URL, thumbnail).
- Your riffs (name, timestamp, and assigned hotkey).
- Your extension settings (such as whether the control panel is hidden and your
  analytics opt-out preference).

This data remains on your device and is removed if you uninstall the extension.

## Anonymous usage analytics we collect

To understand how many people use the extension and which features are useful,
we collect a small set of anonymous product events through
[PostHog](https://posthog.com), a third-party analytics provider. These events
are tied only to a randomly generated, anonymous identifier that is **not**
linked to your identity.

The events we collect are:

| Event | When it fires | Additional data |
| --- | --- | --- |
| `extension_installed` / `extension_updated` | On install or update | Extension version |
| `extension_loaded` | When a YouTube page loads with the extension active | Whether the page is a video page |
| `popup_opened` | When you open the extension popup | — |
| `riff_created` | When you save a new riff | The YouTube **video ID and title** of the video, and how the riff was created |
| `riff_played` | When you trigger a riff hotkey | — |

Every event also includes the extension version and the anonymous identifier
described above.

### The video information we collect

When you **create a riff**, we record the YouTube video ID and video title of
that video so we can understand what kinds of content people practice with. We
do **not** collect your general YouTube browsing history, watch history, search
history, or any videos you did not save a riff to.

## What we do NOT collect

- No names, email addresses, or contact information.
- No passwords or authentication data.
- No payment or financial information.
- No general web browsing history.
- No keystrokes or page content beyond the specific events listed above.

## How the data is used

Analytics data is used solely to:

- Understand how many people actively use the extension.
- See which features are used and which videos are practiced with.
- Guide improvements to the extension.

We do **not** sell your data, share it with advertisers, or use it for any
purpose unrelated to improving Riff Repeater.

## Third-party processing

Anonymous analytics events are processed by **PostHog** and stored on
PostHog's United States infrastructure. Their handling of data is governed by
[PostHog's privacy policy](https://posthog.com/privacy).

## Your choices — opting out

You can disable analytics at any time:

1. Click the Riff Repeater icon in your browser toolbar to open the popup.
2. Uncheck **"Share anonymous usage data."**

Once disabled, the extension stops sending all analytics events. You can
re-enable it from the same toggle.

## Data retention

Anonymous analytics events are retained only as long as needed to understand
usage trends and are subject to PostHog's data retention practices. Because the
data is anonymous, we cannot identify or retrieve events associated with a
specific person.

## Children's privacy

Riff Repeater is not directed at children under 13 and does not knowingly
collect personal information from anyone, including children.

## Changes to this policy

If this policy changes, we will update this document and revise the "Last
updated" date above. Material changes will be reflected in the extension's
store listing.

## Contact

If you have questions about this policy, contact:

**jeremy@jeremymoyers.com**
