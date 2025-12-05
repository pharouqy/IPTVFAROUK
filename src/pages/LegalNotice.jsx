import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";

const LegalNotice = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Bouton retour */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#2563eb] hover:text-[#f71735] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>

          {/* Contenu */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2563eb] mb-8">
              Mentions Légales
            </h1>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  1. Éditeur du site
                </h2>
                <p>
                  <strong>Nom :</strong> IPTV Farouk
                  <br />
                  <strong>Développeur :</strong> Farouk Younsi
                  <br />
                  <strong>Contact :</strong>{" "}
                  <a
                    href="https://github.com/pharouqy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f71735] hover:underline"
                  >
                    GitHub - pharouqy
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  2. Hébergement
                </h2>
                <p>
                  Ce site est hébergé par Vercel Inc.
                  <br />
                  340 S Lemon Ave #4133, Walnut, CA 91789, USA
                  <br />
                  Site web :{" "}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f71735] hover:underline"
                  >
                    vercel.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  3. Propriété intellectuelle
                </h2>
                <p>
                  L'ensemble du contenu de ce site (structure, textes, logos,
                  images, etc.) est la propriété exclusive de IPTV Farouk, sauf
                  mention contraire. Toute reproduction, distribution,
                  modification, adaptation, retransmission ou publication de ces
                  différents éléments est strictement interdite sans l'accord
                  exprès par écrit de IPTV Farouk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  4. Nature du service
                </h2>
                <p>
                  IPTV Farouk est une application de lecture de flux IPTV
                  (lecteur M3U). Nous ne fournissons, n'hébergeons, ni ne
                  distribuons aucun contenu audiovisuel. L'application permet
                  uniquement aux utilisateurs de lire leurs propres playlists
                  M3U.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  5. Responsabilité de l'utilisateur
                </h2>
                <p>
                  L'utilisateur est seul responsable du contenu qu'il choisit de
                  visionner via cette application. Il doit s'assurer qu'il
                  dispose des droits nécessaires pour accéder aux flux IPTV
                  qu'il utilise. IPTV Farouk décline toute responsabilité
                  concernant l'utilisation illégale de contenus protégés par le
                  droit d'auteur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  6. Limitation de responsabilité
                </h2>
                <p>
                  IPTV Farouk ne peut être tenu responsable des dommages directs
                  ou indirects qui pourraient résulter de l'accès au site ou de
                  l'utilisation du service, notamment en cas d'interruption, de
                  dysfonctionnement, de perte de données ou de tout autre
                  problème technique.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  7. Droit applicable
                </h2>
                <p>
                  Les présentes mentions légales sont régies par le droit
                  français. En cas de litige, les tribunaux français seront
                  seuls compétents.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LegalNotice;
