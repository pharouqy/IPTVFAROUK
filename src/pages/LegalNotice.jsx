import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

const LegalNotice = () => {
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
              {t("legal.legalNotice.title")}
            </h1>

            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.legalNotice.publisher.title")}
                </h2>
                <p>
                  <strong>{t("legal.legalNotice.publisher.name")}</strong> IPTV
                  Farouk
                  <br />
                  <strong>
                    {t("legal.legalNotice.publisher.developer")}
                  </strong>{" "}
                  Farouk Younsi
                  <br />
                  <strong>
                    {t("legal.legalNotice.publisher.contact")}
                  </strong>{" "}
                  <a
                    href="https://github.com/pharouqy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f71735] hover:underline"
                  >
                    {t("legal.legalNotice.publisher.github")}
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.legalNotice.hosting.title")}
                </h2>
                <p>
                  {t("legal.legalNotice.hosting.content")}
                  <br />
                  {t("legal.legalNotice.hosting.address")}
                  <br />
                  {t("legal.legalNotice.hosting.website")}{" "}
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
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.legalNotice.ip.title")}
                </h2>
                <p>{t("legal.legalNotice.ip.content")}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.legalNotice.service.title")}
                </h2>
                <p>{t("legal.legalNotice.service.content")}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.legalNotice.userResponsibility.title")}
                </h2>
                <p>{t("legal.legalNotice.userResponsibility.content")}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.legalNotice.limitation.title")}
                </h2>
                <p>{t("legal.legalNotice.limitation.content")}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#2563eb] dark:text-blue-400 mb-3">
                  {t("legal.legalNotice.law.title")}
                </h2>
                <p>{t("legal.legalNotice.law.content")}</p>
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

export default LegalNotice;
