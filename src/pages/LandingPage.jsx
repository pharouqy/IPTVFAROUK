import { Link } from "react-router-dom";
import { Play, Tv, Globe, Smartphone } from "lucide-react";
import Footer from "../components/Footer";
import ControlButtons from "../components/ControlButtons";
import { useLanguage } from "../i18n/LanguageContext";
import { useState, useEffect, useRef } from "react";

// Hook personnalisé pour l'animation du compteur
const useCountUp = (end, duration = 2000, shouldStart = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Fonction d'easing pour une animation plus naturelle
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart]);

  return count;
};

const LandingPage = () => {
  const { t } = useLanguage();
  const [startCounting, setStartCounting] = useState(false);
  const statsRef = useRef(null);

  // Observer pour détecter quand la section stats est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startCounting) {
          setStartCounting(true);
        }
      },
      { threshold: 0.3 } // Démarre quand 30% de la section est visible
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [startCounting]);

  // Compteurs animés
  const sportsCount = useCountUp(350, 2000, startCounting);
  const entertainmentCount = useCountUp(600, 2500, startCounting);
  const frenchCount = useCountUp(20, 1500, startCounting);
  const arabicCount = useCountUp(100, 2000, startCounting);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#090446] via-[#1a0d6e] to-[#090446]">
      {/* Control Buttons (Theme + Language) */}
      <ControlButtons />

      {/* Skip to main content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#090446] focus:rounded-lg focus:shadow-lg"
      >
        {t("landing.skipToContent")}
      </a>

      {/* Hero Section */}
      <main id="main-content" className="flex-1" role="main">
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Logo et Titre */}
          <header className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img
                src="/iptvfarouk.svg"
                alt={t("landing.logoAlt")}
                className="w-32 h-32 md:w-48 md:h-48 animate-pulse"
                width="192"
                height="192"
                loading="eager"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {t("landing.title")}{" "}
              <span className="text-[#feb95f]">{t("landing.appName")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              {t("landing.subtitle")}
            </p>
          </header>

          {/* Features Section */}
          <section aria-labelledby="features-heading">
            <h2 id="features-heading" className="sr-only">
              {t("landing.featuresHeading")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <article className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Tv
                  className="w-12 h-12 text-[#feb95f] mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-white font-semibold mb-2 text-lg">
                  {t("landing.features.channels.title")}
                </h3>
                <p className="text-gray-300 text-sm">
                  {t("landing.features.channels.description")}
                </p>
              </article>

              <article className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Play
                  className="w-12 h-12 text-[#f71735] mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-white font-semibold mb-2 text-lg">
                  {t("landing.features.streaming.title")}
                </h3>
                <p className="text-gray-300 text-sm">
                  {t("landing.features.streaming.description")}
                </p>
              </article>

              <article className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Globe
                  className="w-12 h-12 text-[#c2095a] mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-white font-semibold mb-2 text-lg">
                  {t("landing.features.multilang.title")}
                </h3>
                <p className="text-gray-300 text-sm">
                  {t("landing.features.multilang.description")}
                </p>
              </article>

              <article className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Smartphone
                  className="w-12 h-12 text-[#feb95f] mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-white font-semibold mb-2 text-lg">
                  {t("landing.features.multidevice.title")}
                </h3>
                <p className="text-gray-300 text-sm">
                  {t("landing.features.multidevice.description")}
                </p>
              </article>
            </div>
          </section>

          {/* Stats Section */}
          <section
            ref={statsRef}
            className="mb-16"
            aria-labelledby="stats-heading"
          >
            <h2 id="stats-heading" className="sr-only">
              Channel Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Sports */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-[#feb95f] mb-2">
                  +{sportsCount}
                </div>
                <div className="text-gray-300 text-sm md:text-base font-medium">
                  {t("landing.stats.sports.label")}
                </div>
              </div>

              {/* Entertainment */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-[#f71735] mb-2">
                  +{entertainmentCount}
                </div>
                <div className="text-gray-300 text-sm md:text-base font-medium">
                  {t("landing.stats.entertainment.label")}
                </div>
              </div>

              {/* French TNT */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-[#c2095a] mb-2">
                  +{frenchCount}
                </div>
                <div className="text-gray-300 text-sm md:text-base font-medium">
                  {t("landing.stats.french.label")}
                </div>
              </div>

              {/* Arabic */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-[#feb95f] mb-2">
                  +{arabicCount}
                </div>
                <div className="text-gray-300 text-sm md:text-base font-medium">
                  {t("landing.stats.arabic.label")}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Button */}
          <div className="text-center mb-16">
            <Link
              to="/app"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#f71735] to-[#c2095a] hover:from-[#c2095a] hover:to-[#f71735] text-white font-bold text-lg px-8 py-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#feb95f] focus:ring-opacity-50"
              aria-label={t("landing.ctaAriaLabel")}
            >
              <Play className="w-6 h-6" aria-hidden="true" />
              {t("landing.ctaButton")}
            </Link>
          </div>

          {/* Disclaimer */}
          <aside
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            role="note"
            aria-labelledby="disclaimer-heading"
          >
            <h2
              id="disclaimer-heading"
              className="text-[#feb95f] font-semibold mb-3 text-center text-lg"
            >
              <span aria-label="Attention">⚠️</span>{" "}
              {t("landing.disclaimerHeading")}
            </h2>
            <p className="text-gray-300 text-sm text-center leading-relaxed">
              {t("landing.disclaimer")}
            </p>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
