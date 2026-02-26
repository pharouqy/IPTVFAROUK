import { useState, useCallback, useRef } from "react";
import {
  checkChannelsBatch,
  clearStatusCache,
} from "../services/channelChecker";

/**
 * Hook React pour la vérification des chaînes IPTV
 * Gère l'état de vérification, la progression et le filtrage
 */
export const useChannelChecker = () => {
  const [channelStatuses, setChannelStatuses] = useState(new Map());
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState({
    checked: 0,
    total: 0,
    percentage: 0,
  });
  const [filterOnlineOnly, setFilterOnlineOnly] = useState(false);
  const [stats, setStats] = useState({ online: 0, offline: 0, total: 0 });
  const abortControllerRef = useRef(null);

  /**
   * Lance la vérification des chaînes
   */
  const startCheck = useCallback(
    async (channels) => {
      if (isChecking) return;

      // Créer un AbortController pour l'annulation
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsChecking(true);
      setProgress({ checked: 0, total: channels.length, percentage: 0 });

      try {
        const results = await checkChannelsBatch(
          channels,
          5, // concurrence
          (progressData) => {
            setProgress({
              checked: progressData.checked,
              total: progressData.total,
              percentage: progressData.percentage,
            });

            // Mettre à jour les statuts au fur et à mesure
            setChannelStatuses((prev) => {
              const next = new Map(prev);
              next.set(progressData.channel.url, {
                online: progressData.status === "online",
                checkedAt: Date.now(),
              });
              return next;
            });
          },
          signal,
        );

        // Calculer les stats finales
        let online = 0;
        let offline = 0;
        results.forEach((value) => {
          if (value.online) online++;
          else offline++;
        });

        setStats({ online, offline, total: results.size });
        setChannelStatuses(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Erreur lors de la vérification:", err);
        }
      } finally {
        setIsChecking(false);
        abortControllerRef.current = null;
      }
    },
    [isChecking],
  );

  /**
   * Annule la vérification en cours
   */
  const cancelCheck = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsChecking(false);

      // Calculer les stats partielles
      let online = 0;
      let offline = 0;
      channelStatuses.forEach((value) => {
        if (value.online) online++;
        else offline++;
      });
      setStats({ online, offline, total: channelStatuses.size });
    }
  }, [channelStatuses]);

  /**
   * Réinitialise tous les statuts
   */
  const resetStatuses = useCallback(() => {
    setChannelStatuses(new Map());
    setProgress({ checked: 0, total: 0, percentage: 0 });
    setStats({ online: 0, offline: 0, total: 0 });
    setFilterOnlineOnly(false);
    clearStatusCache();
  }, []);

  /**
   * Filtre les chaînes pour ne garder que celles en ligne
   */
  const getFilteredChannels = useCallback(
    (channels) => {
      if (!filterOnlineOnly || channelStatuses.size === 0) {
        return channels;
      }

      return channels.filter((channel) => {
        const status = channelStatuses.get(channel.url);
        // Si pas de statut, on garde la chaîne (pas encore vérifiée)
        if (!status) return true;
        return status.online;
      });
    },
    [filterOnlineOnly, channelStatuses],
  );

  /**
   * Récupère le statut d'une chaîne
   */
  const getStatus = useCallback(
    (url) => {
      return channelStatuses.get(url) || null;
    },
    [channelStatuses],
  );

  return {
    channelStatuses,
    isChecking,
    progress,
    stats,
    filterOnlineOnly,
    setFilterOnlineOnly,
    startCheck,
    cancelCheck,
    resetStatuses,
    getFilteredChannels,
    getStatus,
  };
};
