/**
 * Configuration et gestion des publicités AdMaven
 */

export const ADMAVEN_CONFIG = {
  // ⚠️ REMPLACEZ par vos vrais IDs AdMaven une fois approuvé
  bannerAdUnitId:
    import.meta.env.VITE_ADMAVEN_BANNER_ID || "YOUR_ADMAVEN_BANNER_ID", // Ex: 'a1b2c3d4'
  popunderAdUnitId:
    import.meta.env.VITE_ADMAVEN_POPUNDER_ID || "YOUR_ADMAVEN_POPUNDER_ID",
  videoAdUnitId:
    import.meta.env.VITE_ADMAVEN_VIDEO_ID || "YOUR_ADMAVEN_VIDEO_ID",
  interstitialAdUnitId:
    import.meta.env.VITE_ADMAVEN_INTERSTITIAL_ID ||
    "YOUR_ADMAVEN_INTERSTITIAL_ID",

  // Fréquence
  bannerRefreshInterval: 60000,
  popunderFrequency: 5,
  videoPrerollFrequency: 5,
};

/**
 * Charger un script AdMaven
 */
{
  /*export const loadAdMavenAd = (adUnitId, containerId) => {
  return new Promise((resolve, reject) => {
    const container = document.getElementById(containerId);

    if (!container) {
      reject(new Error(`Container ${containerId} not found`));
      return;
    }

    // Nettoyer les anciens scripts
    container.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `//thubanoa.com/${adUnitId}/invoke.js`;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      console.error(`❌ Erreur chargement AdMaven ${adUnitId}`);
      reject(new Error("Failed to load AdMaven script"));
    };

    container.appendChild(script);
  });
};*/
}

/**
 * Charger une publicité AdMaven
 * @param {string} adUnitId - ID AdMaven
 * @param {string} containerId - ID du container
 * @returns {Promise}
 */
export const loadAdMavenAd = (adUnitId, containerId) => {
  return new Promise((resolve, reject) => {

    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`❌ Container ${containerId} introuvable`);
      reject(new Error(`Container ${containerId} not found`));
      return;
    }

    // Nettoyer l'ancien contenu
    container.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `//thubanoa.com/${adUnitId}/invoke.js`;
    script.setAttribute("data-ad-network", "admaven");

    // Timeout de 5 secondes
    const timeout = setTimeout(() => {
      console.warn("⏱️ Timeout AdMaven (5s)");
      reject(new Error("AdMaven load timeout"));
    }, 5000);

    script.onload = () => {
      clearTimeout(timeout);
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeout);
      console.error(`❌ Erreur chargement AdMaven: ${adUnitId}`);
      reject(new Error("Failed to load AdMaven script"));
    };

    container.appendChild(script);
  });
};

/**
 * Vérifier si une pub peut être affichée (respect de la fréquence)
 */
export const canShowAd = (adType) => {
  const lastShown = localStorage.getItem(`admaven_${adType}_last_shown`);

  if (!lastShown) return true;

  const timeSinceLastShown = Date.now() - parseInt(lastShown);
  const minInterval = 30 * 60 * 1000; // 30 minutes minimum

  return timeSinceLastShown >= minInterval;
};

/**
 * Enregistrer qu'une pub a été affichée
 */
export const markAdShown = (adType) => {
  localStorage.setItem(`admaven_${adType}_last_shown`, Date.now().toString());

  // Incrémenter le compteur
  const count = parseInt(
    localStorage.getItem(`admaven_${adType}_count`) || "0"
  );
  localStorage.setItem(`admaven_${adType}_count`, (count + 1).toString());

};

/**
 * Obtenir les statistiques d'affichage
 */
export const getAdStats = () => {
  return {
    banner: {
      count: parseInt(localStorage.getItem("admaven_banner_count") || "0"),
      lastShown: localStorage.getItem("admaven_banner_last_shown"),
    },
    popunder: {
      count: parseInt(localStorage.getItem("admaven_popunder_count") || "0"),
      lastShown: localStorage.getItem("admaven_popunder_last_shown"),
    },
    video: {
      count: parseInt(localStorage.getItem("admaven_video_count") || "0"),
      lastShown: localStorage.getItem("admaven_video_last_shown"),
    },
  };
};

/**
 * Réinitialiser les stats (pour debug)
 */
export const resetAdStats = () => {
  localStorage.removeItem("admaven_banner_count");
  localStorage.removeItem("admaven_banner_last_shown");
  localStorage.removeItem("admaven_popunder_count");
  localStorage.removeItem("admaven_popunder_last_shown");
  localStorage.removeItem("admaven_video_count");
  localStorage.removeItem("admaven_video_last_shown");
};

/**
 * Vérifier si l'utilisateur a un abonnement Premium (sans pub)
 */
export const hasPremiumSubscription = () => {
  const premium = localStorage.getItem("premium_subscription");

  if (!premium) return false;

  try {
    const data = JSON.parse(premium);
    const expiryDate = new Date(data.expiryDate);
    const isActive = expiryDate > new Date();

    if (!isActive) {
      localStorage.removeItem("premium_subscription");
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
