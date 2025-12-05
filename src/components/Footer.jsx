import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#090446] text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm">
              IPTVFarouk - © {new Date().getFullYear()}. {t("footer.copyright")}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              {t("footer.developedBy")}{" "}
              <a
                href="https://github.com/pharouqy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#feb95f] hover:underline"
              >
                Farouk Younsi
              </a>{" "}
              with ❤️
            </p>
          </div>

          {/* Liens légaux */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/mentions-legales"
              className="text-gray-300 hover:text-[#feb95f] transition-colors"
            >
              {t("legal.legalNotice.title")}
            </Link>
            <Link
              to="/politique-confidentialite"
              className="text-gray-300 hover:text-[#feb95f] transition-colors"
            >
              {t("legal.privacyPolicy.title")}
            </Link>
            <Link
              to="/conditions-utilisation"
              className="text-gray-300 hover:text-[#feb95f] transition-colors"
            >
              {t("legal.termsOfService.title")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
