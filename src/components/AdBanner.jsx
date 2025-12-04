import { useEffect, useRef, useState } from "react";
import { ADS_CONFIG } from "../config/ads";
import { loadGoogleAdsScript, pushAd } from "../services/googleAds";
import { X } from "lucide-react";

const AdBanner = ({ position = "header", onClose, theme = "dark" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState(false);
  const adRef = useRef(null);

  // Clé unique pour forcer le re-rendu si nécessaire
  const adKey = `google-ad-${position}-${Date.now()}`;

  useEffect(() => {
    if (!ADS_CONFIG.google.enabled || !isVisible) return;

    const initAd = async () => {
      try {
        await loadGoogleAdsScript();
        // Petit délai pour s'assurer que le DOM est prêt
        setTimeout(() => {
          pushAd();
        }, 100);
      } catch (err) {
        console.error("Failed to load ad script", err);
        setError(true);
      }
    };

    initAd();
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible || !ADS_CONFIG.google.enabled) return null;

  if (error) return null; // Ou afficher un fallback discret

  return (
    <div
      className={`w-full py-4 relative flex justify-center items-center min-h-[100px] ${
        theme === "dark" ? "bg-gray-900/50" : "bg-gray-50"
      }`}
    >
      {/* Bouton fermer discret */}
      <button
        onClick={handleClose}
        className="absolute top-1 right-1 p-1 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Fermer la publicité"
      >
        <X
          size={14}
          className={theme === "dark" ? "text-white" : "text-black"}
        />
      </button>

      {/* Container Google Ads */}
      <div className="ad-container overflow-hidden" key={adKey}>
        {ADS_CONFIG.google.testMode ? (
          // Placeholder visuel pour le mode développement
          <div className="border-2 border-dashed border-gray-500 p-4 text-center text-sm text-gray-500 rounded w-[728px] h-[90px] flex items-center justify-center">
            <p>
              Google Ads Placeholder (Dev Mode)
              <br />
              Slot: {ADS_CONFIG.google.slots.banner}
            </p>
          </div>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={ADS_CONFIG.google.clientId}
            data-ad-slot={ADS_CONFIG.google.slots.banner}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
