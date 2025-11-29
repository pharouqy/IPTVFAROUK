import { useState, useEffect, useRef } from 'react';
import { X, Play, Volume2, VolumeX } from 'lucide-react';

const AdPreroll = ({ onComplete, onSkip }) => {
  const [countdown, setCountdown] = useState(5); // Secondes avant "Skip"
  const [canSkip, setCanSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Démarrer le compte à rebours
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-play de la vidéo
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log('Autoplay bloqué - nécessite interaction utilisateur');
      });
    }

    return () => clearInterval(timer);
  }, []);

  const handleSkip = () => {
    console.log('⏭️ Publicité passée');
    if (onSkip) onSkip();
  };

  const handleVideoEnd = () => {
    console.log('✅ Publicité terminée');
    if (onComplete) onComplete();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center">
      {/* Header avec info */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm font-medium">Publicité</p>
            <p className="text-xs text-gray-300">
              Votre chaîne démarre ensuite
            </p>
          </div>
          
          {canSkip ? (
            <button
              onClick={handleSkip}
              className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Passer la pub
            </button>
          ) : (
            <div className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold">
              Passer dans {countdown}s
            </div>
          )}
        </div>
      </div>

      {/* Zone vidéo */}
      <div className="w-full max-w-4xl aspect-video bg-black relative">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onEnded={handleVideoEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
          autoPlay
          muted={isMuted}
        >
          {/* SOURCE VIDÉO DE TEST */}
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
          Votre navigateur ne supporte pas la vidéo HTML5.
        </video>

        {/* Contrôles personnalisés */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
          >
            {isPlaying ? (
              <div className="w-4 h-4 flex gap-1">
                <div className="w-1 bg-white"></div>
                <div className="w-1 bg-white"></div>
              </div>
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Texte */}
          <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            Publicité
          </span>
        </div>
      </div>

      {/* Footer avec mention */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-sm">
            💡 <span className="text-yellow-400">Conseil :</span> Passez en mode Premium pour profiter sans publicité
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdPreroll;