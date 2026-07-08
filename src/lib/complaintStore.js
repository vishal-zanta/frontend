import { COMPLAINTS } from "@/lib/biharData";

const KEY = "bucgp_citizen_complaints";

export function getStoredComplaints() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function addStoredComplaint(complaint) {
  try {
    const all = getStoredComplaints();
    all.unshift(complaint);
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

export function findComplaintById(id) {
  const normalized = (id || "").toLowerCase().trim();
  if (!normalized) return null;
  const stored = getStoredComplaints().find(c => c.id.toLowerCase() === normalized);
  if (stored) return stored;
  return COMPLAINTS.find(c => c.id.toLowerCase() === normalized) || null;
}

export function getCitizenComplaints(citizenName) {
  const stored = getStoredComplaints();
  const fromData = COMPLAINTS.filter(c => c.citizenName === citizenName);
  const ids = new Set();
  const combined = [];
  for (const c of [...stored, ...fromData]) {
    if (!ids.has(c.id)) {
      ids.add(c.id);
      combined.push(c);
    }
  }
  return combined;
}