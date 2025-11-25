import { useState } from "react";
import { Upload, Link, Loader } from "lucide-react";

const FileUploader = ({ onPlaylistLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState(
    "https://iptv-org.github.io/iptv/languages/fra.m3u"
  );
  const [error, setError] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      await onPlaylistLoaded(file);
    } catch (err) {
      setError("Erreur lors du chargement du fichier", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlLoad = async () => {
    if (!urlInput.trim()) {
      setError("Veuillez entrer une URL valide");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onPlaylistLoaded(urlInput);
    } catch (err) {
      setError("Impossible de charger la playlist depuis cette URL", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Charger une Playlist IPTV
      </h2>

      {/* Chargement depuis URL */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Link className="inline-block w-4 h-4 mr-2" />
          Charger depuis une URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/playlist.m3u"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleUrlLoad}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Chargement...
              </>
            ) : (
              "Charger"
            )}
          </button>
        </div>
      </div>

      {/* Séparateur */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OU</span>
        </div>
      </div>

      {/* Upload fichier local */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Upload className="inline-block w-4 h-4 mr-2" />
          Importer un fichier M3U
        </label>
        <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Cliquez pour sélectionner un fichier
            </p>
            <p className="text-xs text-gray-400 mt-1">Format .m3u ou .m3u8</p>
          </div>
          <input
            type="file"
            accept=".m3u,.m3u8"
            onChange={handleFileUpload}
            className="hidden"
            disabled={loading}
          />
        </label>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
