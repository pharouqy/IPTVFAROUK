import { Link } from "react-router-dom";
import { Play, Tv, Globe, Smartphone } from "lucide-react";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#090446] via-[#1a0d6e] to-[#090446]">
      {/* Skip to main content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#090446] focus:rounded-lg focus:shadow-lg"
      >
        Aller au contenu principal
      </a>

      {/* Hero Section */}
      <main id="main-content" className="flex-1" role="main">
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Logo et Titre */}
          <header className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img
                src="/iptvfarouk.svg"
                alt="Logo IPTV Farouk - Lecteur IPTV moderne et gratuit"
                className="w-32 h-32 md:w-48 md:h-48 animate-pulse"
                width="192"
                height="192"
                loading="eager"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Bienvenue sur <span className="text-[#feb95f]">IPTV Farouk</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Votre lecteur IPTV gratuit pour regarder le monde entier
            </p>
          </header>

          {/* Features Section */}
          <section aria-labelledby="features-heading">
            <h2 id="features-heading" className="sr-only">
              Fonctionnalités principales
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <article className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Tv
                  className="w-12 h-12 text-[#feb95f] mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-white font-semibold mb-2 text-lg">
                  Chaînes TV
                </h3>
                <p className="text-gray-300 text-sm">
                  Accédez à des milliers de chaînes du monde entier
                </p>
              </article>

              <article className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Play
                  className="w-12 h-12 text-[#f71735] mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-white font-semibold mb-2 text-lg">
                  Streaming HD
                </h3>
                <p className="text-gray-300 text-sm">
                  Qualité vidéo haute définition pour une expérience optimale
                </p>
              </article>

              <article className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Globe
                  className="w-12 h-12 text-[#c2095a] mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-white font-semibold mb-2 text-lg">
                  Multi-langues
                </h3>
                <p className="text-gray-300 text-sm">
                  Interface disponible en français, anglais, arabe et espagnol
                </p>
              </article>

              <article className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Smartphone
                  className="w-12 h-12 text-[#feb95f] mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-white font-semibold mb-2 text-lg">
                  Multi-appareils
                </h3>
                <p className="text-gray-300 text-sm">
                  Compatible PC, tablette et smartphone
                </p>
              </article>
            </div>
          </section>

          {/* CTA Button */}
          <div className="text-center mb-16">
            <Link
              to="/app"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#f71735] to-[#c2095a] hover:from-[#c2095a] hover:to-[#f71735] text-white font-bold text-lg px-8 py-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#feb95f] focus:ring-opacity-50"
              aria-label="Accéder à l'interface de lecture IPTV"
            >
              <Play className="w-6 h-6" aria-hidden="true" />
              Accéder à l'interface IPTV
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
              <span aria-label="Attention">⚠️</span> Avertissement Important
            </h2>
            <p className="text-gray-300 text-sm text-center leading-relaxed">
              Cette application est un lecteur IPTV qui permet de lire des
              playlists M3U. Nous ne fournissons, n'hébergeons ni ne distribuons
              aucun contenu. Les utilisateurs sont responsables du contenu
              qu'ils choisissent de visionner et doivent s'assurer qu'ils
              disposent des droits nécessaires pour accéder aux flux.
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
