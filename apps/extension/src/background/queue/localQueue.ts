import {
  DEFAULT_USER_SETTINGS,
  MAX_QUERY_LENGTH,
  MIN_QUERY_LENGTH,
  STORAGE_KEYS,
  type QueueItem,
  type ReplayStats,
  type UserSettings,
} from "@syncx/shared";

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function getSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.settings);
  return {
    ...DEFAULT_USER_SETTINGS,
    ...(result[STORAGE_KEYS.settings] as UserSettings | undefined),
  };
}

async function getQueue(): Promise<QueueItem[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.queue);
  return (result[STORAGE_KEYS.queue] as QueueItem[] | undefined) ?? [];
}

async function saveQueue(queue: QueueItem[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.queue]: queue });
}

async function getStats(): Promise<ReplayStats> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.stats);
  const stats = result[STORAGE_KEYS.stats] as ReplayStats | undefined;
  const today = todayDateString();
  if (stats?.date === today) {
    return stats;
  }
  return { date: today, replayCount: 0, skippedCount: 0 };
}

async function saveStats(stats: ReplayStats): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.stats]: stats });
}

async function getLastReplayMap(): Promise<Record<string, number>> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.lastReplayByQuery);
  return (
    (result[STORAGE_KEYS.lastReplayByQuery] as Record<string, number>) ?? {}
  );
}

async function isPausedByThrottle(): Promise<boolean> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.pausedUntil);
  const pausedUntil = result[STORAGE_KEYS.pausedUntil] as number | undefined;
  return pausedUntil !== undefined && Date.now() < pausedUntil;
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export async function enqueue(
  query: string,
  capturedAt: number,
): Promise<{ ok: boolean; reason?: string; item?: QueueItem }> {
  const settings = await getSettings();

  if (settings.paused || (await isPausedByThrottle())) {
    return { ok: false, reason: "paused" };
  }

  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH || trimmed.length > MAX_QUERY_LENGTH) {
    return { ok: false, reason: "invalid_length" };
  }

  const normalized = normalizeQuery(trimmed);
  const queue = await getQueue();
  const stats = await getStats();
  const lastReplayMap = await getLastReplayMap();
  const now = Date.now();

  const pendingMatch = queue.some(
    (item) =>
      item.status === "pending" && normalizeQuery(item.query) === normalized,
  );
  if (pendingMatch) {
    return { ok: false, reason: "duplicate_pending" };
  }

  const replayedToday = queue.some(
    (item) =>
      item.status === "done" &&
      normalizeQuery(item.query) === normalized &&
      item.replayedAt !== undefined &&
      new Date(item.replayedAt).toISOString().slice(0, 10) === stats.date,
  );
  if (replayedToday) {
    return { ok: false, reason: "duplicate_replayed_today" };
  }

  const lastReplay = lastReplayMap[normalized];
  if (lastReplay && now - lastReplay < settings.dedupWindowMs) {
    return { ok: false, reason: "dedup_window" };
  }

  const item: QueueItem = {
    id: generateId(),
    query: trimmed,
    status: "pending",
    createdAt: capturedAt || now,
  };

  queue.push(item);
  await saveQueue(queue);
  return { ok: true, item };
}

export async function peekPending(): Promise<QueueItem | null> {
  const queue = await getQueue();
  return queue.find((item) => item.status === "pending") ?? null;
}

export async function markReplaying(id: string): Promise<void> {
  const queue = await getQueue();
  const index = queue.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }
  queue[index] = { ...queue[index], status: "replaying" };
  await saveQueue(queue);
}

export async function markDone(id: string): Promise<void> {
  const queue = await getQueue();
  const index = queue.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }

  const item = queue[index];
  const now = Date.now();
  queue[index] = { ...item, status: "done", replayedAt: now };
  await saveQueue(queue);

  const stats = await getStats();
  stats.replayCount += 1;
  await saveStats(stats);

  const lastReplayMap = await getLastReplayMap();
  lastReplayMap[normalizeQuery(item.query)] = now;
  await chrome.storage.local.set({
    [STORAGE_KEYS.lastReplayByQuery]: lastReplayMap,
  });
}

export async function markSkipped(id: string, reason: string): Promise<void> {
  const queue = await getQueue();
  const index = queue.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }

  queue[index] = {
    ...queue[index],
    status: "skipped",
    failReason: reason,
  };
  await saveQueue(queue);

  const stats = await getStats();
  stats.skippedCount += 1;
  await saveStats(stats);
}

export async function getTodayReplayCount(): Promise<number> {
  const stats = await getStats();
  return stats.replayCount;
}

export async function incrementTodayReplayCount(): Promise<void> {
  const stats = await getStats();
  stats.replayCount += 1;
  await saveStats(stats);
}

export async function getPendingCount(): Promise<number> {
  const queue = await getQueue();
  return queue.filter((item) => item.status === "pending").length;
}

export async function getUserSettings(): Promise<UserSettings> {
  return getSettings();
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.settings]: settings });
}

export async function setPaused(paused: boolean): Promise<void> {
  const settings = await getSettings();
  settings.paused = paused;
  await saveUserSettings(settings);
}

export async function setThrottlePause(): Promise<void> {
  const THROTTLE_PAUSE_MS = 24 * 60 * 60 * 1000;
  await chrome.storage.local.set({
    [STORAGE_KEYS.pausedUntil]: Date.now() + THROTTLE_PAUSE_MS,
  });
  await setPaused(true);
}

export async function isEffectivelyPaused(): Promise<boolean> {
  const settings = await getSettings();
  return settings.paused || (await isPausedByThrottle());
}

export async function clearLocalData(): Promise<void> {
  await chrome.storage.local.remove([
    STORAGE_KEYS.queue,
    STORAGE_KEYS.stats,
    STORAGE_KEYS.settings,
    STORAGE_KEYS.lastReplayByQuery,
    STORAGE_KEYS.pausedUntil,
    STORAGE_KEYS.msLoggedIn,
  ]);
}
