const THROTTLE_PHRASES = [
  "do not qualify for microsoft rewards",
  "after a specific period of time",
];

function detectThrottle(): void {
  const text = document.body?.innerText?.toLowerCase() ?? "";
  const throttled = THROTTLE_PHRASES.some((phrase) => text.includes(phrase));
  if (throttled) {
    void chrome.runtime.sendMessage({ type: "THROTTLE_DETECTED" });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", detectThrottle);
} else {
  detectThrottle();
}
