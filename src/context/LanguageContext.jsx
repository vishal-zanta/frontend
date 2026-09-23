import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const langContext = createContext(null);

const LanguageContextProvider = ({ children }) => {
  const [lang, setLang] = useState(
    () => sessionStorage.getItem("user-lang") || "Hindi"
  );

  const toggle = useCallback(() => {
    setLang((prev) => {
      const updatedLang = prev === "English" ? "Hindi" : "English";
      sessionStorage.setItem("user-lang", updatedLang);
      return updatedLang;
    });
  }, []);

  const handleSetLang = useCallback((newLang) => {
    setLang(newLang);
    sessionStorage.setItem("user-lang", newLang);
  }, []);

  const t = useCallback((en, hi) => (lang === "Hindi" ? hi : en), [lang]);

  return (
    <langContext.Provider value={{ lang, setLang: handleSetLang, toggle, t }}>
      {children}
    </langContext.Provider>
  );
};

export const useLanguage = () => useContext(langContext);

export default LanguageContextProvider;
