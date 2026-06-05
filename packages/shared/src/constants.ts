export const DEFAULT_MIN_DELAY_MS = 90_000;
export const DEFAULT_MAX_DELAY_MS = 180_000;
export const DEFAULT_DEDUP_WINDOW_MS = 300_000;
export const DEFAULT_MAX_REPLAYS_PER_DAY = 25;
export const MIN_QUERY_LENGTH = 2;
export const MAX_QUERY_LENGTH = 500;
export const GOOGLE_SEARCH_PARAM = "q";
export const BING_SEARCH_URL = "https://www.bing.com/search";

export const STORAGE_KEYS = {
  queue: "syncx:queue",
  stats: "syncx:stats",
  settings: "syncx:settings",
  msLoggedIn: "syncx:msLoggedIn",
  pausedUntil: "syncx:pausedUntil",
  lastReplayByQuery: "syncx:lastReplayByQuery",
  replayTabId: "syncx:replayTabId",
} as const;

export const SESSION_KEYS = {
  accessToken: "syncx:accessToken",
  refreshToken: "syncx:refreshToken",
  expiresAt: "syncx:expiresAt",
  replayTabId: "syncx:replayTabId",
} as const;

export const THROTTLE_PAUSE_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_USER_SETTINGS = {
  paused: false,
  maxReplaysPerDay: DEFAULT_MAX_REPLAYS_PER_DAY,
  minDelayMs: DEFAULT_MIN_DELAY_MS,
  maxDelayMs: DEFAULT_MAX_DELAY_MS,
  activeStartHour: 8,
  activeEndHour: 22,
  dedupWindowMs: DEFAULT_DEDUP_WINDOW_MS,
} as const;
