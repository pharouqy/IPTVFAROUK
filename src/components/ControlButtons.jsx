import { Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";
import { useState } from "react";

const ControlButtons = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, availableLanguages, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languageNames = {
    en: "English",
    fr: "Français",
    ar: "العربية",
    es: "Español",
  };

  const languageFlags = {
    en: "🇬🇧",
    fr: "🇫🇷",
    ar: "🇩🇿",
    es: "🇪🇸",
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setShowLanguageMenu(false);
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-3">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="group relative p-3 bg-white/10 dark:bg-gray-800/80 backdrop-blur-lg rounded-full border border-white/20 dark:border-gray-600 hover:bg-white/20 dark:hover:bg-gray-700/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
        aria-label={
          theme === "dark"
            ? t("header.lightMode") || "Light mode"
            : t("header.darkMode") || "Dark mode"
        }
      >
        {theme === "dark" ? (
          <Sun className="w-6 h-6 text-yellow-300" aria-hidden="true" />
        ) : (
          <Moon
            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
            aria-hidden="true"
          />
        )}
        {/* Tooltip */}
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {theme === "dark"
            ? t("header.lightMode") || "Light mode"
            : t("header.darkMode") || "Dark mode"}
        </span>
      </button>

      {/* Language Selector Button */}
      <div className="relative">
        <button
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="group relative p-3 bg-white/10 dark:bg-gray-800/80 backdrop-blur-lg rounded-full border border-white/20 dark:border-gray-600 hover:bg-white/20 dark:hover:bg-gray-700/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
          aria-label="Change language"
          aria-expanded={showLanguageMenu}
          aria-haspopup="true"
        >
          <Globe
            className="w-6 h-6 text-blue-400 dark:text-blue-300"
            aria-hidden="true"
          />
          {/* Tooltip */}
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {languageNames[language]}
          </span>
        </button>

        {/* Language Dropdown Menu */}
        {showLanguageMenu && (
          <>
            {/* Backdrop to close menu */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowLanguageMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-fadeIn bg-white">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    language === lang
                      ? "bg-gradient-to-r from-[#f71735] to-[#c2095a] text-white font-semibold"
                      : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  aria-current={language === lang ? "true" : "false"}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{languageFlags[lang]}</span>
                    <span className="text-lg">{languageNames[lang]}</span>
                    {language === lang && (
                      <span className="ml-auto text-sm">✓</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ControlButtons;
