import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

const TermsOfService = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Bouton retour */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#2563eb] hover:text-[#f71735] dark:text-blue-400 dark:hover:text-[#f71735] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("legal.backToHome")}
          </Link>

          {/* Contenu */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 transition-colors duration-200">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2563eb] dark:text-blue-400 mb-8">
              {t("legal.termsOfService.title")}
            </h1>

            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              {/* 1. Objet */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.purpose.title")}
                </h2>
                <p>{t("legal.termsOfService.purpose.content")}</p>
              </section>

              {/* 2. Acceptation des conditions */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.acceptance.title")}
                </h2>
                <p>{t("legal.termsOfService.acceptance.content")}</p>
              </section>

              {/* 3. Description du service */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.description.title")}
                </h2>
                <p>{t("legal.termsOfService.description.intro")}</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>{t("legal.termsOfService.description.load")}</li>
                  <li>{t("legal.termsOfService.description.organize")}</li>
                  <li>{t("legal.termsOfService.description.history")}</li>
                  <li>{t("legal.termsOfService.description.search")}</li>
                </ul>
                <p className="mt-3 font-semibold text-[#f71735]">
                  {t("legal.termsOfService.description.important")}
                </p>
              </section>

              {/* 4. Responsabilités de l'utilisateur */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.userResponsibility.title")}
                </h2>
                <p className="mb-3">
                  {t("legal.termsOfService.userResponsibility.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t("legal.termsOfService.userResponsibility.legal")}</li>
                  <li>
                    {t("legal.termsOfService.userResponsibility.copyright")}
                  </li>
                  <li>{t("legal.termsOfService.userResponsibility.laws")}</li>
                  <li>
                    {t("legal.termsOfService.userResponsibility.illegal")}
                  </li>
                  <li>
                    {t("legal.termsOfService.userResponsibility.security")}
                  </li>
                </ul>
              </section>

              {/* 5. Limitation de responsabilité */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.limitation.title")}
                </h2>
                <p>{t("legal.termsOfService.limitation.intro")}</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>{t("legal.termsOfService.limitation.content")}</li>
                  <li>{t("legal.termsOfService.limitation.illegalUse")}</li>
                  <li>{t("legal.termsOfService.limitation.interruptions")}</li>
                  <li>{t("legal.termsOfService.limitation.dataLoss")}</li>
                  <li>{t("legal.termsOfService.limitation.damages")}</li>
                </ul>
              </section>

              {/* 6. Propriété intellectuelle */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.ip.title")}
                </h2>
                <p>{t("legal.termsOfService.ip.content")}</p>
              </section>

              {/* 7. Données personnelles */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.privacy.title")}
                </h2>
                <p>
                  {t("legal.termsOfService.privacy.content")}{" "}
                  <Link
                    to="/politique-confidentialite"
                    className="text-[#f71735] hover:underline font-semibold"
                  >
                    {t("legal.termsOfService.privacy.link")}
                  </Link>
                  {t("legal.termsOfService.privacy.acceptance")}
                </p>
              </section>

              {/* 8. Publicités */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.advertising.title")}
                </h2>
                <p>{t("legal.termsOfService.advertising.content")}</p>
              </section>

              {/* 9. Disponibilité du service */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.availability.title")}
                </h2>
                <p>{t("legal.termsOfService.availability.content")}</p>
              </section>

              {/* 10. Modification des CGU */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.modifications.title")}
                </h2>
                <p>{t("legal.termsOfService.modifications.content")}</p>
              </section>

              {/* 11. Résiliation */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.termination.title")}
                </h2>
                <p>{t("legal.termsOfService.termination.content")}</p>
              </section>

              {/* 12. Droit applicable et juridiction */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.law.title")}
                </h2>
                <p>{t("legal.termsOfService.law.content")}</p>
              </section>

              {/* 13. Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.termsOfService.contact.title")}
                </h2>
                <p>
                  {t("legal.termsOfService.contact.content")}{" "}
                  <a
                    href="https://github.com/pharouqy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f71735] hover:underline"
                  >
                    {t("legal.termsOfService.contact.github")}
                  </a>
                  .
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("legal.lastUpdate")} {new Date().toLocaleDateString()}
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
