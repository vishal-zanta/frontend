import { useState, useEffect, useCallback } from "react";

export function useLanguage() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("bucgp_lang") || "en"; } catch { return "en"; }
  });

  useEffect(() => {
    try { localStorage.setItem("bucgp_lang", lang); } catch {}
  }, [lang]);

  const toggle = useCallback(() => {
    setLang(prev => (prev === "en" ? "hi" : "en"));
  }, []);

  const t = useCallback((en, hi) => (lang === "hi" ? hi : en), [lang]);

  return { lang, setLang, toggle, t };
}