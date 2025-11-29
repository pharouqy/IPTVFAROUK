import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AdBanner = ({ 
  position = 'header',
  size = 'leaderboard',
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const closedTime = localStorage.getItem('adBannerClosed');
    if (closedTime) {
      const timeSinceClosed = Date.now() - parseInt(closedTime);
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (timeSinceClosed < thirtyMinutes) {
        setIsVisible(false);
        return;
      }
    }

    loadAdMavenScript();
  }, []);

  const loadAdMavenScript = () => {
    setTimeout(() => {
      const adContainer = document.getElementById('admaven-ad-slot');
      if (adContainer) {
        // Bannière de test CENTRÉE
        adContainer.innerHTML = `
          <div style="
            width: 100%;
            max-width: 728px;
            height: 90px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin: 0 auto;
          ">
            🎯 PUBLICITÉ DE TEST
          </div>
        `;
        setIsLoaded(true);
      }
    }, 1000);
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('adBannerClosed', Date.now().toString());
    
    if (onClose) {
      onClose();
    }
    
    console.log('🚫 Bannière fermée - Réapparaîtra dans 30 minutes');
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gray-100 border-b border-gray-200 py-3 relative">
      {/* Conteneur centré */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center relative">
        
        {/* Bouton fermer - Position absolue */}
        <button
          onClick={handleClose}
          className="absolute top-0 right-4 z-10 bg-white hover:bg-gray-50 rounded-full p-1.5 shadow-md transition-colors border border-gray-200"
          title="Fermer la publicité"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Container de la pub - CENTRÉ */}
        <div className="flex flex-col items-center justify-center w-full">
          
          {/* Zone de chargement */}
          {!isLoaded && (
            <div className="flex items-center justify-center w-full max-w-3xl h-24 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">Chargement de la publicité...</p>
              </div>
            </div>
          )}
          
          {/* La pub s'affichera ici - CENTRÉE */}
          <div 
            id="admaven-ad-slot"
            className="flex items-center justify-center w-full"
          >
            {/* Script AdMaven injecté ici */}
          </div>

          {/* Mention publicitaire */}
          <div className="mt-2 bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-500 font-medium">
            Publicité
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;