import { SettingsRepository } from "./settingsRepository";

type SettingName = "controlPanelHidden";

export class ChromeStorageSettingsRepository implements SettingsRepository {
    private settingKeyPrefix = "settings";
    private settingKey(name: SettingName) {
        return `${this.settingKeyPrefix}:${name}`;
    }

    async setControlPanelHidden(hidden: boolean): Promise<void> {
        const key = this.settingKey("controlPanelHidden");

        await chrome.storage.local.set({
            [key]: hidden,
        });
    }

    async getControlPanelHidden(): Promise<boolean> {
        const key = this.settingKey("controlPanelHidden");
        const result = await chrome.storage.local.get(key);
        console.log("RESULT", result[key]);
        console.log("typeof", result[key]);
        if (result[key] === undefined) {
            return false;
        }
        return result[key] as boolean;
    }
}
