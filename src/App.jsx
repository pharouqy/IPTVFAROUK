import { useState, useEffect } from "react";
import FileUploader from "./components/FileUploader";
import VideoPlayer from "./components/VideoPlayer";
import SearchBar from "./components/SearchBar";
import ChannelList from "./components/ChannelList";
import Sidebar from "./components/Sidebar";
import InfiniteScroll from "./components/InfiniteScroll";
import Pagination from "./components/Pagination";
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
import { Loader } from "lucide-react";

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

  // Options de pagination
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [paginationType, setPaginationType] = useState("infinite"); // 'infinite' ou 'classic'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' ou 'list'

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

  // Chargement initial depuis IndexedDB
  useEffect(() => {
    loadSavedData();
  }, []);

  // Filtrage des chaînes
  useEffect(() => {
    let result = channels;

    // Filtre favoris
    if (showFavorites) {
      result = channels.filter((ch) => favorites.includes(ch.id));
    }
    // Filtre groupe
    else if (selectedGroup !== "Toutes") {
      result = filterByGroup(channels, selectedGroup);
    }

    // Recherche
    if (searchQuery) {
      result = searchChannels(result, searchQuery);
    }

    setFilteredChannels(result);
  }, [channels, selectedGroup, searchQuery, showFavorites, favorites]);

  // Fermer le lecteur avec la touche ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && currentChannel) {
        setCurrentChannel(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChannel]);

  // Charger les données sauvegardées
  const loadSavedData = async () => {
    try {
      setLoading(true);
      const savedChannels = await getAllChannels();
      const savedFavorites = await getFavorites();
      const savedHistory = await getHistory();

      if (savedChannels.length > 0) {
        setChannels(savedChannels);
        const uniqueGroups = [
          ...new Set(savedChannels.map((ch) => ch.group)),
        ].sort();
        setGroups(uniqueGroups);
      }

      setFavorites(savedFavorites);
      setHistory(savedHistory);
    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger une playlist
  const handlePlaylistLoaded = async (source) => {
    try {
      setLoading(true);
      setError("");

      const result = await parseM3U(source);

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

      console.log(`✅ ${result.total} chaînes chargées`);
    } catch (err) {
      setError("Erreur lors du chargement de la playlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Lire une chaîne
  const handleChannelClick = async (channel) => {
    setCurrentChannel(channel);

    // Ajouter à l'historique
    await addToHistory(channel);
    const updatedHistory = await getHistory();
    setHistory(updatedHistory);
  };

  // Toggle favori
  const handleToggleFavorite = async (channelId) => {
    if (favorites.includes(channelId)) {
      await removeFromFavorites(channelId);
    } else {
      await addToFavorites(channelId);
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

  // Charger plus (pour infinite scroll)
  const handleLoadMore = async () => {
    setLoadingMore(true);
    // Simulation d'un petit délai pour l'effet visuel
    setTimeout(() => {
      loadMore();
      setLoadingMore(false);
    }, 500);
  };

  // Affichage si aucune chaîne
  if (!loading && channels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <FileUploader onPlaylistLoaded={handlePlaylistLoaded} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {showFavorites
                    ? "Mes Favoris"
                    : showHistory
                    ? "Historique"
                    : selectedGroup === "Toutes"
                    ? "Toutes les chaînes"
                    : selectedGroup}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {totalItems} chaîne{totalItems > 1 ? "s" : ""}
                  {paginationType === "infinite" &&
                    hasMore &&
                    ` • ${displayedItems.length} affichée${
                      displayedItems.length > 1 ? "s" : ""
                    }`}
                </p>
              </div>

              <button
                onClick={() => {
                  setChannels([]);
                  setGroups([]);
                  setFavorites([]);
                  localStorage.clear();
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Charger une nouvelle playlist
              </button>
            </div>

            {/* Barre de recherche */}
            {!showHistory && (
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery("")}
              />
            )}
          </div>

          {/* Contrôles de pagination */}
          {!showHistory && filteredChannels.length > 0 && (
            <PaginationControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={totalItems}
            />
          )}
        </header>

        {/* Liste des chaînes */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : showHistory ? (
            // Affichage historique
            <div className="max-w-7xl mx-auto">
              {history.length === 0 ? (
                <p className="text-center text-gray-500 py-12">
                  Aucun historique de visionnage
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.channelName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(item.watchedAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const channel = channels.find(
                            (ch) => ch.id === item.channelId
                          );
                          if (channel) handleChannelClick(channel);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Relire
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Affichage grille chaînes avec pagination
            <div className="max-w-7xl mx-auto">
              {paginationType === "infinite" ? (
                // Infinite Scroll
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
              ) : (
                // Pagination classique
                <>
                  <ChannelList
                    channels={displayedItems}
                    onChannelClick={handleChannelClick}
                    onToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                    viewMode={viewMode}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Lecteur vidéo */}
      {currentChannel && (
        <VideoPlayer
          channel={currentChannel}
          onClose={() => setCurrentChannel(null)}
        />
      )}

      {/* Message d'erreur global */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
          <button onClick={() => setError("")} className="ml-4 font-bold">
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
