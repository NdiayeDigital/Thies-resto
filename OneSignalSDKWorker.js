if (typeof self !== 'undefined' && self.location && (self.location.hostname === 'thies-resto.com' || self.location.hostname === 'www.thies-resto.com')) {
  try {
    importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
  } catch (e) {
    console.warn("OneSignal Worker script import skipped:", e);
  }
}
