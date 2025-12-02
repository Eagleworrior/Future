// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  CLIENT_ID: "ca-pub-3715923077671486", // Your Google Publisher ID
  ENABLED: true,
};

// Google AdMob Configuration
export const ADMOB_CONFIG = {
  APP_ID: "ca-app-pub-3715923077671486~5555555555", // Add your AdMob App ID
  BANNER_UNIT_ID: "ca-app-pub-3940256099942544/6300978111", // Test banner ad unit
  INTERSTITIAL_UNIT_ID: "ca-app-pub-3940256099942544/1033173712", // Test interstitial ad unit
  ENABLED: true,
};

// Ad Preferences (stored in localStorage)
export type AdPreference = "adsense" | "admob" | "none";

export const getAdPreference = (): AdPreference => {
  const saved = localStorage.getItem("adPreference");
  return (saved as AdPreference) || "adsense";
};

export const setAdPreference = (preference: AdPreference) => {
  localStorage.setItem("adPreference", preference);
};

export const shouldShowAds = (): boolean => {
  const preference = getAdPreference();
  return preference !== "none";
};

export const shouldShowAdSense = (): boolean => {
  const preference = getAdPreference();
  return preference === "adsense" && ADSENSE_CONFIG.ENABLED;
};

export const shouldShowAdMob = (): boolean => {
  const preference = getAdPreference();
  return preference === "admob" && ADMOB_CONFIG.ENABLED;
};
