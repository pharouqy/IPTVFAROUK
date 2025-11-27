import { Home, Star, Clock, Grid, Download, Menu, X } from 'lucide-react';
import { useState } from 'react';

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
  toggleDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (callback) => {
    callback();
    setIsOpen(false); // Fermer le menu mobile après navigation
  };

  return (
    <>
      {/* Bouton Menu Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-6 pt-16 lg:pt-0">
            <h1 className="text-2xl font-bold text-blue-600">IPTV Player</h1>
            <p className="text-xs text-gray-500 mt-1">Playlist chargée automatiquement</p>
          </div>

          {/* Navigation principale */}
          <nav className="space-y-2 mb-6">
            <button
              onClick={() => handleNavigation(() => {
                onGroupSelect('Toutes');
                onShowFavorites(false);
                onShowHistory(false);
              })}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                !showFavorites && !showHistory && selectedGroup === 'Toutes'
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Toutes les chaînes</span>
            </button>

            <button
              onClick={() => handleNavigation(() => {
                onShowFavorites(true);
                onShowHistory(false);
              })}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                showFavorites
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Star className="w-5 h-5" />
              <span>Favoris</span>
            </button>

            <button
              onClick={() => handleNavigation(() => {
                onShowHistory(true);
                onShowFavorites(false);
              })}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                showHistory
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>Historique</span>
            </button>
          </nav>

          {/* Catégories */}
          {groups.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3 text-gray-600">
                <Grid className="w-4 h-4" />
                <h2 className="font-semibold text-sm uppercase">Catégories</h2>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {groups.length}
                </span>
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => handleNavigation(() => {
                      onGroupSelect(group);
                      onShowFavorites(false);
                      onShowHistory(false);
                    })}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedGroup === group && !showFavorites && !showHistory
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {group.replace(/;/g, ' 📺 ')}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Export 
          {groups.length > 0 && (
            <button
              onClick={() => {
                onExport();
                setIsOpen(false);
              }}
              className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Download className="w-4 h-4" />
              Exporter M3U
            </button>
          )}*/}

          {/* exemple : bouton toggle (accessible depuis la sidebar aussi) */}
          <div className="px-4 py-2">
            <button
              onClick={toggleDarkMode}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm dark:text-gray-200 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? "Thème clair" : "Thème sombre"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;