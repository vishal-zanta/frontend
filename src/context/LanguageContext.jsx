import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const langContext = createContext(null);

const LanguageContextProvider = ({ children }) => {
  const { profile } = useAuth();
  const [lang, setLang] = useState("English");

  useEffect(() => {
    if (profile?.preferredLanguage === "Hindi") {
      setLang("Hindi");
    }
  }, [profile]);

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "English" ? "Hindi" : "English"));
  }, []);

  const t = useCallback((en, hi) => (lang === "Hindi" ? hi : en), [lang]);

  return (
    <langContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </langContext.Provider>
  );
};

export const useLanguage = () => useContext(langContext);

export default LanguageContextProvider;
