/**
 * Configuration centralisée des publicités
 * IMPORTANT : Remplacez les valeurs par vos vrais IDs
 */

export const ADS_CONFIG = {
  // ========================================
  // ADMAVEN CONFIGURATION
  // ========================================
  admaven: {
    // ⚠️ STATUT: Remplacez quand AdMaven approuve votre demande
    enabled: false, // Mettre à true une fois approuvé

    // IDs des unités publicitaires AdMaven
    // Récupérez-les depuis : https://publishers.admaven.com/
    bannerAdUnitId: "YOUR_ADMAVEN_BANNER_ID",
    videoAdUnitId: "YOUR_ADMAVEN_VIDEO_ID",
    interstitialAdUnitId: "YOUR_ADMAVEN_INTERSTITIAL_ID",
    popunderAdUnitId: "YOUR_ADMAVEN_POPUNDER_ID",

    // Fréquences d'affichage
    bannerRefreshInterval: 60000, // 60 secondes
    videoPrerollFrequency: 2, // Tous les 2 streams
    interstitialFrequency: 5, // Tous les 5 changements de page
  },

  // ========================================
  // A-ADS CONFIGURATION
  // ========================================
  aads: {
    // ⚠️ STATUT: Activé par défaut (pas d'approbation requise)
    enabled: true, // A-Ads fonctionne immédiatement

    // IDs des unités publicitaires A-Ads
    // Créez un compte : https://a-ads.com → Create Ad Unit
    bannerAdUnitId: "1234567", // ⬅️ REMPLACEZ par votre ID (7 chiffres)

    // Tailles disponibles
    sizes: {
      leaderboard: "728x90",
      banner: "468x60",
      square: "300x250",
      mobile: "320x50",
      rectangle: "300x100",
      wideSkyscraper: "160x600",
    },

    // Options
    refreshInterval: 60000,
    fallbackEnabled: true,
  },

  // ========================================
  // FALLBACK CONFIGURATION
  // ========================================
  fallback: {
    enabled: true,
    variations: [
      {
        id: "premium",
        emoji: "💎",
        title: "Passez Premium",
        subtitle: "Profitez sans publicité pour 2€/mois",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        buttonText: "Découvrir",
        action: "openPremiumModal",
      },
      {
        id: "crypto",
        emoji: "🪙",
        title: "Soutenez-nous en crypto",
        subtitle: "Bitcoin, Ethereum et autres acceptés",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        buttonText: "Contribuer",
        action: "openCryptoDonation",
      },
      {
        id: "share",
        emoji: "⭐",
        title: "Partagez avec vos amis",
        subtitle: "Aidez-nous à grandir",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        buttonText: "Partager",
        action: "share",
      },
      {
        id: "advertise",
        emoji: "🎯",
        title: "Annoncez ici",
        subtitle: "Milliers d'utilisateurs quotidiens",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        buttonText: "Contact",
        action: "contact",
      },
    ],
  },

  // ========================================
  // STRATÉGIE DE CHARGEMENT
  // ========================================
  strategy: {
    // Ordre de priorité des réseaux
    priority: ["admaven", "aads", "fallback"],

    // Timeout par réseau (ms)
    timeout: 5000,

    // Retry automatique
    autoRetry: false,
    maxRetries: 0,
  },
};

/**
 * Obtenir la configuration d'un réseau spécifique
 * @param {string} network - 'admaven' | 'aads' | 'fallback'
 * @returns {Object}
 */
export const getNetworkConfig = (network) => {
  return ADS_CONFIG[network] || null;
};

/**
 * Vérifier si un réseau est activé
 * @param {string} network - 'admaven' | 'aads' | 'fallback'
 * @returns {boolean}
 */
export const isNetworkEnabled = (network) => {
  const config = getNetworkConfig(network);
  return config ? config.enabled : false;
};

/**
 * Obtenir l'ordre de priorité des réseaux activés
 * @returns {Array<string>}
 */
export const getEnabledNetworks = () => {
  return ADS_CONFIG.strategy.priority.filter((network) =>
    isNetworkEnabled(network)
  );
};

/**
 * Valider la configuration
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validateConfig = () => {
  const errors = [];

  // Vérifier AdMaven
  if (ADS_CONFIG.admaven.enabled) {
    if (ADS_CONFIG.admaven.bannerAdUnitId === "YOUR_ADMAVEN_BANNER_ID") {
      errors.push("⚠️ AdMaven activé mais bannerAdUnitId non configuré");
    }
  }

  // Vérifier A-Ads
  if (ADS_CONFIG.aads.enabled) {
    if (ADS_CONFIG.aads.bannerAdUnitId === "1234567") {
      errors.push(
        "⚠️ A-Ads activé mais bannerAdUnitId est l'exemple par défaut"
      );
    }
  }

  // Au moins un réseau doit être activé
  const enabledCount = getEnabledNetworks().length;
  if (enabledCount === 0) {
    errors.push("❌ Aucun réseau publicitaire activé");
  }

  return {
    valid: errors.length === 0,
    errors,
    enabledNetworks: getEnabledNetworks(),
    warnings: errors,
  };
};

/**
 * Afficher la configuration dans la console
 */
export const logConfig = () => {
  console.group("📊 Configuration Publicitaire");

  console.log(
    "🎯 AdMaven:",
    ADS_CONFIG.admaven.enabled ? "✅ Activé" : "❌ Désactivé"
  );
  if (ADS_CONFIG.admaven.enabled) {
    console.log("  - Banner ID:", ADS_CONFIG.admaven.bannerAdUnitId);
  }

  console.log(
    "🪙 A-Ads:",
    ADS_CONFIG.aads.enabled ? "✅ Activé" : "❌ Désactivé"
  );
  if (ADS_CONFIG.aads.enabled) {
    console.log("  - Banner ID:", ADS_CONFIG.aads.bannerAdUnitId);
  }

  console.log(
    "💎 Fallback:",
    ADS_CONFIG.fallback.enabled ? "✅ Activé" : "❌ Désactivé"
  );

  console.log("📋 Ordre de priorité:", ADS_CONFIG.strategy.priority);
  console.log("🎲 Réseaux activés:", getEnabledNetworks());

  const validation = validateConfig();
  if (!validation.valid) {
    console.warn("⚠️ Avertissements:", validation.warnings);
  }

  console.groupEnd();
};
