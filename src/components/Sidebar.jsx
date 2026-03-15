import {
  Home,
  Star,
  Clock,
  Grid,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSelector from "./LanguageSelector";

const Sidebar = ({
  groups,
  selectedGroup,
  onGroupSelect,
  showFavorites,
  onShowFavorites,
  showHistory,
  onShowHistory,
  onExport,
  darkMode,
  toggleDarkMode,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (callback) => {
    callback();
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton Menu Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        aria-label={
          isOpen
            ? t("sidebar.closeMenu") || "Fermer le menu"
            : t("sidebar.openMenu") || "Ouvrir le menu"
        }
      >
        {isOpen ? (
          <X className="w-6 h-6" aria-hidden="true" />
        ) : (
          <Menu className="w-6 h-6" aria-hidden="true" />
        )}
      </button>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative
          inset-y-0 left-0
          w-72 lg:w-64
          bg-white dark:bg-gray-800 shadow-lg
          h-screen overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-6 pt-16 lg:pt-0">
            <h1 className="text-2xl font-bold text-blue-600">
              {t("app.title")}
            </h1>
            <p className="text-xs text-gray-500 mt-1">{t("app.subtitle")}</p>
          </div>

          {/* Navigation principale */}
          <nav
            className="space-y-2 mb-6"
            aria-label={t("sidebar.mainNavigation") || "Navigation principale"}
          >
            <button
              onClick={() =>
                handleNavigation(() => {
                  onGroupSelect("Toutes");
                  onShowFavorites(false);
                  onShowHistory(false);
                })
              }
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                !showFavorites &&
                !showHistory &&
                selectedGroup === "Toutes"
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              aria-current={
                !showFavorites &&
                !showHistory &&
                selectedGroup === "Toutes"
                  ? "page"
                  : undefined
              }
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              <span>{t("sidebar.allChannels")}</span>
            </button>

            <button
              onClick={() =>
                handleNavigation(() => {
                  onShowFavorites(true);
                  onShowHistory(false);
                })
              }
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                showFavorites
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              aria-current={showFavorites ? "page" : undefined}
            >
              <Star className="w-5 h-5" aria-hidden="true" />
              <span>{t("sidebar.favorites")}</span>
            </button>

            <button
              onClick={() =>
                handleNavigation(() => {
                  onShowHistory(true);
                  onShowFavorites(false);
                })
              }
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                showHistory
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              aria-current={showHistory ? "page" : undefined}
            >
              <Clock className="w-5 h-5" aria-hidden="true" />
              <span>{t("sidebar.history")}</span>
            </button>

            {/* Sélecteur de langue intégré */}
            <div className="px-4 py-2">
              <LanguageSelector className="w-full justify-start" align="left" />
            </div>
          </nav>

          {/* Liste des catégories */}
          {groups.length > 0 && (
            <div className="space-y-1 max-h-96 overflow-y-auto mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-4 py-1">
                {t("sidebar.categories")}
              </p>
              {groups.map((group) => (
                <button
                  key={group}
                  onClick={() =>
                    handleNavigation(() => {
                      onGroupSelect(group);
                      onShowFavorites(false);
                      onShowHistory(false);
                    })
                  }
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedGroup === group &&
                    !showFavorites &&
                    !showHistory
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {group.replace(/;/g, " 📺 ")}
                </button>
              ))}
            </div>
          )}

          {/* exemple : bouton toggle (accessible depuis la sidebar aussi) */}
          <div className="px-4 py-2">
            <button
              onClick={toggleDarkMode}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm dark:text-gray-200 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? t("sidebar.lightTheme") : t("sidebar.darkTheme")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
