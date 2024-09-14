const settings = {
  design: 'system',
  setupDone: false,
  setupPart: 0,
  onStartup: {
    openLast: null,
    openEmpty: true,
  },
  isMainBrowser: false,
  downloads: {
    downloadPath: null,
    downloadPathDefault: null,
    askWhereToSave: false,
  },
  privacy: {
    blockThirdPartyCookies: true,
    doNotTrack: true,
    clearCookiesOnExit: false,
  },
  security: {
    savePasswords: true,
    enableExtensions: true,
    manageCertificates: true,
  },
  appearance: {
    theme: 'light',
    fontSize: 16,
    toolbarLayout: 'default',
  },
  performance: {
    hardwareAcceleration: true,
    preloadPages: false,
    manageMemoryUsage: true,
  },
  notifications: {
    enableNotifications: true,
    blockPopups: true,
  },
  languageAndRegion: {
    defaultLanguage: 'en',
    region: null,
  },
  accessibility: {
    enableScreenReader: false,
    textToSpeech: true,
  },
};

export default settings;
