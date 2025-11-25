import { Play, Star, Image as ImageIcon, Circle } from 'lucide-react';

const ChannelList = ({ channels, onChannelClick, onToggleFavorite, favorites = [] }) => {
  if (!channels || channels.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Aucune chaîne à afficher</p>
      </div>
    );
  }

  // Fonction pour vérifier si l'URL semble valide
  const isValidUrl = (url) => {
    if (!url) return false;
    const urlLower = url.toLowerCase();
    // Vérifier si ce n'est pas un placeholder
    if (urlLower.includes('placeholder')) return false;
    // Vérifier si c'est une vraie URL
    return urlLower.startsWith('http://') || urlLower.startsWith('https://');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {channels.map((channel) => {
        const isFavorite = favorites.includes(channel.id);
        const hasValidUrl = isValidUrl(channel.url);
        
        return (
          <div
            key={channel.id}
            className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col ${
              !hasValidUrl ? 'opacity-60' : ''
            }`}
          >
            {/* Logo */}
            <div className="relative w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {channel.logo ? (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="hidden items-center justify-center w-full h-full">
                <ImageIcon className="w-12 h-12 text-gray-300" />
              </div>
              
              {/* Indicateur de statut */}
              {!hasValidUrl && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Indisponible
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                {channel.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{channel.group}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onChannelClick(channel)}
                disabled={!hasValidUrl}
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  hasValidUrl
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4" />
                {hasValidUrl ? 'Lire' : 'Indisponible'}
              </button>
              <button
                onClick={() => onToggleFavorite(channel.id)}
                className={`px-3 py-2 rounded-lg border ${
                  isFavorite
                    ? 'bg-yellow-400 border-yellow-500 text-white'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChannelList;