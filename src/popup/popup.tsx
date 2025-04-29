import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";

interface PopupProps {}

const Popup = ({}: PopupProps) => {
    const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);

    useEffect(() => {
        const getCurrentTab = async () => {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            setCurrentTab(tab);
        };
        getCurrentTab();
    }, []);

    const handleAction = async () => {
        if (currentTab?.id) {
            await chrome.tabs.sendMessage(currentTab.id, {
                action: "changeBackground",
            });
        }
    };

    return (
        <div className="popup">
            <h2>Riff Repeater</h2>
            <button onClick={handleAction}>Change Background</button>
        </div>
    );
};

// Render the Popup component into the DOM
render(<Popup />, document.getElementById("popup")!);
