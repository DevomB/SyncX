import {
  getPending,
  completeQueueItem,
  isAuthenticated,
} from "../api/client";
import {
  getTodayReplayCount,
  getUserSettings,
  isEffectivelyPaused,
  peekPending,
} from "./queue/localQueue";
import { checkMicrosoftLogin } from "./bing/preflight";
import { replayQuery } from "./bing/replay";
import type { QueueItem } from "@syncx/shared";

const ALARM_NAME = "syncx-replay-tick";

export function initScheduler(): void {
  void chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
      void tick();
    }
  });
}

function isWithinActiveHours(startHour: number, endHour: number): boolean {
  const hour = new Date().getHours();
  if (startHour <= endHour) {
    return hour >= startHour && hour < endHour;
  }
  return hour >= startHour || hour < endHour;
}

async function getNextItem(): Promise<{ item: QueueItem; useLocalQueue: boolean } | null> {
  if (await isAuthenticated()) {
    try {
      const remote = await getPending();
      if (remote) {
        return { item: remote, useLocalQueue: false };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      console.warn("Cloud pending fetch failed:", message);
    }
  }
  const local = await peekPending();
  if (local) {
    return { item: local, useLocalQueue: true };
  }
  return null;
}

export async function tick(force = false): Promise<void> {
  if (!force && (await isEffectivelyPaused())) {
    return;
  }

  const settings = await getUserSettings();
  if (!force && settings.paused) {
    return;
  }

  if (!force && !isWithinActiveHours(settings.activeStartHour, settings.activeEndHour)) {
    return;
  }

  const todayCount = await getTodayReplayCount();
  if (todayCount >= settings.maxReplaysPerDay) {
    return;
  }

  const loggedIn = await checkMicrosoftLogin();
  if (!loggedIn) {
    return;
  }

  const next = await getNextItem();
  if (!next) {
    return;
  }

  const { item, useLocalQueue } = next;

  await replayQuery(
    item,
    { useLocalQueue },
    {
      onComplete: async (id, status, reason) => {
        if (!useLocalQueue) {
          await completeQueueItem(id, { status, failReason: reason });
        }
      },
    },
  );
}

export async function forceReplayNow(): Promise<{ started: boolean; reason?: string }> {
  const next = await getNextItem();
  if (!next) {
    return { started: false, reason: "no_pending" };
  }

  const loggedIn = await checkMicrosoftLogin();
  if (!loggedIn) {
    return { started: false, reason: "not_logged_in" };
  }

  const { item, useLocalQueue } = next;
  const started = await replayQuery(
    item,
    { useLocalQueue },
    {
      onComplete: async (id, status, reason) => {
        if (!useLocalQueue) {
          await completeQueueItem(id, { status, failReason: reason });
        }
      },
    },
  );

  return { started, reason: started ? undefined : "replay_failed" };
}
