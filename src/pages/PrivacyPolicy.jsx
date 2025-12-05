import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
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
              Politique de Confidentialité
            </h1>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  1. Introduction
                </h2>
                <p>
                  La présente politique de confidentialité a pour but de vous
                  informer sur la manière dont IPTV Farouk collecte, utilise et
                  protège vos données personnelles conformément au Règlement
                  Général sur la Protection des Données (RGPD).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  2. Données collectées
                </h2>
                <p className="mb-3">
                  IPTV Farouk collecte les données suivantes :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Données de navigation :</strong> adresse IP, type de
                    navigateur, pages visitées, durée de visite (via Google
                    Analytics)
                  </li>
                  <li>
                    <strong>Données de stockage local :</strong> préférences
                    utilisateur, favoris, historique de visionnage (stockées
                    localement dans votre navigateur)
                  </li>
                  <li>
                    <strong>Données publicitaires :</strong> interactions avec
                    les publicités (via Google Ads et partenaires publicitaires)
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  3. Utilisation des données
                </h2>
                <p className="mb-3">
                  Les données collectées sont utilisées pour :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Améliorer l'expérience utilisateur et le fonctionnement du
                    service
                  </li>
                  <li>
                    Analyser le trafic et l'utilisation du site (Google
                    Analytics)
                  </li>
                  <li>Personnaliser les publicités affichées (Google Ads)</li>
                  <li>Assurer la sécurité et la stabilité du service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  4. Cookies et technologies similaires
                </h2>
                <p className="mb-3">Notre site utilise des cookies pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Cookies essentiels :</strong> nécessaires au
                    fonctionnement du site
                  </li>
                  <li>
                    <strong>Cookies analytiques :</strong> Google Analytics pour
                    mesurer l'audience
                  </li>
                  <li>
                    <strong>Cookies publicitaires :</strong> Google Ads pour
                    afficher des publicités pertinentes
                  </li>
                </ul>
                <p className="mt-3">
                  Vous pouvez gérer vos préférences de cookies dans les
                  paramètres de votre navigateur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  5. Partage des données
                </h2>
                <p>Vos données peuvent être partagées avec :</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>
                    <strong>Google Analytics :</strong> pour l'analyse du trafic
                  </li>
                  <li>
                    <strong>Google Ads :</strong> pour la diffusion de
                    publicités
                  </li>
                  <li>
                    <strong>Vercel :</strong> notre hébergeur (pour le
                    fonctionnement technique)
                  </li>
                </ul>
                <p className="mt-3">
                  Nous ne vendons jamais vos données personnelles à des tiers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  6. Vos droits (RGPD)
                </h2>
                <p className="mb-3">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Droit d'accès :</strong> obtenir une copie de vos
                    données
                  </li>
                  <li>
                    <strong>Droit de rectification :</strong> corriger vos
                    données inexactes
                  </li>
                  <li>
                    <strong>Droit à l'effacement :</strong> demander la
                    suppression de vos données
                  </li>
                  <li>
                    <strong>Droit d'opposition :</strong> vous opposer au
                    traitement de vos données
                  </li>
                  <li>
                    <strong>Droit à la portabilité :</strong> récupérer vos
                    données dans un format structuré
                  </li>
                </ul>
                <p className="mt-3">
                  Pour exercer ces droits, contactez-nous via{" "}
                  <a
                    href="https://github.com/pharouqy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f71735] hover:underline"
                  >
                    GitHub
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  7. Sécurité des données
                </h2>
                <p>
                  Nous mettons en œuvre des mesures de sécurité techniques et
                  organisationnelles appropriées pour protéger vos données
                  contre tout accès non autorisé, perte, destruction ou
                  altération. Les données sont stockées localement dans votre
                  navigateur (LocalStorage) et ne sont pas transmises à nos
                  serveurs.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  8. Conservation des données
                </h2>
                <p>
                  Les données de navigation sont conservées pendant 26 mois
                  maximum (Google Analytics). Les données stockées localement
                  (favoris, historique) restent dans votre navigateur jusqu'à ce
                  que vous les supprimiez manuellement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  9. Modifications de la politique
                </h2>
                <p>
                  Nous nous réservons le droit de modifier cette politique de
                  confidentialité à tout moment. Les modifications seront
                  publiées sur cette page avec une nouvelle date de mise à jour.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] mb-3">
                  10. Contact
                </h2>
                <p>
                  Pour toute question concernant cette politique de
                  confidentialité, vous pouvez nous contacter via{" "}
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

export default PrivacyPolicy;
