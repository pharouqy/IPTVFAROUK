import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";

const TermsOfService = () => {
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
              Conditions Générales d'Utilisation
            </h1>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  1. Objet
                </h2>
                <p>
                  Les présentes Conditions Générales d'Utilisation (CGU) ont
                  pour objet de définir les modalités et conditions
                  d'utilisation du service IPTV Farouk, ainsi que les droits et
                  obligations des utilisateurs.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  2. Acceptation des conditions
                </h2>
                <p>
                  L'utilisation du service IPTV Farouk implique l'acceptation
                  pleine et entière des présentes CGU. Si vous n'acceptez pas
                  ces conditions, veuillez ne pas utiliser ce service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  3. Description du service
                </h2>
                <p>
                  IPTV Farouk est une application web de lecture de flux IPTV
                  (lecteur M3U). Le service permet aux utilisateurs de :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Charger et lire des playlists M3U</li>
                  <li>Organiser et gérer leurs chaînes favorites</li>
                  <li>Consulter l'historique de visionnage</li>
                  <li>Rechercher et filtrer les chaînes</li>
                </ul>
                <p className="mt-3 font-semibold text-[#f71735]">
                  ⚠️ Important : IPTV Farouk ne fournit, n'héberge ni ne
                  distribue aucun contenu audiovisuel. L'application est
                  uniquement un lecteur permettant de lire des playlists M3U
                  fournies par l'utilisateur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  4. Responsabilités de l'utilisateur
                </h2>
                <p className="mb-3">
                  En utilisant IPTV Farouk, vous vous engagez à :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Utiliser le service uniquement pour visionner du contenu
                    pour lequel vous disposez des droits légaux d'accès
                  </li>
                  <li>
                    Ne pas utiliser le service pour accéder à du contenu protégé
                    par le droit d'auteur sans autorisation
                  </li>
                  <li>
                    Respecter toutes les lois et réglementations applicables
                    dans votre pays
                  </li>
                  <li>
                    Ne pas utiliser le service à des fins illégales ou
                    frauduleuses
                  </li>
                  <li>
                    Ne pas tenter de contourner les mesures de sécurité du
                    service
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  5. Limitation de responsabilité
                </h2>
                <p>IPTV Farouk décline toute responsabilité concernant :</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>
                    Le contenu des flux IPTV accessibles via l'application
                  </li>
                  <li>
                    L'utilisation illégale du service par les utilisateurs
                  </li>
                  <li>
                    Les interruptions de service, bugs ou dysfonctionnements
                    techniques
                  </li>
                  <li>La perte de données ou de favoris stockés localement</li>
                  <li>
                    Les dommages directs ou indirects résultant de l'utilisation
                    du service
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  6. Propriété intellectuelle
                </h2>
                <p>
                  L'ensemble des éléments du service IPTV Farouk (code source,
                  design, logo, etc.) sont protégés par le droit d'auteur. Toute
                  reproduction, modification ou distribution non autorisée est
                  interdite.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  7. Données personnelles
                </h2>
                <p>
                  Le traitement de vos données personnelles est régi par notre{" "}
                  <Link
                    to="/politique-confidentialite"
                    className="text-[#f71735] hover:underline font-semibold"
                  >
                    Politique de Confidentialité
                  </Link>
                  . En utilisant le service, vous acceptez cette politique.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  8. Publicités
                </h2>
                <p>
                  Le service IPTV Farouk affiche des publicités via Google Ads
                  et d'autres partenaires publicitaires. Ces publicités
                  permettent de financer le service gratuit. En utilisant le
                  service, vous acceptez l'affichage de ces publicités.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  9. Disponibilité du service
                </h2>
                <p>
                  IPTV Farouk s'efforce de maintenir le service accessible
                  24h/24 et 7j/7, mais ne garantit pas une disponibilité
                  continue. Le service peut être interrompu pour maintenance,
                  mises à jour ou pour toute autre raison technique sans
                  préavis.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  10. Modification des CGU
                </h2>
                <p>
                  IPTV Farouk se réserve le droit de modifier les présentes CGU
                  à tout moment. Les modifications seront publiées sur cette
                  page avec une nouvelle date de mise à jour. Il est de votre
                  responsabilité de consulter régulièrement cette page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  11. Résiliation
                </h2>
                <p>
                  IPTV Farouk se réserve le droit de suspendre ou de résilier
                  l'accès au service à tout utilisateur qui ne respecterait pas
                  les présentes CGU, sans préavis et sans indemnité.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  12. Droit applicable et juridiction
                </h2>
                <p>
                  Les présentes CGU sont régies par le droit français. En cas de
                  litige, et après échec de toute tentative de règlement
                  amiable, les tribunaux français seront seuls compétents.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  13. Contact
                </h2>
                <p>
                  Pour toute question concernant ces CGU, vous pouvez nous
                  contacter via{" "}
                  <a
                    href="https://github.com/pharouqy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f71735] hover:underline"
                  >
                    GitHub - pharouqy
                  </a>
                  .
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

export default TermsOfService;
