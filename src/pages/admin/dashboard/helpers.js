export const transformComplaintVolume = (mainData) => {
  if (!mainData) return [];

  const dates = new Set();
  (mainData.raised || []).forEach((item) => {
    if (item?._id) dates.add(item._id);
  });
  (mainData.resolved || []).forEach((item) => {
    if (item?._id) dates.add(item._id);
  });

  const sortedDates = Array.from(dates).sort();

  const raisedMap = new Map();
  (mainData.raised || []).forEach((item) => {
    if (item?._id) raisedMap.set(item._id, item.count);
  });

  const resolvedMap = new Map();
  (mainData.resolved || []).forEach((item) => {
    if (item?._id) resolvedMap.set(item._id, item.count);
  });

  return sortedDates.map((date) => {
    const parts = date.split("-");
    const day = parts[2] ? parseInt(parts[2], 10) : "";
    const month = parts[1] ? parseInt(parts[1], 10) : "";
    const label = day && month ? `${day}/${month}` : date;

    return {
      date,
      label,
      raised: raisedMap.get(date) || 0,
      resolved: resolvedMap.get(date) || 0,
      pending: 0,
    };
  });
};

export const transformCategoryDistribution = (mainData) => {
  if (!Array.isArray(mainData)) return [];

  const COLORS = [
    "#1d4ed8",
    "#22c55e",
    "#eab308",
    "#ef4444",
    "#a855f7",
    "#06b6d4",
    "#f97316",
    "#ec4899",
    "#14b8a6",
    "#6366f1",
    "#84cc16",
    "#0ea5e9",
    "#d946ef",
    "#f43f5e"
  ];

  return mainData.map((item, idx) => ({
    name: item._id,
    value: item.count || 0,
    color: COLORS[idx % COLORS.length]
  }));
};
