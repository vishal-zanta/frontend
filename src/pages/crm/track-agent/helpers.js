export const getStatusBadgeConfig = (status, t = (en) => en) => {
  const currentStatusUpper = (status || "OFFLINE").toUpperCase();
  switch (currentStatusUpper) {
    case "ACTIVE_ON_SCREEN":
      return {
        label: t("Active On Screen", "स्क्रीन पर सक्रिय"),
        badgeClass:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dotClass: "bg-emerald-500",
      };
    case "BACKGROUND":
      return {
        label: t("Background", "बैकग्राउंड"),
        badgeClass:
          "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        dotClass: "bg-sky-500",
      };
    case "ON_BREAK":
    case "BREAK":
      return {
        label: t("On Break", "ब्रेक पर"),
        badgeClass:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        dotClass: "bg-amber-500",
      };
    case "OFFLINE":
    default:
      return {
        label: t("Offline", "ऑफ़लाइन"),
        badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
        dotClass: "bg-destructive",
      };
  }
};

export const getScreenStateBadgeConfig = (state, t = (en) => en) => {
  const screenStateUpper = (state || "OFFLINE").toUpperCase();
  switch (screenStateUpper) {
    case "ACTIVE":
      return {
        label: t("Active", "सक्रिय"),
        badgeClass:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dotClass: "bg-emerald-500",
      };
    case "IDLE":
      return {
        label: t("Idle", "निष्क्रिय"),
        badgeClass:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        dotClass: "bg-amber-500",
      };
    case "BACKGROUND":
      return {
        label: t("Background", "बैकग्राउंड"),
        badgeClass:
          "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        dotClass: "bg-sky-500",
      };
    case "OFFLINE":
    default:
      return {
        label: t("Offline", "ऑफ़लाइन"),
        badgeClass: "bg-muted text-muted-foreground border-border",
        dotClass: "bg-muted-foreground",
      };
  }
};
