import IStoreTabsObject from './tabs';

interface IStoreSettingsObject {
  design: 'light' | 'dark' | 'system';
  setupDone: boolean;
  setupPart: number;
  onStartup: {
    openLast: boolean;
    lastTabs: IStoreTabsObject[];
    openEmpty: boolean;
  };
  isMainBrowser: boolean;
  downloads: {
    downloadPath: string;
    downloadPathDefault: string;
    askWhereToSave: boolean;
  };
  privacy: {
    blockThirdPartyCookies: boolean;
    doNotTrack: boolean;
    clearCookiesOnExit: boolean;
  };
  security: {
    savePasswords: boolean;
    enableExtensions: boolean;
    manageCertificates: boolean;
  };
  appearance: {
    theme: string;
    fontSize: number;
    toolbarLayout: 'default' | 'compact';
  };
  performance: {
    hardwareAcceleration: boolean;
    preloadPages: boolean;
    manageMemoryUsage: boolean;
  };
  notifications: {
    enableNotifications: boolean;
    blockPopups: boolean;
  };
  languageAndRegion: {
    defaultLanguage: string;
    region: string;
  };
  accessibility: {
    enableScreenReader: boolean;
    textToSpeech: boolean;
  };
}

export default IStoreSettingsObject;
