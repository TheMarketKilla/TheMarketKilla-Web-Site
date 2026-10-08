import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { translations } from "./translations";

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "es";
    return localStorage.getItem("tmk_lang") || "es";
  });

  useEffect(() => {
    localStorage.setItem("tmk_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    t: translations[lang] || translations.es,
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
};
