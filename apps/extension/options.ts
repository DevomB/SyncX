import {
  DEFAULT_USER_SETTINGS,
  STORAGE_KEYS,
  type CloudBackendConfig,
  type UserSettings,
} from "@syncx/shared";
import {
  clearCloudConfig,
  getCloudConfig,
  getOAuthRedirectUri,
  saveCloudConfig,
  testCloudHealth,
} from "./src/config/cloudConfig";

const cloudForm = document.getElementById("cloudForm") as HTMLFormElement;
const apiUrlEl = document.getElementById("apiUrl") as HTMLInputElement;
const cognitoDomainEl = document.getElementById("cognitoDomain") as HTMLInputElement;
const cognitoClientIdEl = document.getElementById("cognitoClientId") as HTMLInputElement;
const redirectUriEl = document.getElementById("redirectUri")!;
const testHealthBtn = document.getElementById("testHealth") as HTMLButtonElement;
const clearCloudBtn = document.getElementById("clearCloud") as HTMLButtonElement;
const cloudMsg = document.getElementById("cloudMsg")!;

const form = document.getElementById("settingsForm") as HTMLFormElement;
const minDelayEl = document.getElementById("minDelay") as HTMLInputElement;
const maxDelayEl = document.getElementById("maxDelay") as HTMLInputElement;
const maxReplaysEl = document.getElementById("maxReplays") as HTMLInputElement;
const activeStartEl = document.getElementById("activeStart") as HTMLInputElement;
const activeEndEl = document.getElementById("activeEnd") as HTMLInputElement;
const savedMsg = document.getElementById("savedMsg")!;
const deleteBtn = document.getElementById("deleteAccount") as HTMLButtonElement;

function showCloudMsg(text: string, ok = true): void {
  cloudMsg.textContent = text;
  cloudMsg.style.color = ok ? "#00ba7c" : "#f4212e";
  cloudMsg.style.display = "block";
  setTimeout(() => {
    cloudMsg.style.display = "none";
  }, 4000);
}

async function loadCloudConfig(): Promise<void> {
  redirectUriEl.textContent = getOAuthRedirectUri();
  const config = await getCloudConfig();
  if (!config) {
    return;
  }
  apiUrlEl.value = config.apiUrl;
  cognitoDomainEl.value = config.cognitoDomain;
  cognitoClientIdEl.value = config.cognitoClientId;
}

cloudForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const config: CloudBackendConfig = {
    apiUrl: apiUrlEl.value,
    cognitoDomain: cognitoDomainEl.value,
    cognitoClientId: cognitoClientIdEl.value,
  };

  try {
    await saveCloudConfig(config);
    showCloudMsg("Cloud backend saved. Sign in from the popup.");
  } catch (error) {
    showCloudMsg(
      error instanceof Error ? error.message : "Failed to save cloud config",
      false,
    );
  }
});

testHealthBtn.addEventListener("click", async () => {
  const url = apiUrlEl.value.trim();
  if (!url) {
    showCloudMsg("Enter an API URL first.", false);
    return;
  }
  try {
    const ok = await testCloudHealth(url);
    showCloudMsg(ok ? "API /health OK" : "API /health failed", ok);
  } catch {
    showCloudMsg("Could not reach API. Check URL and host permissions.", false);
  }
});

clearCloudBtn.addEventListener("click", async () => {
  if (!confirm("Clear cloud backend config? You will stay in local-only mode.")) {
    return;
  }
  await clearCloudConfig();
  apiUrlEl.value = "";
  cognitoDomainEl.value = "";
  cognitoClientIdEl.value = "";
  await chrome.runtime.sendMessage({ type: "LOGOUT" });
  showCloudMsg("Cloud config cleared.");
});

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

void loadCloudConfig();
void loadSettings();
