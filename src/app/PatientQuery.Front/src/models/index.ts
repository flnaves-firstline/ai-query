export interface AppSettings {
  appVersion: string;
}

declare global {
  interface Window {
    appSettings: AppSettings;
  }
}
