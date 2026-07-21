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
  const { profile, profiledata } = useAuth();
  const [lang, setLang] = useState("English");

  useEffect(() => {
    if (profile) {
      if (profiledata.isCRM) {
        const lan = localStorage.getItem("cce-lang");
        if (lan && lan === "Hindi") {
          setLang("Hindi");
        }
      } else if (profiledata.isOfficer) {
        const lan = localStorage.getItem("off-lang");
        if (lan && lan === "Hindi") {
          setLang("Hindi");
        }
      }
    }
  }, [profile, profiledata]);

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "English" ? "Hindi" : "English"));
  }, []);

  const t = useCallback((en, hi) => (lang === "Hindi" ? hi : en), [lang]);
  useEffect(() => {
    if (!!profile) {
      if (profiledata.isCRM) {
        localStorage.setItem("cce-lang", lang);
      } else if (profiledata.isOfficer) {
        localStorage.setItem("off-lang", lang);
      }
    }
  }, [lang, profile, profiledata]);

  return (
    <langContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </langContext.Provider>
  );
};

export const useLanguage = () => useContext(langContext);

export default LanguageContextProvider;
