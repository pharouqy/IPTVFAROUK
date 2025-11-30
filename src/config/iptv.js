// Configuration IPTV
export const IPTV_CONFIG = {
  // Votre URL M3U par défaut
  defaultPlaylistUrl: import.meta.env.VITE_APP_IPTV_URL,

  // Nom de la playlist
  playlistName: "Playlist des chaines du monde",

  // Auto-chargement au démarrage
  autoLoad: true,

  // Options (pour évolution future)
  allowCustomUrl: false, // Mettre à true si vous voulez permettre de changer l'URL
  allowFileUpload: false, // Mettre à true si vous voulez permettre l'upload
};
