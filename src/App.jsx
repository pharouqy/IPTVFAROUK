import { useState, useEffect } from "react";
import VideoPlayer from "./components/VideoPlayer";
import SearchBar from "./components/SearchBar";
import ChannelList from "./components/ChannelList";
import Sidebar from "./components/Sidebar";
import InfiniteScroll from "./components/InfiniteScroll";
import PaginationControls from "./components/PaginationControls";
import { usePagination } from "./hooks/usePagination";
import { useChannelChecker } from "./hooks/useChannelChecker";
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
import {
  Loader,
  RefreshCw,
  AlertCircle,
  Trash2,
  ShieldCheck,
  XCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import InstallPrompt from "./components/InstallPrompt";
import LanguageSelector from "./components/LanguageSelector";

import AdBanner from "./components/AdBanner";

import { useLanguage } from "./i18n/LanguageContext";

function App({ onLoadingChange }) {
  const { t, tp } = useLanguage();

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

  // Notifier le parent des changements d'état de chargement
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading, initialLoadDone);
    }
  }, [loading, initialLoadDone, onLoadingChange]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const [showPreroll, setShowPreroll] = useState(false);
  const [prerollCompleted, setPrerollCompleted] = useState(false);
  const [streamToPlay, setStreamToPlay] = useState(null);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // Options de pagination
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [viewMode, setViewMode] = useState("grid");

  // Hook de vérification des chaînes
  const {
    channelStatuses,
    isChecking,
    progress,
    stats,
    filterOnlineOnly,
    setFilterOnlineOnly,
    startCheck,
    cancelCheck,
    getFilteredChannels,
  } = useChannelChecker();

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

  // Index de la source IPTV sélectionnée (parmi IPTV_CONFIG.playlistUrls)
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(0);
  const currentPlaylistUrl =
    IPTV_CONFIG.playlistUrls[selectedPlaylistIndex] ||
    IPTV_CONFIG.defaultPlaylistUrl;

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

    // Appliquer le filtre en ligne uniquement
    result = getFilteredChannels(result);

    setFilteredChannels(result);
  }, [
    channels,
    selectedGroup,
    searchQuery,
    showFavorites,
    favorites,
    filterOnlineOnly,
    channelStatuses,
  ]);

  // Charger la playlist initiale
  const loadInitialPlaylist = async () => {
    try {
      setLoading(true);
      setError("");

      // Vérifier si on a déjà des chaînes en cache
      const savedChannels = await getAllChannels();
      const savedFavorites = await getFavorites();
      const savedHistory = await getHistory();

      if (savedChannels.length > 0 && !IPTV_CONFIG.autoLoad) {
        // Charger depuis le cache
        setChannels(savedChannels);
        const uniqueGroups = [
          ...new Set(savedChannels.map((ch) => ch.group)),
        ].sort();
        setGroups(uniqueGroups);
        setFavorites(savedFavorites);
        setHistory(savedHistory);
        setInitialLoadDone(true);
      } else {
        // Charger depuis l'URL (première du tableau ou celle par défaut)
        const urlToLoad =
          IPTV_CONFIG.playlistUrls[selectedPlaylistIndex] ||
          IPTV_CONFIG.defaultPlaylistUrl;
        if (urlToLoad) await loadPlaylistFromUrl(urlToLoad);
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
    } catch (err) {
      setError("Erreur lors du chargement de la playlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Recharger la playlist (source actuellement sélectionnée)
  const handleReload = async () => {
    await loadPlaylistFromUrl(currentPlaylistUrl);
  };

  // Changer de source IPTV
  const handlePlaylistSourceChange = async (index) => {
    const url = IPTV_CONFIG.playlistUrls[index];
    if (!url) return;
    setSelectedPlaylistIndex(index);
    await loadPlaylistFromUrl(url);
  };

  // Charger l'historique
  const loadHistoryData = async () => {
    const savedHistory = await getHistory();
    setHistory(savedHistory);
  };

  // Lire une chaîne
  // Lire une chaîne avec Pre-roll
  const handleChannelClick = async (channel) => {
    // Lecture directe
    setCurrentChannel(channel);
    await addToHistory(channel);
    await loadHistoryData();
  };

  // Callback après le pre-roll
  const handlePrerollComplete = async () => {
    setShowPreroll(false);
    setPrerollCompleted(true);

    // Lancer la chaîne
    if (streamToPlay) {
      setCurrentChannel(streamToPlay);
      await addToHistory(streamToPlay);
      await loadHistoryData();
      setStreamToPlay(null);
    }

    // Reset après 30 secondes
    setTimeout(() => {
      setPrerollCompleted(false);
    }, 30000);
  };

  // Callback si l'utilisateur skip
  const handlePrerollSkip = async () => {
    await handlePrerollComplete();
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

  // Affichage si erreur critique
  if (error && !initialLoadDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {t("error.loadError")}
          </h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <div className="bg-red-50 rounded-lg p-3 text-sm text-gray-700 mb-4">
            <p className="font-semibold mb-1">{t("error.configuredUrl")}</p>
            <p className="break-all text-xs">{currentPlaylistUrl}</p>
          </div>
          <button
            onClick={handleReload}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar avec menu burger mobile */}
        <Sidebar
          groups={groups}
          selectedGroup={selectedGroup}
          onGroupSelect={(group) => setSelectedGroup(group)}
          showFavorites={showFavorites}
          onShowFavorites={setShowFavorites}
          showHistory={showHistory}
          onShowHistory={setShowHistory}
          onExport={handleExport}
        />

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
          {/* Header */}
          <header className="bg-white shadow-sm flex-shrink-0 relative">
            {/* Bouton de toggle du header - toujours visible */}
            <button
              onClick={() => setHeaderCollapsed(!headerCollapsed)}
              className="absolute left-4 top-16 lg:left-auto lg:top-0 lg:right-64 z-10 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg lg:rounded-bl-lg lg:rounded-br-lg transition-colors shadow-md"
              aria-label={
                headerCollapsed
                  ? t("header.showHeader")
                  : t("header.hideHeader")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transition-transform duration-300 ${
                  headerCollapsed ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>

            {/* Contenu du header - rétractable */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                headerCollapsed
                  ? "max-h-0 opacity-0"
                  : "max-h-[500px] opacity-100"
              }`}
            >
              {/* Bannière publicitaire */}
              {showAds && (
                <AdBanner
                  position="header"
                  size="leaderboard"
                  theme={theme}
                  onClose={() => console.log("Bannière fermée")}
                />
              )}
              <div className="p-2 md:p-3">
                <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-2 ml-16 lg:ml-0">
                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-base md:text-xl font-bold text-gray-800 truncate"
                      id="main-content-title"
                    >
                      {showFavorites
                        ? t("header.myFavorites")
                        : showHistory
                          ? t("header.history")
                          : selectedGroup === "Toutes"
                            ? t("app.title")
                            : selectedGroup.replace(/;/g, " 😊 ")}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {totalItems} {tp("header.channels", totalItems)}
                      {hasMore &&
                        ` • ${displayedItems.length} ${tp(
                          "header.displayed",
                          displayedItems.length,
                        )}`}
                    </p>
                  </div>
                  {/* Sélecteur de source IPTV (si plusieurs URLs dans .env) */}
                  {IPTV_CONFIG.playlistUrls.length > 1 && (
                    <select
                      value={selectedPlaylistIndex}
                      onChange={(e) =>
                        handlePlaylistSourceChange(
                          Number(e.target.value)
                        )
                      }
                      className="text-xs md:text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 max-w-[140px] md:max-w-[200px] truncate"
                      aria-label={t("header.source") || "Source playlist"}
                      title={currentPlaylistUrl}
                    >
                      {IPTV_CONFIG.playlistUrls.map((url, i) => (
                        <option key={url} value={i}>
                          {t("header.sourceLabel", { n: i + 1 }) ||
                            `Source ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  )}
                  {/* BOUTONS CÔTÉ À CÔTÉ */}
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors text-xs md:text-sm"
                      aria-label={
                        theme === "light"
                          ? t("sidebar.darkTheme")
                          : t("sidebar.lightTheme")
                      }
                    >
                      {theme === "light"
                        ? `🌙 ${t("header.darkMode")}`
                        : `☀️ ${t("header.lightMode")}`}
                    </button>
                    <button
                      onClick={handleReload}
                      className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 md:px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                      aria-label={t("header.reload") || "Recharger la playlist"}
                    >
                      <RefreshCw
                        className="w-3 h-3 md:w-4 md:h-4"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">
                        {t("header.reload")}
                      </span>
                    </button>
                    {/* Bouton vérifier les chaînes */}
                    {!isChecking ? (
                      <button
                        onClick={() => startCheck(displayedItems)}
                        disabled={channels.length === 0}
                        className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 md:px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={t("checker.verify")}
                      >
                        <ShieldCheck
                          className="w-3 h-3 md:w-4 md:h-4"
                          aria-hidden="true"
                        />
                        <span className="hidden sm:inline">
                          {t("checker.verify")}
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={cancelCheck}
                        className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 md:px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                        aria-label={t("checker.cancel")}
                      >
                        <XCircle
                          className="w-3 h-3 md:w-4 md:h-4"
                          aria-hidden="true"
                        />
                        <span className="hidden sm:inline">
                          {t("checker.cancel")}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Barre de progression de vérification */}
                {isChecking && (
                  <div className="mx-2 md:mx-3 mb-2 ml-16 lg:ml-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="checker-progress-bar h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t("checker.verifying")} {progress.checked}/
                      {progress.total} ({progress.percentage}%)
                    </p>
                  </div>
                )}

                {/* Résultats de la vérification */}
                {!isChecking && stats.total > 0 && (
                  <div className="mx-2 md:mx-3 mb-2 ml-16 lg:ml-2 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Wifi className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {stats.online} {t("checker.statsOnline")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <WifiOff className="w-3 h-3 text-red-500" />
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {stats.offline} {t("checker.statsOffline")}
                      </span>
                    </div>
                    <button
                      onClick={() => setFilterOnlineOnly(!filterOnlineOnly)}
                      className={`ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                        filterOnlineOnly
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {filterOnlineOnly ? (
                        <>
                          <Wifi className="w-3 h-3" />
                          {t("checker.onlineOnly")}
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3" />
                          {t("checker.showAll")}
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Barre de recherche */}
                {!showHistory && (
                  <div className="ml-16 lg:ml-0 mb-2">
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
                <div className="ml-16 lg:ml-0 pb-2">
                  <PaginationControls
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    totalItems={totalItems}
                  />
                </div>
              )}
            </div>
          </header>

          {/* Liste des chaînes */}
          <main
            className="flex-1 overflow-y-auto p-3 md:p-6"
            aria-labelledby="main-content-title"
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-10 h-10 md:w-12 md:h-12 animate-spin text-blue-600" />
              </div>
            ) : showHistory ? (
              <div className="max-w-7xl mx-auto">
                {history.length === 0 ? (
                  <p className="text-center text-gray-500 py-12 text-sm md:text-base">
                    {t("history.empty")}
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
                              (ch) => ch.id === item.channelId,
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
                          {t("history.rewatch")}
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
                    channelStatuses={channelStatuses}
                  />
                </InfiniteScroll>
              </div>
            )}
          </main>
          <p className="text-center text-xs text-gray-400 py-2">
            IPTVFarouk - © {new Date().getFullYear()}. {t("footer.copyright")}
            <br />
            {t("footer.developedBy")}
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
        {/* Pre-roll publicitaire */}
        {showPreroll && (
          <AdPreroll
            onComplete={handlePrerollComplete}
            onSkip={handlePrerollSkip}
          />
        )}

        {/* Prompt d'installation PWA */}
        <InstallPrompt />
      </div>
    </>
  );
}

export default App;
