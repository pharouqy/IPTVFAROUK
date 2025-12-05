import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

const PrivacyPolicy = () => {
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
              {t("legal.privacyPolicy.title")}
            </h1>

            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              {/* 1. Introduction */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.intro.title")}
                </h2>
                <p>{t("legal.privacyPolicy.intro.content")}</p>
              </section>

              {/* 2. Données collectées */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.dataCollected.title")}
                </h2>
                <p className="mb-3">
                  {t("legal.privacyPolicy.dataCollected.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t("legal.privacyPolicy.dataCollected.navigation")}</li>
                  <li>{t("legal.privacyPolicy.dataCollected.localStorage")}</li>
                  <li>{t("legal.privacyPolicy.dataCollected.ads")}</li>
                </ul>
              </section>

              {/* 3. Utilisation des données */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.dataUsage.title")}
                </h2>
                <p className="mb-3">
                  {t("legal.privacyPolicy.dataUsage.intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t("legal.privacyPolicy.dataUsage.improve")}</li>
                  <li>{t("legal.privacyPolicy.dataUsage.analyze")}</li>
                  <li>{t("legal.privacyPolicy.dataUsage.personalize")}</li>
                  <li>{t("legal.privacyPolicy.dataUsage.security")}</li>
                </ul>
              </section>

              {/* 4. Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.cookies.title")}
                </h2>
                <p className="mb-3">{t("legal.privacyPolicy.cookies.intro")}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t("legal.privacyPolicy.cookies.essential")}</li>
                  <li>{t("legal.privacyPolicy.cookies.analytics")}</li>
                  <li>{t("legal.privacyPolicy.cookies.advertising")}</li>
                </ul>
                <p className="mt-3">
                  {t("legal.privacyPolicy.cookies.manage")}
                </p>
              </section>

              {/* 5. Partage des données */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.sharing.title")}
                </h2>
                <p>{t("legal.privacyPolicy.sharing.intro")}</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>{t("legal.privacyPolicy.sharing.analytics")}</li>
                  <li>{t("legal.privacyPolicy.sharing.ads")}</li>
                  <li>{t("legal.privacyPolicy.sharing.hosting")}</li>
                </ul>
                <p className="mt-3">
                  {t("legal.privacyPolicy.sharing.noSell")}
                </p>
              </section>

              {/* 6. Vos droits (RGPD) */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.rights.title")}
                </h2>
                <p className="mb-3">{t("legal.privacyPolicy.rights.intro")}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t("legal.privacyPolicy.rights.access")}</li>
                  <li>{t("legal.privacyPolicy.rights.rectification")}</li>
                  <li>{t("legal.privacyPolicy.rights.erasure")}</li>
                  <li>{t("legal.privacyPolicy.rights.objection")}</li>
                  <li>{t("legal.privacyPolicy.rights.portability")}</li>
                </ul>
                <p className="mt-3">
                  {t("legal.privacyPolicy.rights.exercise")}{" "}
                  <a
                    href="https://github.com/pharouqy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f71735] hover:underline"
                  >
                    {t("legal.privacyPolicy.rights.github")}
                  </a>
                  .
                </p>
              </section>

              {/* 7. Sécurité des données */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.security.title")}
                </h2>
                <p>{t("legal.privacyPolicy.security.content")}</p>
              </section>

              {/* 8. Conservation des données */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.retention.title")}
                </h2>
                <p>{t("legal.privacyPolicy.retention.content")}</p>
              </section>

              {/* 9. Modifications de la politique */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.modifications.title")}
                </h2>
                <p>{t("legal.privacyPolicy.modifications.content")}</p>
              </section>

              {/* 10. Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.privacyPolicy.contact.title")}
                </h2>
                <p>
                  {t("legal.privacyPolicy.contact.content")}{" "}
                  <a
                    href="https://github.com/pharouqy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f71735] hover:underline"
                  >
                    {t("legal.privacyPolicy.contact.github")}
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

export default PrivacyPolicy;
