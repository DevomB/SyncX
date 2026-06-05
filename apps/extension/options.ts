import {
  DEFAULT_USER_SETTINGS,
  STORAGE_KEYS,
  type UserSettings,
} from "@syncx/shared";

const form = document.getElementById("settingsForm") as HTMLFormElement;
const minDelayEl = document.getElementById("minDelay") as HTMLInputElement;
const maxDelayEl = document.getElementById("maxDelay") as HTMLInputElement;
const maxReplaysEl = document.getElementById("maxReplays") as HTMLInputElement;
const activeStartEl = document.getElementById("activeStart") as HTMLInputElement;
const activeEndEl = document.getElementById("activeEnd") as HTMLInputElement;
const savedMsg = document.getElementById("savedMsg")!;
const deleteBtn = document.getElementById("deleteAccount") as HTMLButtonElement;

async function loadSettings(): Promise<void> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.settings);
  const settings = {
    ...DEFAULT_USER_SETTINGS,
    ...(result[STORAGE_KEYS.settings] as UserSettings | undefined),
  };

  minDelayEl.value = String(Math.round(settings.minDelayMs / 1000));
  maxDelayEl.value = String(Math.round(settings.maxDelayMs / 1000));
  maxReplaysEl.value = String(settings.maxReplaysPerDay);
  activeStartEl.value = String(settings.activeStartHour);
  activeEndEl.value = String(settings.activeEndHour);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const minSec = Number(minDelayEl.value);
  const maxSec = Number(maxDelayEl.value);
  const maxReplays = Number(maxReplaysEl.value);
  const activeStart = Number(activeStartEl.value);
  const activeEnd = Number(activeEndEl.value);

  if (minSec > maxSec) {
    alert("Min delay must be less than or equal to max delay.");
    return;
  }
  if (maxReplays < 1 || maxReplays > 30) {
    alert("Max replays must be between 1 and 30.");
    return;
  }

  const result = await chrome.storage.local.get(STORAGE_KEYS.settings);
  const existing = {
    ...DEFAULT_USER_SETTINGS,
    ...(result[STORAGE_KEYS.settings] as UserSettings | undefined),
  };

  const settings: UserSettings = {
    ...existing,
    minDelayMs: minSec * 1000,
    maxDelayMs: maxSec * 1000,
    maxReplaysPerDay: maxReplays,
    activeStartHour: activeStart,
    activeEndHour: activeEnd,
  };

  await chrome.storage.local.set({ [STORAGE_KEYS.settings]: settings });
  savedMsg.style.display = "block";
  setTimeout(() => {
    savedMsg.style.display = "none";
  }, 2000);
});

deleteBtn.addEventListener("click", async () => {
  if (
    !confirm(
      "Delete all cloud account data? This cannot be undone. You must be signed in.",
    )
  ) {
    return;
  }
  const result = await chrome.runtime.sendMessage({ type: "DELETE_ACCOUNT" });
  if (!result.ok) {
    alert(result.error ?? "Delete failed");
  } else {
    alert("Cloud data deleted.");
  }
});

void loadSettings();
