import parser from "iptv-playlist-parser";

/**
 * Parse un fichier M3U depuis une URL ou un fichier local
 * @param {File|string} source - Fichier M3U, URL ou contenu texte
 * @returns {Promise<Object>} Résultat du parsing
 */
export const parseM3U = async (source) => {
  try {
    let content;

    // CAS 1 : URL distante (CDN)
    if (
      typeof source === "string" &&
      (source.startsWith("http://") || source.startsWith("https://"))
    ) {
      const response = await fetch(source);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      content = await response.text();
    }
    // CAS 2 : Fichier local
    else if (source instanceof File) {
      content = await source.text();
    }
    // CAS 3 : Contenu texte direct
    else {
      content = source;
    }

    // Valider le format M3U
    if (!isValidM3U(content)) {
      throw new Error("Le fichier n'est pas un fichier M3U valide");
    }

    // Parser le contenu M3U
    const result = parser.parse(content);

    // Transformer les données pour notre application
    const channels = result.items.map((item, index) => ({
      id: `channel-${Date.now()}-${index}`,
      name: item.name || "Chaîne sans nom",
      url: item.url,
      logo: item.tvg?.logo || item.logo || "",
      group: item.group?.title || "Non catégorisé",
      language: item.tvg?.language || "",
      country: item.tvg?.country || "",
      tvgId: item.tvg?.id || "",
      isFavorite: false,
      addedAt: new Date().toISOString(),
    }));


    return {
      success: true,
      channels,
      total: channels.length,
      groups: [...new Set(channels.map((ch) => ch.group))].sort(),
      source:
        typeof source === "string" && source.startsWith("http")
          ? source
          : "local",
    };
  } catch (error) {
    console.error("❌ Erreur lors du parsing M3U:", error);
    return {
      success: false,
      error: error.message,
      channels: [],
      total: 0,
      groups: [],
    };
  }
};

/**
 * Valide si le contenu est un fichier M3U valide
 * @param {string} content - Contenu du fichier
 * @returns {boolean}
 */
export const isValidM3U = (content) => {
  const trimmed = content.trim();
  return trimmed.startsWith("#EXTM3U") || trimmed.startsWith("#EXTINF");
};

/**
 * Charge une playlist depuis une URL prédéfinie
 * @param {string} url - URL de la playlist
 * @returns {Promise<Object>}
 */
export const loadPlaylistFromURL = async (url) => {
  return await parseM3U(url);
};

/**
 * Liste des playlists populaires (optionnel)
 */
export const POPULAR_PLAYLISTS = [
  {
    name: "IPTV-ORG (Global)",
    url: "https://iptv-org.github.io/iptv/index.m3u",
    description: "Collection mondiale de chaînes IPTV publiques",
  },
  {
    name: "IPTV-ORG (Par pays)",
    url: "https://iptv-org.github.io/iptv/index.country.m3u",
    description: "Chaînes organisées par pays",
  },
  {
    name: "IPTV-ORG (Par langue)",
    url: "https://iptv-org.github.io/iptv/index.language.m3u",
    description: "Chaînes organisées par langue",
  },
];

/**
 * Exporte les chaînes au format M3U
 * @param {Array} channels - Liste des chaînes
 * @returns {string} Contenu M3U
 */
export const exportToM3U = (channels) => {
  let m3uContent = "#EXTM3U\n\n";

  channels.forEach((channel) => {
    const extinf = `#EXTINF:-1 tvg-id="${channel.tvgId}" tvg-logo="${channel.logo}" group-title="${channel.group}",${channel.name}`;
    m3uContent += `${extinf}\n${channel.url}\n\n`;
  });

  return m3uContent;
};

/**
 * Télécharge un fichier M3U
 * @param {Array} channels - Liste des chaînes
 * @param {string} filename - Nom du fichier
 */
export const downloadM3U = (channels, filename = "playlist.m3u") => {
  const content = exportToM3U(channels);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Filtre les chaînes par groupe
 * @param {Array} channels - Liste des chaînes
 * @param {string} group - Nom du groupe
 * @returns {Array}
 */
export const filterByGroup = (channels, group) => {
  if (!group || group === "Toutes") return channels;
  return channels.filter((ch) => ch.group === group);
};

/**
 * Recherche des chaînes par nom
 * @param {Array} channels - Liste des chaînes
 * @param {string} query - Terme de recherche
 * @returns {Array}
 */
export const searchChannels = (channels, query) => {
  if (!query) return channels;

  const lowerQuery = query.toLowerCase();
  return channels.filter(
    (ch) =>
      ch.name.toLowerCase().includes(lowerQuery) ||
      ch.group.toLowerCase().includes(lowerQuery) ||
      ch.country.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Teste si une URL de stream fonctionne
 * @param {string} url - URL à tester
 * @returns {Promise<boolean>}
 */
export const testStreamURL = async (url) => {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors", // Pour éviter les problèmes CORS
    });
    return true;
  } catch (error) {
    console.warn("Stream non accessible:", url);
    return false;
  }
};
