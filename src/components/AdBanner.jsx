import { useState, useEffect } from "react";
import { X, TrendingUp, AlertCircle } from "lucide-react";
import {
  loadHybridBanner,
  getHybridStats,
  AD_NETWORKS,
} from "../services/adHybrid";
import { ADS_CONFIG, logConfig } from "../config/ads";

const AdBanner = ({ position = "header", onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [networkUsed, setNetworkUsed] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Logger la config au démarrage (dev only)
    if (import.meta.env.MODE === "development") {
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
    <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 py-3 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center relative">
        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          className="absolute top-0 right-4 z-20 bg-white hover:bg-gray-50 rounded-full p-1.5 shadow-md transition-all border border-gray-200 group hover:border-red-300"
          title="Fermer (30 min)"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" />
        </button>

        {/* Container principal */}
        <div className="flex flex-col items-center justify-center w-full">
          {/* Chargement */}
          {isLoading && (
            <div className="flex items-center justify-center w-full max-w-3xl h-24 bg-white rounded-lg border-2 border-dashed border-gray-300 shadow-sm">
              <div className="text-center">
                <div className="relative w-10 h-10 mx-auto mb-2">
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <TrendingUp className="absolute inset-0 m-auto w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Connexion au réseau publicitaire...
                </p>
              </div>
            </div>
          )}

          {/* Erreur de chargement */}
          {loadError && !isLoading && (
            <div className="flex items-center justify-center w-full max-w-3xl h-24 bg-red-50 rounded-lg border-2 border-red-200">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-700 font-medium">
                  Impossible de charger la publicité
                </p>
                <button
                  onClick={loadHybridAd}
                  className="text-xs text-red-600 underline mt-1 hover:text-red-700"
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

          {/* Badge + Stats */}
          {!isLoading && !loadError && networkUsed && (
            <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
              {/* Badge réseau */}
              <div
                className={`${badge.color} border px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm`}
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>

              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>

              {/* Mention */}
              <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600 font-medium">
                Publicité
              </div>

              {/* Stats (dev only) */}
              {process.env.NODE_ENV === "development" && (
                <>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <button
                    onClick={() => {
                      const stats = getHybridStats();
                      console.table(stats);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded text-xs text-gray-600 transition-colors"
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
