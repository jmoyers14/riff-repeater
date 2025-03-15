(() => {
    let ws = new WebSocket("ws://127.0.0.1:8420");

    ["open", "message", "error", "close"].forEach((eventName) => {
        ws.addEventListener(eventName, (event) => {
            console.log(`WebSocket event '${eventName}':`, event);
        });
    });

    ws.onopen = () => {
        console.log("Live reload connected! 2");
    };

    ws.onmessage = () => {
        console.log("Change detected, reloading extension...");

        // Get all tabs before reloading
        chrome.tabs.query({}, (tabs) => {
            // Reload the extension
            chrome.runtime.reload();

            // Reload any tabs where our extension is active
            tabs.forEach((tab) => {
                if (tab.url?.startsWith("http")) {
                    if (tab.id) {
                        chrome.tabs.reload(tab.id);
                    }
                }
            });
        });
    };

    ws.onerror = (error) => {
        console.log("Live reload error:", error);
    };

    ws.onclose = () => {
        console.log("Live reload disconnected, attempting to reconnect...");
    };
})();
