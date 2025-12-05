import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const LoadingScreen = ({ onLoadingComplete }) => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animation simple de 0 à 100% en 2 secondes
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete();
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 40); // 50 steps * 40ms = 2000ms

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Gradient animé en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#090446] via-[#1a0d6e] to-[#090446] animate-gradient-shift">
        {/* Overlay avec effet de particules */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f71735] rounded-full filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#feb95f] rounded-full filter blur-[100px] animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#c2095a] rounded-full filter blur-[100px] animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Contenu central */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo animé */}
        <div className="relative">
          <img
            src="/iptvfarouk.svg"
            alt="IPTV Farouk Logo"
            className="w-32 h-32 md:w-48 md:h-48 animate-bounce-slow"
          />
          {/* Cercle lumineux autour du logo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f71735] to-[#feb95f] opacity-20 blur-xl animate-pulse"></div>
        </div>

        {/* Texte de chargement */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-fade-in">
            IPTV Farouk
          </h2>
          <p className="text-gray-300 text-sm md:text-base animate-fade-in delay-200">
            {t("loading.channels")}
          </p>
        </div>

        {/* Barre de progression */}
        <div className="w-64 md:w-80 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-[#f71735] via-[#c2095a] to-[#feb95f] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Pourcentage */}
        <div className="text-white text-lg font-semibold animate-fade-in delay-300">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
