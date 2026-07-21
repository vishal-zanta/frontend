import { sidebarSections } from "@/components/Sidebar";
import { toast } from "sonner";

export const getSuccessToast = (description) => {
  toast.success(description);
};

export const getErrorToast = (err) => {
  const message =
    err?.response?.data?.message ||
    err?.message ||
    (typeof err === "string" ? err : "Something went wrong!");
  toast.error(message);
};

export const getWarningToast = (description) => {
  toast.warning(description);
};

export const getInfoToast = (description) => {
  toast.info(description);
};

export function isValidNumber(value, min, max) {
  // Empty string is considered valid
  if (value === "") return true;

  const num = Number(value);

  // Not a valid number
  if (Number.isNaN(num)) return false;

  // Check minimum if provided
  if (min !== undefined && num < min) return false;

  // Check maximum if provided
  if (max !== undefined && num > max) return false;

  return true;
}

export const isAlpha = (value) => {
  // empty value is valid
  if (value === "") return true;

  // only letters and spaces allowed (no numbers, no special chars)
  if (!/^[A-Za-z ]*$/.test(value)) return false;

  // must contain at least one letter — spaces alone are not valid
  if (!/[A-Za-z]/.test(value)) return false;

  // no more than 2 trailing spaces allowed
  const trailingSpaces = value.match(/ *$/)[0].length;
  if (trailingSpaces > 2) return false;

  return true;
};

export const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

export const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
};

export const fileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export const getTrendProps = (current, previous, reverseColor = false) => {
  if (
    previous === undefined ||
    previous === null ||
    current === undefined ||
    current === null
  ) {
    return { trend: undefined, trendValue: undefined };
  }

  if (previous === 0) {
    if (current > 0) {
      // Growth from zero (good if normal, bad if reversed)
      const isUp = !reverseColor;
      return {
        trend: isUp ? "up" : "down",
        trendValue: `+${current} vs last week`,
      };
    }
    return { trend: "neutral", trendValue: "0% vs last week" };
  }

  const diff = current - previous;
  const pct = (diff / previous) * 100;

  if (diff > 0) {
    // Increase: green for normal, red for reversed (e.g. SLA Breached/Escalated)
    const isUp = !reverseColor;
    return {
      trend: isUp ? "up" : "down",
      trendValue: `+${pct.toFixed(0)} % vs last week`,
    };
  } else if (diff < 0) {
    // Decrease: red for normal, green for reversed
    const isDown = !reverseColor;
    return {
      trend: isDown ? "down" : "up",
      trendValue: `${pct.toFixed(0)} % vs last week`,
    };
  }

  return { trend: "neutral", trendValue: "0% vs last week" };
};


export const checkPermissionManual = (validPermissions , permission)=> {
  const IGNORE_ALL  = ["MY_COMPLAINT", "FIELD_VISIT", "OFFICER_DASHBOARD"];
  const isIgnoreAll = [...(permission || [])].some((p) => IGNORE_ALL.includes(p));
  // console.log({validPermissions, IGNORE_ALL, isIgnoreAll});

   if (  validPermissions.includes("ALL") && !isIgnoreAll )
      return true;
    if (!permission) return false;
    if (Array.isArray(permission)) {
      return permission.some((p) => validPermissions.includes(p));
    }
    return validPermissions.includes(permission);
}
