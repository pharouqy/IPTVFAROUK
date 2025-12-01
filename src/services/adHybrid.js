/**
 * Service de gestion hybride des publicités
 * Version 2.0 avec configuration centralisée
 */

import { loadAdMavenAd, ADMAVEN_CONFIG } from "./admaven";
import {
  loadAadsAd,
  createFallbackAd,
  markAadsShown,
  AADS_CONFIG,
} from "./aads";
import { ADS_CONFIG, getEnabledNetworks, validateConfig } from "../config/ads";

export const AD_NETWORKS = {
  ADMAVEN: "admaven",
  AADS: "aads",
  FALLBACK: "fallback",
};

/**
 * Charger une bannière avec système hybride intelligent
 * @param {string} containerId - ID du container DOM
 * @returns {Promise<string>} - Réseau utilisé
 */
export const loadHybridBanner = async (containerId) => {

  // Valider la configuration
  const validation = validateConfig();
  if (!validation.valid) {
    console.warn("⚠️ Configuration:", validation.warnings);
  }

  // Obtenir les réseaux activés
  const enabledNetworks = getEnabledNetworks();

  // Parcourir les réseaux par ordre de priorité
  for (const network of enabledNetworks) {

    try {
      switch (network) {
        case AD_NETWORKS.ADMAVEN:
          await loadAdMavenNetwork(containerId);
          recordAttempt(network, true);
          return network;

        case AD_NETWORKS.AADS:
          await loadAadsNetwork(containerId);
          recordAttempt(network, true);
          return network;

        case AD_NETWORKS.FALLBACK:
          loadFallbackNetwork(containerId);
          recordAttempt(network, true);
          return network;
      }
    } catch (error) {
      console.warn(`⚠️ ${network} échoué:`, error.message);
      recordAttempt(network, false);
      // Continuer avec le réseau suivant
    }
  }

  // Si tout échoue, forcer le fallback
  loadFallbackNetwork(containerId);
  return AD_NETWORKS.FALLBACK;
};

/**
 * Charger AdMaven
 */
const loadAdMavenNetwork = async (containerId) => {
  if (!ADS_CONFIG.admaven.enabled) {
    throw new Error("AdMaven désactivé");
  }

  const adUnitId = ADS_CONFIG.admaven.bannerAdUnitId;

  if (adUnitId === "YOUR_ADMAVEN_BANNER_ID") {
    throw new Error("AdMaven non configuré");
  }

  await loadAdMavenAd(adUnitId, containerId);
};

/**
 * Charger A-Ads
 */
const loadAadsNetwork = async (containerId) => {
  if (!ADS_CONFIG.aads.enabled) {
    throw new Error("A-Ads désactivé");
  }

  const adUnitId = ADS_CONFIG.aads.bannerAdUnitId;

  if (adUnitId === "1234567") {
    console.warn("⚠️ A-Ads utilise l'ID par défaut");
  }

  await loadAadsAd(adUnitId, ADS_CONFIG.aads.sizes.leaderboard, containerId);
  markAadsShown("banner");
};

/**
 * Charger Fallback
 */
const loadFallbackNetwork = (containerId) => {
  if (!ADS_CONFIG.fallback.enabled) {
    throw new Error("Fallback désactivé");
  }

  createFallbackAd(containerId);
  incrementFallbackUsage();
};

/**
 * Enregistrer une tentative
 */
export const recordAttempt = (network, success) => {
  const attemptsKey = `${network}_attempts`;
  const attempts = parseInt(localStorage.getItem(attemptsKey) || "0") + 1;
  localStorage.setItem(attemptsKey, attempts.toString());

  if (success) {
    const successKey = `${network}_success`;
    const successCount = parseInt(localStorage.getItem(successKey) || "0") + 1;
    localStorage.setItem(successKey, successCount.toString());
  } else {
    const failuresKey = `${network}_failures`;
    const failuresCount =
      parseInt(localStorage.getItem(failuresKey) || "0") + 1;
    localStorage.setItem(failuresKey, failuresCount.toString());
  }
};

/**
 * Incrémenter l'usage du fallback
 */
const incrementFallbackUsage = () => {
  const count = parseInt(localStorage.getItem("fallback_used") || "0") + 1;
  localStorage.setItem("fallback_used", count.toString());
};

/**
 * Obtenir les statistiques complètes
 */
export const getHybridStats = () => {
  const getNetworkStats = (network) => {
    const attempts = parseInt(
      localStorage.getItem(`${network}_attempts`) || "0"
    );
    const success = parseInt(localStorage.getItem(`${network}_success`) || "0");
    const failures = parseInt(
      localStorage.getItem(`${network}_failures`) || "0"
    );

    return {
      attempts,
      success,
      failures,
      successRate: attempts > 0 ? ((success / attempts) * 100).toFixed(1) : 0,
    };
  };

  return {
    admaven: getNetworkStats("admaven"),
    aads: getNetworkStats("aads"),
    fallback: {
      used: parseInt(localStorage.getItem("fallback_used") || "0"),
    },
  };
};

/**
 * Réinitialiser toutes les stats
 */
export const resetAllStats = () => {
  ["admaven", "aads"].forEach((network) => {
    localStorage.removeItem(`${network}_attempts`);
    localStorage.removeItem(`${network}_success`);
    localStorage.removeItem(`${network}_failures`);
  });
  localStorage.removeItem("fallback_used");
};

/**
 * Obtenir le réseau le plus performant
 */
export const getBestPerformingNetwork = () => {
  const stats = getHybridStats();

  let best = { network: "fallback", rate: 0 };

  ["admaven", "aads"].forEach((network) => {
    const rate = parseFloat(stats[network].successRate);
    if (rate > best.rate && stats[network].attempts >= 3) {
      best = { network, rate };
    }
  });

  return best;
};
