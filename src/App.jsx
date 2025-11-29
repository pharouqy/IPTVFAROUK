import { useState, useEffect } from "react";
import VideoPlayer from "./components/VideoPlayer";
import SearchBar from "./components/SearchBar";
import ChannelList from "./components/ChannelList";
import Sidebar from "./components/Sidebar";
import InfiniteScroll from "./components/InfiniteScroll";
import PaginationControls from "./components/PaginationControls";
import { usePagination } from "./hooks/usePagination";
import {
  parseM3U,
  searchChannels,
  filterByGroup,
  downloadM3U,
} from "./services/m3uParser";
import {
  saveChannels,
  getAllChannels,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  addToHistory,
  getHistory,
} from "./services/storage";
import { IPTV_CONFIG } from "./config/iptv";
import { Loader, RefreshCw, AlertCircle, Trash2 } from "lucide-react";
import InstallPrompt from "./components/InstallPrompt";

import AdBanner from "./components/AdBanner";
import { hasPremiumSubscription } from "./services/admaven";

function App() {
  // États principaux
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentChannel, setCurrentChannel] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // Options de pagination
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [viewMode, setViewMode] = useState("grid");

  // Hook de pagination
  const {
    displayedItems,
    currentPage,
    totalPages,
    goToPage,
    loadMore,
    hasMore,
    totalItems,
  } = usePagination(filteredChannels, itemsPerPage);

  // Chargement initial automatique
  useEffect(() => {
    loadInitialPlaylist();
  }, []);

  const [showAds, setShowAds] = useState(true);

  // Vérifier le statut Premium au chargement
  useEffect(() => {
    const isPremium = hasPremiumSubscription();
    setShowAds(!isPremium);
    console.log(
      isPremium
        ? "💎 Mode Premium - Pas de pub"
        : "📺 Mode gratuit - Pubs activées"
    );
  }, []);

  // Fermer le lecteur avec ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && currentChannel) {
        setCurrentChannel(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChannel]);

  // Filtrage des chaînes
  useEffect(() => {
    let result = channels;

    if (showFavorites) {
      result = channels.filter((ch) => favorites.includes(ch.url));
    } else if (selectedGroup !== "Toutes") {
      result = filterByGroup(channels, selectedGroup);
    }

    if (searchQuery) {
      result = searchChannels(result, searchQuery);
    }

    setFilteredChannels(result);
  }, [channels, selectedGroup, searchQuery, showFavorites, favorites]);

  // Charger la playlist initiale
  const loadInitialPlaylist = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🚀 Chargement de la playlist par défaut...");
      console.log("📡 URL:", IPTV_CONFIG.defaultPlaylistUrl);

      // Vérifier si on a déjà des chaînes en cache
      const savedChannels = await getAllChannels();
      const savedFavorites = await getFavorites();
      const savedHistory = await getHistory();

      if (savedChannels.length > 0 && !IPTV_CONFIG.autoLoad) {
        // Charger depuis le cache
        console.log("💾 Chargement depuis le cache");
        setChannels(savedChannels);
        const uniqueGroups = [
          ...new Set(savedChannels.map((ch) => ch.group)),
        ].sort();
        setGroups(uniqueGroups);
        setFavorites(savedFavorites);
        setHistory(savedHistory);
        setInitialLoadDone(true);
      } else {
        // Charger depuis l'URL
        await loadPlaylistFromUrl(IPTV_CONFIG.defaultPlaylistUrl);
      }
    } catch (err) {
      console.error("❌ Erreur chargement initial:", err);
      setError("Impossible de charger la playlist");
    } finally {
      setLoading(false);
    }
  };

  // Charger une playlist depuis une URL
  const loadPlaylistFromUrl = async (url) => {
    try {
      setLoading(true);
      setError("");

      const result = await parseM3U(url);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Sauvegarder les chaînes
      await saveChannels(result.channels);

      // Mettre à jour l'état
      setChannels(result.channels);
      setGroups(result.groups);
      setSelectedGroup("Toutes");
      setSearchQuery("");
      setInitialLoadDone(true);

      // Charger favoris et historique
      const savedFavorites = await getFavorites();
      const savedHistory = await getHistory();
      setFavorites(savedFavorites);
      setHistory(savedHistory);

      console.log(`✅ ${result.total} chaînes chargées avec succès`);
    } catch (err) {
      setError("Erreur lors du chargement de la playlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Recharger la playlist
  const handleReload = async () => {
    await loadPlaylistFromUrl(IPTV_CONFIG.defaultPlaylistUrl);
  };

  // Lire une chaîne
  const handleChannelClick = async (channel) => {
    setCurrentChannel(channel);
    await addToHistory(channel);
    const updatedHistory = await getHistory();
    setHistory(updatedHistory);
  };

  // Toggle favori
  const handleToggleFavorite = async (channelId) => {
    const channel = channels.find((ch) => ch.id === channelId);
    if (!channel) return;

    if (favorites.includes(channel.url)) {
      await removeFromFavorites(channel);
    } else {
      await addToFavorites(channel);
    }
    const updatedFavorites = await getFavorites();
    setFavorites(updatedFavorites);
  };

  // Exporter la playlist
  const handleExport = () => {
    const channelsToExport = showFavorites
      ? channels.filter((ch) => favorites.includes(ch.id))
      : filteredChannels;
    downloadM3U(channelsToExport, "ma-playlist.m3u");
  };

  // Charger plus (infinite scroll)
  const handleLoadMore = async () => {
    setLoadingMore(true);
    setTimeout(() => {
      loadMore();
      setLoadingMore(false);
    }, 500);
  };

  // Affichage pendant le chargement initial
  if (loading && !initialLoadDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <Loader className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Chargement de la playlist...
          </h2>
          <p className="text-gray-600 mb-4">{IPTV_CONFIG.playlistName}</p>
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
            <p className="break-all hidden">{IPTV_CONFIG.defaultPlaylistUrl}</p>
          </div>
        </div>
      </div>
    );
  }

  // Affichage si erreur critique
  if (error && !initialLoadDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <div className="bg-red-50 rounded-lg p-3 text-sm text-gray-700 mb-4">
            <p className="font-semibold mb-1">URL configurée :</p>
            <p className="break-all text-xs">
              {IPTV_CONFIG.defaultPlaylistUrl}
            </p>
          </div>
          <button
            onClick={handleReload}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header/boutons alignés à droite */}
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar avec menu burger mobile */}
        <Sidebar
          groups={groups}
          selectedGroup={selectedGroup}
          onGroupSelect={setSelectedGroup}
          showFavorites={showFavorites}
          onShowFavorites={setShowFavorites}
          showHistory={showHistory}
          onShowHistory={setShowHistory}
          onExport={handleExport}
        />

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
          {/* Header */}
          <header className="bg-white shadow-sm flex-shrink-0">
            {/* Bannière publicitaire */}
            {showAds && (
              <AdBanner
                position="header"
                size="leaderboard"
                onClose={() => console.log("Bannière fermée")}
              />
            )}
            <div className="p-3 md:p-4">
              <div className="flex items-center justify-between mb-3 md:mb-4 ml-16 lg:ml-0">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800 truncate">
                    {showFavorites
                      ? "Mes Favoris"
                      : showHistory
                      ? "Historique"
                      : selectedGroup === "Toutes"
                      ? IPTV_CONFIG.playlistName
                      : selectedGroup}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {totalItems} chaîne{totalItems > 1 ? "s" : ""}
                    {hasMore &&
                      ` • ${displayedItems.length} affichée${
                        displayedItems.length > 1 ? "s" : ""
                      }`}
                  </p>
                </div>
                {/* BOUTONS CÔTÉ À CÔTÉ */}
                <div className="flex gap-2 items-center">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors text-xs md:text-sm"
                    aria-label={
                      theme === "light"
                        ? "Activer le mode sombre"
                        : "Activer le mode clair"
                    }
                  >
                    {theme === "light" ? "🌙 Sombre" : "☀️ Clair"}
                  </button>
                  <button
                    onClick={handleReload}
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 md:px-4 py-2 rounded-lg transition-colors flex-shrink-0"
                  >
                    <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Recharger</span>
                  </button>
                </div>
              </div>

              {/* Barre de recherche */}
              {!showHistory && (
                <div className="ml-16 lg:ml-0">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onClear={() => setSearchQuery("")}
                  />
                </div>
              )}
            </div>

            {/* Contrôles de pagination */}
            {!showHistory && filteredChannels.length > 0 && (
              <div className="ml-16 lg:ml-0">
                <PaginationControls
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  totalItems={totalItems}
                />
              </div>
            )}
          </header>

          {/* Liste des chaînes */}
          <main className="flex-1 overflow-y-auto p-3 md:p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-10 h-10 md:w-12 md:h-12 animate-spin text-blue-600" />
              </div>
            ) : showHistory ? (
              <div className="max-w-7xl mx-auto">
                {history.length === 0 ? (
                  <p className="text-center text-gray-500 py-12 text-sm md:text-base">
                    Aucun historique de visionnage
                  </p>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-3 md:p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                            {item.channelName}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500">
                            {new Date(item.watchedAt).toLocaleString("fr-FR")}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const channel = channels.find(
                              (ch) => ch.id === item.channelId
                            );

                            if (channel) {
                              handleChannelClick(channel);
                            } else {
                              // Si la chaîne n'est plus présente dans la liste (ou id différent),
                              // on la relit directement à partir des infos stockées dans l'historique
                              setCurrentChannel({
                                id: item.channelId ?? `history-${item.id}`,
                                name: item.channelName,
                                url: item.channelUrl,
                                group: "Historique",
                              });
                            }
                          }}
                          className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base whitespace-nowrap"
                        >
                          Relire
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <InfiniteScroll
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  loading={loadingMore}
                >
                  <ChannelList
                    channels={displayedItems}
                    onChannelClick={handleChannelClick}
                    onToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                    viewMode={viewMode}
                  />
                </InfiniteScroll>
              </div>
            )}
          </main>
          <p className="text-center text-xs text-gray-400 py-2">
            IPTVFarouk - © {new Date().getFullYear()}. Tous droits réservés.
            <br />
            Développé par
            <a
              href="https://github.com/pharouqy"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Farouk Younsi
            </a>{" "}
            with ❤️.
          </p>
        </div>

        {/* Lecteur vidéo */}
        {currentChannel && (
          <VideoPlayer
            channel={currentChannel}
            onClose={() => setCurrentChannel(null)}
          />
        )}
        <InstallPrompt />
      </div>
    </>
  );
}

export default App;
