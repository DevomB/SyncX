import type { ExtensionStatus } from "@syncx/shared";

const COCONUT_MISSING_ERROR = "COCONUT_MISSING";

const mainEl = document.getElementById("main")!;
const coconutErrorEl = document.getElementById("coconutError")!;

const pendingEl = document.getElementById("pending")!;
const todayEl = document.getElementById("today")!;
const stateEl = document.getElementById("state")!;
const bingEl = document.getElementById("bing")!;
const cloudEl = document.getElementById("cloud")!;
const togglePauseBtn = document.getElementById("togglePause") as HTMLButtonElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

let currentPaused = false;

function showCoconutError(): void {
  mainEl.style.display = "none";
  coconutErrorEl.style.display = "block";
}

async function refresh(): Promise<void> {
  const response = await chrome.runtime.sendMessage({
    type: "GET_STATUS",
  });

  if (
    response &&
    typeof response === "object" &&
    "error" in response &&
    response.error === COCONUT_MISSING_ERROR
  ) {
    showCoconutError();
    return;
  }

  const status = response as ExtensionStatus;

  pendingEl.textContent = String(status.pendingCount);
  todayEl.textContent = `${status.todayReplays} / ${status.maxReplaysPerDay}`;
  stateEl.textContent = status.paused ? "Paused" : "Active";
  stateEl.className = status.paused ? "status-paused" : "";
  bingEl.textContent = status.msLoggedIn ? "Yes" : "No — sign in on Bing";

  if (!status.cloudConfigured) {
    cloudEl.textContent = "Not configured — open Settings";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "none";
  } else if (status.cloudConnected) {
    cloudEl.textContent = "Connected";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    cloudEl.textContent = "Configured — sign in";
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }

  currentPaused = status.paused;
  togglePauseBtn.textContent = status.paused ? "Resume" : "Pause";
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
