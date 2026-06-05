import type {
  CompleteQueueBody,
  PostSearchBody,
  QueueItem,
  ReplayStats,
  UserSettings,
} from "@syncx/shared";
import { getAccessToken, logout } from "../auth/cognitoPkce";
import { getCloudConfig, isCloudConfigured } from "../config/cloudConfig";

async function getApiUrl(): Promise<string> {
  const config = await getCloudConfig();
  if (!config) {
    throw new Error("Cloud backend not configured.");
  }
  return config.apiUrl;
}

async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const apiUrl = await getApiUrl();

  let token = await getAccessToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(`${apiUrl}${path}`, { ...init, headers });

  if (response.status === 401) {
    token = await getAccessToken();
    if (!token) {
      await logout();
      throw new Error("Session expired");
    }
    headers.set("Authorization", `Bearer ${token}`);
    response = await fetch(`${apiUrl}${path}`, { ...init, headers });
    if (response.status === 401) {
      await logout();
      throw new Error("Session expired");
    }
  }

  return response;
}

export function isApiConfigured(): boolean {
  return false;
}

export async function postSearch(body: PostSearchBody): Promise<{
  eventId: string;
  queueId: string;
}> {
  const response = await authFetch("/v1/events/search", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`postSearch failed: ${response.status}`);
  }
  return response.json() as Promise<{ eventId: string; queueId: string }>;
}

export async function getPending(): Promise<QueueItem | null> {
  const response = await authFetch("/v1/queue/pending?limit=1");
  if (response.status === 204) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`getPending failed: ${response.status}`);
  }
  return response.json() as Promise<QueueItem>;
}

export async function completeQueueItem(
  id: string,
  body: CompleteQueueBody,
): Promise<void> {
  const response = await authFetch(
    `/v1/queue/${encodeURIComponent(id)}/complete`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error(`completeQueueItem failed: ${response.status}`);
  }
}

export async function getStats(): Promise<ReplayStats> {
  const response = await authFetch("/v1/stats/today");
  if (!response.ok) {
    throw new Error(`getStats failed: ${response.status}`);
  }
  return response.json() as Promise<ReplayStats>;
}

export async function getSettings(): Promise<UserSettings> {
  const response = await authFetch("/v1/settings");
  if (!response.ok) {
    throw new Error(`getSettings failed: ${response.status}`);
  }
  return response.json() as Promise<UserSettings>;
}

export async function patchSettings(
  settings: Partial<UserSettings>,
): Promise<UserSettings> {
  const response = await authFetch("/v1/settings", {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    throw new Error(`patchSettings failed: ${response.status}`);
  }
  return response.json() as Promise<UserSettings>;
}

export async function deleteUser(): Promise<void> {
  const response = await authFetch("/v1/user", { method: "DELETE" });
  if (response.status !== 204) {
    throw new Error(`deleteUser failed: ${response.status}`);
  }
}

export async function isAuthenticated(): Promise<boolean> {
  if (!(await isCloudConfigured())) {
    return false;
  }
  try {
    const token = await getAccessToken();
    return token !== null;
  } catch {
    return false;
  }
}

export { logout } from "../auth/cognitoPkce";
export { login } from "../auth/cognitoPkce";
