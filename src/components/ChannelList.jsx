import { useEffect, useMemo, useState } from "react";
import { Play, Star, Image as ImageIcon } from "lucide-react";

const FAVORITES_SESSION_KEY = "iptv-session-favorites";

const ChannelList = ({
  channels,
  onChannelClick,
  onToggleFavorite,
  favorites = [],
  darkMode,
}) => {
  const [sessionFavorites, setSessionFavorites] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(FAVORITES_SESSION_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!favorites?.length) return;
    setSessionFavorites((prev) => {
      const merged = Array.from(new Set([...prev, ...favorites]));
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          FAVORITES_SESSION_KEY,
          JSON.stringify(merged)
        );
      }
      return merged;
    });
  }, [favorites]);

  const mergedFavorites = useMemo(() => {
    if (!favorites?.length && sessionFavorites.length === 0) return [];
    return Array.from(new Set([...(favorites || []), ...sessionFavorites]));
  }, [favorites, sessionFavorites]);

  const handleFavoriteClick = (channelId) => {
    setSessionFavorites((prev) => {
      let updated;
      if (prev.includes(channelId)) {
        updated = prev.filter((id) => id !== channelId);
      } else {
        updated = [...prev, channelId];
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          FAVORITES_SESSION_KEY,
          JSON.stringify(updated)
        );
      }
      return updated;
    });

    onToggleFavorite(channelId);
  };

  if (!channels || channels.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm md:text-lg">Aucune chaîne à afficher</p>
      </div>
    );
  }

  const isValidUrl = (url) => {
    if (!url) return false;
    const urlLower = url.toLowerCase();
    if (urlLower.includes("placeholder")) return false;
    return urlLower.startsWith("http://") || urlLower.startsWith("https://");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
      {channels.map((channel) => {
        const isFavorite = mergedFavorites.includes(channel.id);
        const hasValidUrl = isValidUrl(channel.url);

        return (
          <div
            key={channel.id}
            className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow dark:shadow-none border border-transparent dark:border-gray-700 hover:shadow-md transition-shadow ${
              !hasValidUrl ? "opacity-60" : ""
            }`}
          >
            {/* Logo */}
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {channel.logo ? (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="max-w-full max-h-full object-contain p-2"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="hidden items-center justify-center w-full h-full">
                <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-300" />
              </div>

              {/* Badge indisponible */}
              {!hasValidUrl && (
                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Indisponible
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-h-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 line-clamp-2 text-sm md:text-base">
                {channel.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mb-2 truncate">
                {channel.group}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => onChannelClick(channel)}
                disabled={!hasValidUrl}
                className={`flex-1 px-3 md:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm md:text-base ${
                  hasValidUrl
                    ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Play className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">
                  {hasValidUrl ? "Lire" : "N/A"}
                </span>
              </button>
              <button
                onClick={() => handleFavoriteClick(channel.id)}
                className={`px-2 md:px-3 py-2 rounded-lg border transition-colors ${
                  isFavorite
                    ? "bg-yellow-400 border-yellow-500 text-white"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                <Star
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    isFavorite ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChannelList;
