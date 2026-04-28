// LexAnchor design tokens + shared formatters.

export const tokens = {
  bg:        "#0A0A14",
  surface:   "#12121E",
  surface2:  "#1A1A2E",
  border:    "#252540",
  border2:   "#30305A",
  text1:     "#F4F4FF",
  text2:     "#7070A8",
  text3:     "#404070",
  accent:    "#6C63FF",
  mid:       "#9B8FFF",
  gain:      "#10B981",
  loss:      "#EF4444",
  warn:      "#F59E0B"
} as const;

export const RISK_BADGES: Record<"P0" | "P1" | "P2", { color: string; bg: string; label: string }> = {
  P0: { color: tokens.loss, bg: "rgba(239,68,68,0.12)", label: "P0 · urgent" },
  P1: { color: tokens.warn, bg: "rgba(245,158,11,0.12)", label: "P1 · review" },
  P2: { color: tokens.accent, bg: "rgba(108,99,255,0.15)", label: "P2 · standard" }
};

export function timeAgo(ts: Date | string | number): string {
  const date = typeof ts === "string" || typeof ts === "number" ? new Date(ts) : ts;
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
