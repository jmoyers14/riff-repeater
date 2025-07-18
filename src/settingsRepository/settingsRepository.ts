export interface SettingsRepository {
    setControlPanelHidden(hidden: boolean): Promise<void>;
    getControlPanelHidden(): Promise<boolean>;
}
