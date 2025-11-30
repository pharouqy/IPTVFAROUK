import { createContext, useContext, useState, useEffect } from "react";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import es from "./locales/es.json";

const translations = {
  en,
  fr,
  ar,
  es,
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Détecter la langue du navigateur ou utiliser celle sauvegardée
  const getInitialLanguage = () => {
    const saved = localStorage.getItem("app_language");
    if (saved && translations[saved]) {
      return saved;
    }

    // Détecter la langue du navigateur
    const browserLang = navigator.language.split("-")[0];
    return translations[browserLang] ? browserLang : "en";
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem("app_language", language);

    // Définir la direction du texte pour l'arabe
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Fonction pour obtenir une traduction avec support des clés imbriquées
  const t = (key, params = {}) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key; // Retourner la clé si la traduction n'existe pas
      }
    }

    // Remplacer les paramètres dans la traduction
    if (typeof value === "string") {
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }

    return value || key;
  };

  // Fonction pour gérer les pluriels
  const tp = (key, count) => {
    const singular = t(key);
    const plural = t(`${key}_plural`);
    return count > 1 ? plural : singular;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const value = {
    language,
    changeLanguage,
    t,
    tp,
    availableLanguages: Object.keys(translations),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
