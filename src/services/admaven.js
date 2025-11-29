/**
 * Configuration et gestion des publicités AdMaven
 */

export const ADMAVEN_CONFIG = {
  // ⚠️ REMPLACEZ ces IDs par vos vrais IDs AdMaven
  bannerAdUnitId: "YOUR_BANNER_AD_UNIT_ID",
  popunderAdUnitId: "YOUR_POPUNDER_AD_UNIT_ID",
  videoAdUnitId: "YOUR_VIDEO_AD_UNIT_ID",

  // Fréquence d'affichage
  bannerRefreshInterval: 60000, // 60 secondes
  popunderFrequency: 3, // Afficher après 3 actions
  videoPrerollFrequency: 2, // Afficher après 2 streams
};

/**
 * Charger un script AdMaven
 */
export const loadAdMavenAd = (adUnitId, containerId) => {
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
      console.log(`✅ AdMaven ${adUnitId} chargé`);
      resolve();
    };

    script.onerror = () => {
      console.error(`❌ Erreur chargement AdMaven ${adUnitId}`);
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

  console.log(`📊 ${adType} affiché ${count + 1} fois`);
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
  console.log("🔄 Stats publicitaires réinitialisées");
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
