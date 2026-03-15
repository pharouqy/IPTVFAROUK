/**
 * Parse les URLs IPTV depuis .env
 * - VITE_IPTV_URLS : liste séparée par des virgules (ex: https://a.m3u,https://b.m3u)
 * - VITE_APP_IPTV_URL : une seule URL (fallback si VITE_IPTV_URLS non défini)
 */
function getPlaylistUrls() {
  const urlsEnv = import.meta.env.VITE_IPTV_URLS;
  if (urlsEnv && typeof urlsEnv === "string") {
    const urls = urlsEnv
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length > 0) return urls;
  }
  const single = import.meta.env.VITE_APP_IPTV_URL;
  return single ? [single] : [];
}

const playlistUrls = getPlaylistUrls();

// Configuration IPTV
export const IPTV_CONFIG = {
  /** Tableau de toutes les URLs M3U configurées dans .env */
  playlistUrls,

  /** URL par défaut (première du tableau, rétrocompat) */
  defaultPlaylistUrl: playlistUrls[0] || import.meta.env.VITE_APP_IPTV_URL || "",

  // Nom de la playlist
  playlistName: "Playlist des chaines du monde",

  // Auto-chargement au démarrage
  autoLoad: true,

  // Options (pour évolution future)
  allowCustomUrl: false,
  allowFileUpload: false,
};
