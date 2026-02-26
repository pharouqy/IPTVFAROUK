import { Play, Star, Image as ImageIcon, Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const ChannelList = ({
  channels,
  onChannelClick,
  onToggleFavorite,
  favorites = [],
  darkMode,
  channelStatuses = new Map(),
}) => {
  const { t } = useLanguage();

  if (!channels || channels.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm md:text-lg">{t("channels.noChannels")}</p>
      </div>
    );
  }

  const isValidUrl = (url) => {
    if (!url) return false;
    const urlLower = url.toLowerCase();
    if (urlLower.includes("placeholder")) return false;
    return urlLower.startsWith("http://") || urlLower.startsWith("https://");
  };

  const getChannelStatus = (url) => {
    if (!channelStatuses || channelStatuses.size === 0) return null;
    return channelStatuses.get(url) || null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
      {channels.map((channel) => {
        const isFavorite = favorites.includes(channel.url);
        const hasValidUrl = isValidUrl(channel.url);
        const status = getChannelStatus(channel.url);
        const isOffline = status && !status.online;

        return (
          <div
            key={channel.id}
            className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow dark:shadow-none border border-transparent dark:border-gray-700 hover:shadow-md transition-all ${
              !hasValidUrl || isOffline ? "opacity-50" : ""
            } ${status?.online ? "border-emerald-200 dark:border-emerald-800" : ""}`}
          >
            {/* Logo */}
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
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

              {/* Badge de statut */}
              {status ? (
                status.online ? (
                  <div className="absolute top-1.5 left-1.5 channel-status-live flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    <span className="live-dot"></span>
                    {t("checker.live")}
                  </div>
                ) : (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    <WifiOff className="w-2.5 h-2.5" />
                    {t("checker.offline")}
                  </div>
                )
              ) : null}

              {!hasValidUrl && (
                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {t("channels.unavailable")}
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
                    ? status?.online
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {status?.online ? (
                  <Wifi className="w-3 h-3 md:w-4 md:h-4" />
                ) : (
                  <Play className="w-3 h-3 md:w-4 md:h-4" />
                )}
                <span className="hidden sm:inline">
                  {hasValidUrl
                    ? t("channels.play")
                    : t("channels.notAvailable")}
                </span>
              </button>

              <button
                onClick={() => onToggleFavorite(channel.id)}
                className={`px-2 md:px-3 py-2 rounded-lg border transition-colors ${
                  isFavorite
                    ? "bg-yellow-400 border-yellow-500 text-white"
                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100"
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
