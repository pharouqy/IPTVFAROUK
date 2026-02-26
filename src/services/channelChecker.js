/**
 * Service de vérification des chaînes IPTV
 * Utilise des éléments <video> cachés pour tester les streams (bypass CORS)
 */

// Cache en mémoire des résultats de vérification
const statusCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Vérifie si un stream est accessible en le chargeant dans un <video> caché
 * @param {string} url - URL du stream à tester
 * @param {number} timeout - Timeout en ms (défaut 8s)
 * @returns {Promise<{online: boolean, responseTime: number}>}
 */
export const checkStream = (url, timeout = 8000) => {
  return new Promise((resolve) => {
    // Vérifier le cache d'abord
    const cached = statusCache.get(url);
    if (cached && Date.now() - cached.checkedAt < CACHE_DURATION) {
      return resolve({
        online: cached.online,
        responseTime: cached.responseTime,
        fromCache: true,
      });
    }

    const startTime = Date.now();
    const video = document.createElement("video");
    let resolved = false;

    const cleanup = () => {
      if (resolved) return;
      resolved = true;
      video.removeAttribute("src");
      video.load();
      video.remove();
    };

    const onSuccess = () => {
      if (resolved) return;
      const responseTime = Date.now() - startTime;
      cleanup();
      const result = { online: true, responseTime };
      statusCache.set(url, { ...result, checkedAt: Date.now() });
      resolve(result);
    };

    const onError = () => {
      if (resolved) return;
      const responseTime = Date.now() - startTime;
      cleanup();
      const result = { online: false, responseTime };
      statusCache.set(url, { ...result, checkedAt: Date.now() });
      resolve(result);
    };

    // Timeout de sécurité
    const timer = setTimeout(() => {
      if (!resolved) {
        onError();
      }
    }, timeout);

    video.addEventListener("canplay", () => {
      clearTimeout(timer);
      onSuccess();
    });

    video.addEventListener("loadeddata", () => {
      clearTimeout(timer);
      onSuccess();
    });

    video.addEventListener("error", () => {
      clearTimeout(timer);
      onError();
    });

    // Configurer le video element
    video.muted = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.style.display = "none";

    // Ajouter au DOM temporairement (nécessaire pour certains navigateurs)
    document.body.appendChild(video);

    // Charger le stream
    try {
      video.src = url;
      video.load();
    } catch {
      clearTimeout(timer);
      onError();
    }
  });
};

/**
 * Vérifie un lot de chaînes avec concurrence limitée
 * @param {Array} channels - Liste des chaînes à vérifier
 * @param {number} concurrency - Nombre de vérifications simultanées
 * @param {Function} onProgress - Callback de progression
 * @param {AbortSignal} signal - Signal d'annulation
 * @returns {Promise<Map>} Map<url, {online, responseTime, checkedAt}>
 */
export const checkChannelsBatch = async (
  channels,
  concurrency = 5,
  onProgress = null,
  signal = null,
) => {
  const results = new Map();
  const total = channels.length;
  let checked = 0;

  // Déduplication par URL
  const uniqueUrls = new Map();
  for (const channel of channels) {
    if (channel.url && !uniqueUrls.has(channel.url)) {
      uniqueUrls.set(channel.url, channel);
    }
  }

  const queue = Array.from(uniqueUrls.entries());
  const totalUnique = queue.length;
  checked = 0;

  // Traiter par lots
  const processBatch = async (batch) => {
    const promises = batch.map(async ([url, channel]) => {
      if (signal?.aborted) return;

      const result = await checkStream(url);
      checked++;

      results.set(url, {
        ...result,
        checkedAt: Date.now(),
      });

      if (onProgress) {
        onProgress({
          checked,
          total: totalUnique,
          percentage: Math.round((checked / totalUnique) * 100),
          channel,
          status: result.online ? "online" : "offline",
        });
      }
    });

    await Promise.all(promises);
  };

  // Exécuter les lots séquentiellement
  for (let i = 0; i < queue.length; i += concurrency) {
    if (signal?.aborted) break;
    const batch = queue.slice(i, i + concurrency);
    await processBatch(batch);
  }

  return results;
};

/**
 * Récupère le cache de statuts
 * @returns {Map}
 */
export const getStatusCache = () => statusCache;

/**
 * Vide le cache de statuts
 */
export const clearStatusCache = () => {
  statusCache.clear();
};

/**
 * Récupère le statut d'une chaîne depuis le cache
 * @param {string} url
 * @returns {{online: boolean, responseTime: number, checkedAt: number}|null}
 */
export const getChannelStatus = (url) => {
  const cached = statusCache.get(url);
  if (cached && Date.now() - cached.checkedAt < CACHE_DURATION) {
    return cached;
  }
  return null;
};
