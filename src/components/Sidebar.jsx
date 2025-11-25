import { Home, Star, Clock, Grid, Download } from "lucide-react";

const Sidebar = ({
  groups,
  selectedGroup,
  onGroupSelect,
  showFavorites,
  onShowFavorites,
  showHistory,
  onShowHistory,
  onExport,
}) => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">IPTV Player</h1>

        {/* Navigation principale */}
        <nav className="space-y-2 mb-6">
          <button
            onClick={() => {
              onGroupSelect("Toutes");
              onShowFavorites(false);
              onShowHistory(false);
            }}
            className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
              !showFavorites && !showHistory && selectedGroup === "Toutes"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <Home className="w-5 h-5" />
            Toutes les chaînes
          </button>

          <button
            onClick={() => {
              onShowFavorites(true);
              onShowHistory(false);
            }}
            className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
              showFavorites ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
          >
            <Star className="w-5 h-5" />
            Favoris
          </button>

          <button
            onClick={() => {
              onShowHistory(true);
              onShowFavorites(false);
            }}
            className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
              showHistory ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
          >
            <Clock className="w-5 h-5" />
            Historique
          </button>
        </nav>

        {/* Catégories */}
        {groups.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-3 text-gray-600">
              <Grid className="w-4 h-4" />
              <h2 className="font-semibold text-sm uppercase">Catégories</h2>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {groups.map((group) => (
                <button
                  key={group}
                  onClick={() => {
                    onGroupSelect(group);
                    onShowFavorites(false);
                    onShowHistory(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                    selectedGroup === group && !showFavorites && !showHistory
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Export */}
        {/*{groups.length > 0 && (
          <button
            onClick={onExport}
            className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter M3U
          </button>
        )}*/}
      </div>
    </div>
  );
};

export default Sidebar;
