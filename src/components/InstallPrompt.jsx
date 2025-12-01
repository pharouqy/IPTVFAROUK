import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const InstallPrompt = ({ darkMode, ...props }) => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Empêcher le mini-infobar par défaut
      e.preventDefault();
      // Sauvegarder l'événement pour l'utiliser plus tard
      setDeferredPrompt(e);
      // Afficher notre prompt personnalisé
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Afficher le prompt d'installation
    deferredPrompt.prompt();

    // Attendre le choix de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;

    // Reset
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Sauvegarder le choix pour ne plus afficher pendant 7 jours
    localStorage.setItem("installPromptDismissed", Date.now().toString());
  };

  // Vérifier si l'utilisateur a déjà refusé récemment
  useEffect(() => {
    const dismissed = localStorage.getItem("installPromptDismissed");
    if (dismissed) {
      const dismissedDate = parseInt(dismissed);
      const daysSinceDismissed =
        (Date.now() - dismissedDate) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{t("install.title")}</h3>
            <p className="text-sm text-blue-100 mb-3">
              {t("install.description")}
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                {t("install.install")}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
