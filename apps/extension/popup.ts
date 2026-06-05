import type { ExtensionStatus } from "@syncx/shared";

const pendingEl = document.getElementById("pending")!;
const todayEl = document.getElementById("today")!;
const stateEl = document.getElementById("state")!;
const bingEl = document.getElementById("bing")!;
const cloudEl = document.getElementById("cloud")!;
const togglePauseBtn = document.getElementById("togglePause") as HTMLButtonElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

let currentPaused = false;

async function refresh(): Promise<void> {
  const status = (await chrome.runtime.sendMessage({
    type: "GET_STATUS",
  })) as ExtensionStatus;

  pendingEl.textContent = String(status.pendingCount);
  todayEl.textContent = `${status.todayReplays} / ${status.maxReplaysPerDay}`;
  stateEl.textContent = status.paused ? "Paused" : "Active";
  stateEl.className = status.paused ? "status-paused" : "";
  bingEl.textContent = status.msLoggedIn ? "Yes" : "No — sign in on Bing";
  cloudEl.textContent = status.cloudConnected ? "Connected" : "Local only";

  currentPaused = status.paused;
  togglePauseBtn.textContent = status.paused ? "Resume" : "Pause";

  loginBtn.style.display = status.cloudConnected ? "none" : "block";
  logoutBtn.style.display = status.cloudConnected ? "block" : "none";
}

togglePauseBtn.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({
    type: "SET_PAUSED",
    paused: !currentPaused,
  });
  await refresh();
});

loginBtn.addEventListener("click", async () => {
  loginBtn.disabled = true;
  const result = await chrome.runtime.sendMessage({ type: "LOGIN" });
  loginBtn.disabled = false;
  if (!result.ok) {
    alert(result.error ?? "Login failed");
  }
  await refresh();
});

logoutBtn.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "LOGOUT" });
  await refresh();
});

void refresh();
