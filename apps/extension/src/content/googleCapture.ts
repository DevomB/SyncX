import {
  DEFAULT_DEDUP_WINDOW_MS,
  GOOGLE_SEARCH_PARAM,
  MIN_QUERY_LENGTH,
} from "@syncx/shared";

const LAST_Q_KEY = "syncx:lastQ";
const LAST_Q_TIME_KEY = "syncx:lastQTime";

function normalizeQuery(q: string): string {
  return q.trim();
}

function shouldEmit(query: string, dedupWindowMs: number): boolean {
  const normalized = normalizeQuery(query);
  if (normalized.length < MIN_QUERY_LENGTH) {
    return false;
  }

  const lastQ = sessionStorage.getItem(LAST_Q_KEY);
  const lastTime = Number(sessionStorage.getItem(LAST_Q_TIME_KEY) ?? "0");
  const now = Date.now();

  if (
    lastQ === normalized.toLowerCase() &&
    now - lastTime < dedupWindowMs
  ) {
    return false;
  }

  sessionStorage.setItem(LAST_Q_KEY, normalized.toLowerCase());
  sessionStorage.setItem(LAST_Q_TIME_KEY, String(now));
  return true;
}

function emitCapture(query: string): void {
  const normalized = normalizeQuery(query);
  if (!shouldEmit(normalized, DEFAULT_DEDUP_WINDOW_MS)) {
    return;
  }

  void chrome.runtime.sendMessage({
    type: "CAPTURE_SEARCH",
    query: normalized,
    sourceUrl: location.href,
    capturedAt: Date.now(),
  });
}

function captureFromUrl(): void {
  const q = new URLSearchParams(location.search).get(GOOGLE_SEARCH_PARAM);
  if (q) {
    emitCapture(q);
  }
}

function hookHistory(): void {
  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  history.pushState = (...args) => {
    originalPushState(...args);
    captureFromUrl();
  };

  history.replaceState = (...args) => {
    originalReplaceState(...args);
    captureFromUrl();
  };

  window.addEventListener("popstate", captureFromUrl);
}

function setupFormListeners(): void {
  document.addEventListener(
    "submit",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLFormElement)) {
        return;
      }
      if (target.getAttribute("role") !== "search") {
        return;
      }
      const input = target.querySelector<HTMLInputElement>('input[name="q"]');
      if (input?.value) {
        emitCapture(input.value);
      }
    },
    true,
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Enter") {
        return;
      }
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.name !== "q") {
        return;
      }
      if (target.value) {
        emitCapture(target.value);
      }
    },
    true,
  );
}

hookHistory();
setupFormListeners();
captureFromUrl();
