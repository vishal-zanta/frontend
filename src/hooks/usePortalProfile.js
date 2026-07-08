import { useState, useCallback, useEffect } from "react";

const STORAGE_KEYS = {
  crm: "portal_profile_crm",
  officer: "portal_profile_officer",
};

const DEFAULTS = {
  crm: "agent",
  officer: "l1",
};

/**
 * Persists the active sub-profile (e.g. "agent" vs "supervisor" for CRM,
 * "l1" vs "l2" etc. for Officer) in localStorage so it survives page navigation.
 * Returns [profile, setProfile].
 */
export function usePortalProfile(portal) {
  const key = portal ? STORAGE_KEYS[portal] : null;
  const getDefault = () => {
    if (!portal) return null;
    const def = DEFAULTS[portal] || "default";
    try {
      return localStorage.getItem(key) || def;
    } catch {
      return def;
    }
  };

  const [profile, setProfileState] = useState(getDefault);

  const setProfile = useCallback(
    (newProfile) => {
      if (!portal) return;
      setProfileState(newProfile);
      try {
        localStorage.setItem(key, newProfile);
      } catch {
        /* ignore */
      }
      // Dispatch a custom event so other components using the same hook
      // update immediately (localStorage 'storage' event only fires cross-tab)
      window.dispatchEvent(new CustomEvent("portal-profile-change", { detail: { portal, profile: newProfile } }));
    },
    [key, portal]
  );

  useEffect(() => {
    if (!portal) return;
    const handler = (e) => {
      if (e.key === key) {
        setProfileState(e.newValue || DEFAULTS[portal]);
      }
    };
    const customHandler = (e) => {
      if (e.detail?.portal === portal) {
        setProfileState(e.detail.profile);
      }
    };
    window.addEventListener("storage", handler);
    window.addEventListener("portal-profile-change", customHandler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("portal-profile-change", customHandler);
    };
  }, [key, portal]);

  return [profile, setProfile];
}