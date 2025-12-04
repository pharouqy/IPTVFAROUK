/**
 * Service Google Ads (AdSense)
 * Gère le chargement du script et l'initialisation des publicités
 */

import { ADS_CONFIG } from "../config/ads";

let isScriptLoaded = false;
let isScriptLoading = false;

/**
 * Charge le script Google AdSense de manière asynchrone
 * @returns {Promise<void>}
 */
export const loadGoogleAdsScript = () => {
  return new Promise((resolve, reject) => {
    if (isScriptLoaded) {
      resolve();
      return;
    }

    if (isScriptLoading) {
      // Si le script est déjà en cours de chargement, on attend qu'il soit prêt
      const checkInterval = setInterval(() => {
        if (isScriptLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    isScriptLoading = true;

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.google.clientId}`;
    script.async = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      console.log("✅ Google Ads script loaded");
      resolve();
    };

    script.onerror = (error) => {
      isScriptLoading = false;
      console.error("❌ Failed to load Google Ads script", error);
      reject(error);
    };

    document.head.appendChild(script);
  });
};

/**
 * Initialise une unité publicitaire
 * @param {string} slotId - ID de l'emplacement publicitaire (data-ad-slot)
 * @param {string} format - Format de l'annonce (auto, rectangle, etc.)
 * @param {boolean} fullWidthResponsive - Responsive pleine largeur
 */
export const pushAd = (slotId, format = "auto", fullWidthResponsive = true) => {
  try {
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
    }
    window.adsbygoogle.push({});
  } catch (e) {
    console.error("❌ Error pushing ad to Google Ads", e);
  }
};
