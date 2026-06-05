import type { BackgroundMessage, ExtensionStatus } from "@syncx/shared";
import { STORAGE_KEYS } from "@syncx/shared";
import { postSearch, isAuthenticated as isCloudAuthenticated, deleteUser, getStats as getCloudStats } from "../api/client";
import { isCognitoConfigured, login, logout } from "../auth/cognitoPkce";
import { isCloudConfigured } from "../config/cloudConfig";
import { isMicrosoftLoggedIn } from "./bing/preflight";
import {
  enqueue,
  getPendingCount,
  getTodayReplayCount,
  getUserSettings,
  setPaused,
  setThrottlePause,
  clearLocalData,
} from "./queue/localQueue";
import { initScheduler, forceReplayNow } from "./scheduler";

async function handleCapture(
  query: string,
  sourceUrl: string,
  capturedAt: number,
): Promise<void> {
  if (await isCloudAuthenticated()) {
    try {
      await postSearch({
        query,
        capturedAt: new Date(capturedAt).toISOString(),
        sourceUrl,
      });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      console.warn("Cloud enqueue failed, falling back to local queue:", message);
    }
  }

  await enqueue(query, capturedAt);
}

async function getStatus(): Promise<ExtensionStatus> {
  const settings = await getUserSettings();
  let pendingCount = await getPendingCount();
  let todayReplays = await getTodayReplayCount();
  const [msLoggedIn, cloudConnected, cloudConfigured] = await Promise.all([
    isMicrosoftLoggedIn(),
    isCloudAuthenticated(),
    isCloudConfigured(),
  ]);

  if (cloudConnected) {
    try {
      const stats = await getCloudStats();
      pendingCount = stats.pendingCount ?? pendingCount;
      todayReplays = stats.replayCount;
      await chrome.storage.local.set({ [STORAGE_KEYS.stats]: stats });
    } catch {
      // use local counts
    }
  }

  return {
    pendingCount,
    todayReplays,
    maxReplaysPerDay: settings.maxReplaysPerDay,
    paused: settings.paused,
    msLoggedIn,
    cloudConnected,
    cloudConfigured,
  };
}

chrome.runtime.onMessage.addListener(
  (message: BackgroundMessage, _sender, sendResponse) => {
    void (async () => {
      switch (message.type) {
        case "CAPTURE_SEARCH":
          await handleCapture(message.query, message.sourceUrl, message.capturedAt);
          sendResponse({ ok: true });
          break;
        case "THROTTLE_DETECTED":
          await setThrottlePause();
          sendResponse({ ok: true });
          break;
        case "GET_STATUS":
          sendResponse(await getStatus());
          break;
        case "SET_PAUSED":
          await setPaused(message.paused);
          sendResponse({ ok: true });
          break;
        case "FORCE_REPLAY_NOW":
          sendResponse(await forceReplayNow());
          break;
        default:
          sendResponse({ ok: false });
      }
    })();
    return true;
  },
);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "LOGIN") {
    void login()
      .then(() => sendResponse({ ok: true }))
      .catch((error: Error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }
  if (message.type === "LOGOUT") {
    void logout().then(() => sendResponse({ ok: true }));
    return true;
  }
  if (message.type === "DELETE_ACCOUNT") {
    void (async () => {
      try {
        await deleteUser();
        await clearLocalData();
        await logout();
        sendResponse({ ok: true });
      } catch (error) {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : "delete failed",
        });
      }
    })();
    return true;
  }
  return false;
});

initScheduler();

void chrome.storage.local.get(STORAGE_KEYS.settings).then((result) => {
  if (!result[STORAGE_KEYS.settings]) {
    void getUserSettings();
  }
});

export { isCognitoConfigured };
