export interface SettingsRepository {
    setControlPanelHidden(hidden: boolean): Promise<void>;
    getControlPanelHidden(): Promise<boolean>;
    onControlPanelHiddenChange(callback: (hidden: boolean) => void): void;
}
