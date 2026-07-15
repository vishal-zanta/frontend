import { toast } from "react-hot-toast"

export const getSuccessToast = ( description) => {
    toast.success(description, {
        duration: 3000,
        style: {
            borderRadius: '12px',
            background: '#10b981',
            color: '#fff',
            maxWidth: '400px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
        },
    });
}

export const getErrorToast = (err) => {
    toast.error(err?.response?.data?.message || err?.message || "Something went wrong!", {
        duration: 3000,
        style: {
            borderRadius: '12px',
            background: '#dc2626',
            color: '#fff',
            maxWidth: '400px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
        },
    });
}


export const getWarningToast = (description) => {
    toast.error(description, {
        duration: 3000,
        style: {
            borderRadius: '12px',
            background: '#dc2626',
            color: '#fff',
            maxWidth: '400px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
        },
    });
}

export const getInfoToast = (description) => {
    toast.error(description, {
        duration: 3000,
        style: {
            borderRadius: '12px',
            background: '#dc2626',
            color: '#fff',
            maxWidth: '400px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
        },
    });
}

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