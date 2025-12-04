/**
 * Configuration centralisée des publicités (Google Ads)
 */

export const ADS_CONFIG = {
  // ========================================
  // GOOGLE ADS CONFIGURATION
  // ========================================
  google: {
    enabled: true,
    clientId:
      import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX", // Remplacez par votre ID client
    slots: {
      banner: import.meta.env.VITE_GOOGLE_ADS_SLOT_BANNER || "XXXXXXXXXX",
      sidebar: import.meta.env.VITE_GOOGLE_ADS_SLOT_SIDEBAR || "XXXXXXXXXX",
    },
    testMode: import.meta.env.VITE_MODE, // Mode test en développement
  },
};

export const logConfig = () => {
  console.log("📊 Ads Config:", ADS_CONFIG);
};
