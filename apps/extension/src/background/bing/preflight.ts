import { STORAGE_KEYS } from "@syncx/shared";

export async function checkMicrosoftLogin(): Promise<boolean> {
  try {
    const response = await fetch("https://www.bing.com/", {
      credentials: "include",
      redirect: "manual",
    });

    const url = response.url.toLowerCase();
    const loggedIn =
      !url.includes("login.live.com") && !url.includes("login.microsoftonline.com");

    await chrome.storage.local.set({
      [STORAGE_KEYS.msLoggedIn]: loggedIn,
    });

    if (!loggedIn) {
      await chrome.notifications.create("syncx-ms-login", {
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon-128.png"),
        title: "SyncX",
        message: "Sign in to Microsoft on Bing to enable search replay.",
      });
    }

    return loggedIn;
  } catch {
    await chrome.storage.local.set({ [STORAGE_KEYS.msLoggedIn]: false });
    return false;
  }
}

export async function isMicrosoftLoggedIn(): Promise<boolean> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.msLoggedIn);
  const cached = result[STORAGE_KEYS.msLoggedIn] as boolean | undefined;
  if (cached !== undefined) {
    return cached;
  }
  return checkMicrosoftLogin();
}
