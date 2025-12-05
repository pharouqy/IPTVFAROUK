import { useState, useEffect } from "react";
import App from "./App";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

const AppWrapper = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Timer minimum de 2 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Callback de l'App
  const handleAppLoadingChange = (loading, initialLoadDone) => {
    if (initialLoadDone) {
      setAppReady(true);
    }
  };

  // Cacher le loading quand les deux conditions sont remplies
  useEffect(() => {
    if (minTimeElapsed && appReady) {
      setShowLoading(false);
    }
  }, [minTimeElapsed, appReady]);

  return (
    <>
      {showLoading && (
        <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />
      )}
      <div className={showLoading ? "hidden" : "flex flex-col min-h-screen"}>
        <div className="flex-1">
          <App onLoadingChange={handleAppLoadingChange} />
        </div>
      </div>
    </>
  );
};

export default AppWrapper;
