import {
  BING_SEARCH_URL,
  SESSION_KEYS,
  type QueueItem,
} from "@syncx/shared";
import {
  getTodayReplayCount,
  getUserSettings,
  incrementTodayReplayCount,
  markDone,
  markReplaying,
  markSkipped,
} from "../queue/localQueue";

let replayInProgress = false;

function randomDelay(minMs: number, maxMs: number): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

function waitForTabLoad(tabId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error("tab load timeout"));
    }, 60_000);

    function listener(
      updatedTabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
    ): void {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        clearTimeout(timeout);
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }

    chrome.tabs.onUpdated.addListener(listener);
  });
}

export interface ReplayCallbacks {
  onComplete?: (
    id: string,
    status: "done" | "skipped",
    reason?: string,
  ) => Promise<void>;
}

export async function replayQuery(
  item: QueueItem,
  options: { useLocalQueue: boolean },
  callbacks?: ReplayCallbacks,
): Promise<boolean> {
  if (replayInProgress) {
    return false;
  }

  const settings = await getUserSettings();
  const todayCount = await getTodayReplayCount();
  if (todayCount >= settings.maxReplaysPerDay) {
    return false;
  }

  replayInProgress = true;

  try {
    if (options.useLocalQueue) {
      await markReplaying(item.id);
    }

    const url = `${BING_SEARCH_URL}?q=${encodeURIComponent(item.query)}`;
    const tab = await chrome.tabs.create({ url, active: false });
    if (!tab.id) {
      if (options.useLocalQueue) {
        await markSkipped(item.id, "tab_create_failed");
      }
      await callbacks?.onComplete?.(item.id, "skipped", "tab_create_failed");
      return false;
    }

    await chrome.storage.session.set({
      [SESSION_KEYS.replayTabId]: tab.id,
    });

    try {
      await waitForTabLoad(tab.id);
    } catch {
      if (options.useLocalQueue) {
        await markSkipped(item.id, "tab_load_timeout");
      }
      await callbacks?.onComplete?.(item.id, "skipped", "tab_load_timeout");
      return false;
    }

    const delayMs = randomDelay(settings.minDelayMs, settings.maxDelayMs);
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    try {
      await chrome.tabs.remove(tab.id);
    } catch {
      // tab may already be closed
    }

    if (options.useLocalQueue) {
      await markDone(item.id);
    } else {
      await incrementTodayReplayCount();
    }

    await callbacks?.onComplete?.(item.id, "done");
    return true;
  } finally {
    replayInProgress = false;
    await chrome.storage.session.remove(SESSION_KEYS.replayTabId);
  }
}

export function isReplayInProgress(): boolean {
  return replayInProgress;
}
