import { openDB } from "idb";

const DB_NAME = "iptvPlayerDB";
const DB_VERSION = 1;
const CHANNELS_STORE = "channels";
const FAVORITES_STORE = "favorites";
const HISTORY_STORE = "history";

/**
 * Initialise la base de données IndexedDB
 */
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store pour les chaînes
      if (!db.objectStoreNames.contains(CHANNELS_STORE)) {
        const channelsStore = db.createObjectStore(CHANNELS_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
        channelsStore.createIndex("name", "name", { unique: false });
        channelsStore.createIndex("group", "group", { unique: false });
      }

      // Store pour les favoris
      if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
        db.createObjectStore(FAVORITES_STORE, { keyPath: "channelId" });
      }

      // Store pour l'historique
      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        const historyStore = db.createObjectStore(HISTORY_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
        historyStore.createIndex("watchedAt", "watchedAt", { unique: false });
      }
    },
  });
};

// === GESTION DES CHAÎNES ===

export const saveChannels = async (channels) => {
  try {
    const db = await initDB();
    const tx = db.transaction(CHANNELS_STORE, "readwrite");

    // Vider le store avant d'insérer
    await tx.store.clear();

    // Insérer toutes les chaînes
    for (const channel of channels) {
      await tx.store.add(channel);
    }

    await tx.done;
    return { success: true };
  } catch (error) {
    console.error("Erreur sauvegarde chaînes:", error);
    return { success: false, error: error.message };
  }
};

export const getAllChannels = async () => {
  try {
    const db = await initDB();
    return await db.getAll(CHANNELS_STORE);
  } catch (error) {
    console.error("Erreur récupération chaînes:", error);
    return [];
  }
};

export const deleteAllChannels = async () => {
  try {
    const db = await initDB();
    await db.clear(CHANNELS_STORE);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// === GESTION DES FAVORIS ===

export const addToFavorites = async (channelId) => {
  try {
    const db = await initDB();
    await db.put(FAVORITES_STORE, {
      channelId,
      addedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeFromFavorites = async (channelId) => {
  try {
    const db = await initDB();
    await db.delete(FAVORITES_STORE, channelId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getFavorites = async () => {
  try {
    const db = await initDB();
    const favorites = await db.getAll(FAVORITES_STORE);
    return favorites.map((fav) => fav.channelId);
  } catch (error) {
    console.error("Erreur récupération favoris:", error);
    return [];
  }
};

// === GESTION DE L'HISTORIQUE ===

export const addToHistory = async (channel) => {
  try {
    const db = await initDB();
    await db.add(HISTORY_STORE, {
      channelId: channel.id,
      channelName: channel.name,
      channelUrl: channel.url,
      watchedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getHistory = async (limit = 20) => {
  try {
    const db = await initDB();
    const tx = db.transaction(HISTORY_STORE, "readonly");
    const index = tx.store.index("watchedAt");

    let history = await index.getAll();
    history = history.reverse().slice(0, limit);

    return history;
  } catch (error) {
    console.error("Erreur récupération historique:", error);
    return [];
  }
};

export const clearHistory = async () => {
  try {
    const db = await initDB();
    await db.clear(HISTORY_STORE);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
