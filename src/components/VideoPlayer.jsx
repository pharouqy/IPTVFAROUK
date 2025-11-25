import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { X, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

const VideoPlayer = ({ channel, onClose }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !videoRef.current || !channel) return;

    const videoElement = videoRef.current;
    if (!videoElement.parentElement) return;

    console.log("🎬 Initialisation:", channel.name);
    setIsLoading(true);
    setError(null);

    const player = videojs(videoElement, {
      controls: true,
      autoplay: "muted",
      preload: "auto",
      liveui: true,
      responsive: true,
      fluid: true,
      aspectRatio: "16:9",
      controlBar: {
        volumePanel: {
          inline: false,
        },
      },
      html5: {
        vhs: {
          overrideNative: true,
          enableLowInitialPlaylist: true,
          withCredentials: false,
          handleManifestRedirects: true,
          bandwidth: 4194304,
          experimentalBufferBasedABR: true,
          smoothQualityChange: true,
        },
      },
    });

    playerRef.current = player;

    player.src({
      src: channel.url,
      type: getStreamType(channel.url),
    });

    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        setError({
          message: "Timeout de chargement",
          details: "Le stream prend trop de temps à répondre",
        });
        setIsLoading(false);
      }
    }, 30000);

    player.on("loadstart", () => {
      setIsLoading(true);
      setError(null);
    });

    player.on("loadedmetadata", () => {
      clearTimeout(loadTimeout);
    });

    player.on("loadeddata", () => {
      setIsLoading(false);
    });

    player.on("canplay", () => {
      setIsLoading(false);
      player.muted(false);
      player.play().catch(() => {
        player.muted(true);
        player.play();
      });
    });

    player.on("playing", () => {
      setError(null);
      setIsLoading(false);
    });

    player.on("error", () => {
      clearTimeout(loadTimeout);
      const err = player.error();
      setIsLoading(false);

      if (err) {
        const messages = {
          1: {
            message: "Chargement abandonné",
            details: "Le chargement a été interrompu",
          },
          2: {
            message: "Erreur réseau",
            details: "Impossible de charger le stream",
          },
          3: {
            message: "Erreur de décodage",
            details: "Format vidéo incompatible",
          },
          4: {
            message: "Stream non disponible",
            details: "Le stream est inaccessible ou hors ligne",
          },
        };
        setError(
          messages[err.code] || { message: "Erreur inconnue", details: "" }
        );
      }
    });

    return () => {
      clearTimeout(loadTimeout);
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [channel, isReady, retryCount]);

  const getStreamType = (url) => {
    const u = url.toLowerCase();
    if (u.includes(".m3u8")) return "application/x-mpegURL";
    if (u.includes(".mpd")) return "application/dash+xml";
    if (u.includes(".mp4")) return "video/mp4";
    if (u.includes(".webm")) return "video/webm";
    if (u.includes(".m3u")) return "application/x-mpegURL";
    return "application/x-mpegURL";
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    setIsLoading(true);
  };

  const openInNewTab = () => {
    window.open(channel.url, "_blank");
  };

  if (!channel) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-b from-black via-black/90 to-transparent p-4 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {channel.logo && (
              <img
                src={channel.logo}
                alt=""
                className="w-10 h-10 object-contain rounded bg-white/10 p-1"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <div>
              <h3 className="font-semibold text-white text-sm">
                {channel.name}
              </h3>
              <p className="text-xs text-gray-400">{channel.group}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message de chargement */}
        {isLoading && !error && (
          <div className="mt-3 bg-blue-900/90 backdrop-blur border border-blue-500 text-white p-2 rounded-lg flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />
            <span>Chargement du stream...</span>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="mt-3 bg-red-900/90 backdrop-blur border border-red-500 text-white p-3 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-xs">{error.message}</p>
                <p className="text-xs text-red-200 mt-1">{error.details}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleRetry}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Réessayer
              </button>
              <button
                onClick={openInNewTab}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Ouvrir
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video Container - PAS de z-index ici */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-black px-4 py-2"
      >
        <div className="w-full h-full max-w-7xl">
          <div data-vjs-player className="w-full h-full">
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered"
              playsInline
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3 z-30">
        <div className="flex flex-wrap gap-2 text-xs text-gray-400 justify-center mb-2">
          {channel.country && <span>🌍 {channel.country}</span>}
          {channel.language && <span>🗣️ {channel.language}</span>}
          <span>
            🔗 {getStreamType(channel.url).split("/")[1]?.toUpperCase()}
          </span>
        </div>
        <p className="text-center text-gray-500 text-xs">
          <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">ESC</kbd> pour
          fermer
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
