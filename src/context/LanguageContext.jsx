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
  const [lang, setLang] = useState("Hindi");

  useEffect(() => {
    if (profile) {
      if (profiledata.isCRM) {
        const lan = sessionStorage.getItem("cce-lang");
        if (lan && lan === "English") {
          setLang("English");
        }
      } else if (profiledata.isOfficer) {
        const lan = sessionStorage.getItem("off-lang");
        if (lan && lan === "English") {
          setLang("English");
        }
      } else {
        const lan = sessionStorage.getItem("admin-lang");
        if (lan && lan === "English") {
          setLang("English");
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
        sessionStorage.setItem("cce-lang", lang);
      } else if (profiledata.isOfficer) {
        sessionStorage.setItem("off-lang", lang);
      } else {
        sessionStorage.setItem("admin-lang", lang);
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
