// frontend/app/utils/recent.ts
const KEY = "pdfapp_recent";

export type RecentItem = {
  fileName: string;
  converter: string;
  time: number;
  downloadUrl?: string;
};

export function pushRecent(item: RecentItem) {
  try {
    const cur = JSON.parse(localStorage.getItem(KEY) || "[]");
    cur.unshift(item);
    // keep last 20
    localStorage.setItem(KEY, JSON.stringify(cur.slice(0, 20)));
  } catch {}
}

export function getRecentConversions(): RecentItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearRecentConversions() {
  localStorage.removeItem(KEY);
}
