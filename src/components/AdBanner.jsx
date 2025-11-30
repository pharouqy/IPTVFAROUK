import { useState, useEffect } from "react";
import { X, TrendingUp, AlertCircle } from "lucide-react";
import {
  loadHybridBanner,
  getHybridStats,
  AD_NETWORKS,
} from "../services/adHybrid";
import { ADS_CONFIG, logConfig } from "../config/ads";

const AdBanner = ({ position = "header", onClose, theme = "dark" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [networkUsed, setNetworkUsed] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Logger la config au démarrage (dev only)
    if (import.meta.env.VITE_MODE === "development") {
      logConfig();
    }

    // Vérifier si la bannière a été fermée
    const closedTime = localStorage.getItem("adBannerClosed");
    if (closedTime) {
      const timeSinceClosed = Date.now() - parseInt(closedTime);
      const thirtyMinutes = 30 * 60 * 1000;

      if (timeSinceClosed < thirtyMinutes) {
        setIsVisible(false);
        return;
      }
    }

    // Charger la publicité
    loadHybridAd();
  }, []);

  const loadHybridAd = async () => {
    setIsLoading(true);
    setLoadError(false);

    try {
      const network = await loadHybridBanner("hybrid-banner-container");
      setNetworkUsed(network);
      console.log(`✅ Bannière affichée via: ${network}`);
    } catch (error) {
      console.error("❌ Erreur fatale chargement bannière:", error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("adBannerClosed", Date.now().toString());

    if (onClose) {
      onClose();
    }

    console.log("🚫 Bannière fermée (30 min)");
  };

  const getNetworkBadge = () => {
    const badges = {
      [AD_NETWORKS.ADMAVEN]: {
        text: "AdMaven",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: "🎯",
      },
      [AD_NETWORKS.AADS]: {
        text: "A-Ads",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: "🪙",
      },
      [AD_NETWORKS.FALLBACK]: {
        text: "Promo",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: "💎",
      },
    };

    return badges[networkUsed] || badges[AD_NETWORKS.FALLBACK];
  };

  if (!isVisible) return null;

  const badge = getNetworkBadge();

  return (
    <div
      className={`w-full py-3 relative ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700"
          : "bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center relative">
        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          className={`absolute top-0 right-4 z-20 rounded-full p-1.5 shadow-md transition-all border group ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-red-400"
              : "bg-white hover:bg-gray-50 border-gray-200 hover:border-red-300"
          }`}
          title="Fermer (30 min)"
        >
          <X
            className={`w-4 h-4 transition-colors ${
              theme === "dark"
                ? "text-gray-300 group-hover:text-red-400"
                : "text-gray-600 group-hover:text-red-500"
            }`}
          />
        </button>

        {/* Container principal */}
        <div className="flex flex-col items-center justify-center w-full">
          {/* Chargement */}
          {isLoading && (
            <div
              className={`flex items-center justify-center w-full max-w-3xl h-24 rounded-lg border-2 border-dashed shadow-sm ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            >
              <div className="text-center">
                <div className="relative w-10 h-10 mx-auto mb-2">
                  <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <TrendingUp className="absolute inset-0 m-auto w-5 h-5 text-blue-500" />
                </div>
                <p
                  className={`text-xs font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Connexion au réseau publicitaire...
                </p>
              </div>
            </div>
          )}

          {/* Erreur de chargement */}
          {loadError && !isLoading && (
            <div
              className={`flex items-center justify-center w-full max-w-3xl h-24 rounded-lg border-2 ${
                theme === "dark"
                  ? "bg-red-900/30 border-red-700"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="text-center">
                <AlertCircle
                  className={`w-8 h-8 mx-auto mb-2 ${
                    theme === "dark" ? "text-red-400" : "text-red-500"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-red-300" : "text-red-700"
                  }`}
                >
                  Impossible de charger la publicité
                </p>
                <button
                  onClick={loadHybridAd}
                  className={`text-xs underline mt-1 ${
                    theme === "dark"
                      ? "text-red-400 hover:text-red-300"
                      : "text-red-600 hover:text-red-700"
                  }`}
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Container de la pub */}
          <div
            id="hybrid-banner-container"
            className={`flex items-center justify-center w-full transition-all duration-300 ${
              isLoading || loadError
                ? "opacity-0 h-0 overflow-hidden"
                : "opacity-100"
            }`}
          >
            {/* Pub injectée ici */}
          </div>

          {/* Badge + Stats - Affichage en développement uniquement */}
          {!isLoading &&
            !loadError &&
            networkUsed &&
            process.env.NODE_ENV !== "production" && (
              <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
                {/* Badge réseau */}
                <div
                  className={`${badge.color} border px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm`}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>

                <div
                  className={`w-1 h-1 rounded-full ${
                    theme === "dark" ? "bg-gray-500" : "bg-gray-300"
                  }`}
                ></div>

                {/* Mention */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Publicité
                </div>

                {/* Stats (dev only) */}
                {process.env.NODE_ENV === "development" && (
                  <>
                    <div
                      className={`w-1 h-1 rounded-full ${
                        theme === "dark" ? "bg-gray-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <button
                      onClick={() => {
                        const stats = getHybridStats();
                        console.table(stats);
                      }}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      📊 Logs
                    </button>
                  </>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
