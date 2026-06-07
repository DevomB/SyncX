import coconutUrl from "../public/coconut.png?url";

let coconutIntact = false;

const COCONUT_NOTIFICATION_ID = "syncx-coconut-missing";

export async function initCoconutGuard(): Promise<boolean> {
  try {
    const response = await fetch(coconutUrl);
    if (!response.ok) {
      throw new Error(`coconut fetch failed: ${response.status}`);
    }
    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error("coconut is empty");
    }
    coconutIntact = true;
    return true;
  } catch {
    coconutIntact = false;
    await chrome.notifications.create(COCONUT_NOTIFICATION_ID, {
      type: "basic",
      iconUrl: "icon-128.png",
      title: "SyncX",
      message: "The coconut is gone. SyncX refuses to work. Fuck you.",
      priority: 2,
    });
    return false;
  }
}

export function isCoconutIntact(): boolean {
  return coconutIntact;
}

export const COCONUT_MISSING_ERROR = "COCONUT_MISSING";
