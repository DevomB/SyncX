import { STORAGE_KEYS, type CloudBackendConfig } from "@syncx/shared";

function trimOptional(value: string | undefined): string {
  return value?.trim() ?? "";
}

function normalizeDomain(domain: string): string {
  return domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

export function normalizeApiUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

function parseHttpsApiUrl(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(normalizeApiUrl(url));
  } catch {
    throw new Error("API URL must be a valid https URL.");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("API URL must use https to protect your access tokens.");
  }
  return parsed;
}

export function assertHttpsApiUrl(url: string): void {
  parseHttpsApiUrl(url);
}

function envFallback(): Partial<CloudBackendConfig> {
  return {
    apiUrl: trimOptional(import.meta.env.VITE_API_URL as string | undefined),
    cognitoDomain: normalizeDomain(
      trimOptional(import.meta.env.VITE_COGNITO_DOMAIN as string | undefined),
    ),
    cognitoClientId: trimOptional(
      import.meta.env.VITE_COGNITO_CLIENT_ID as string | undefined,
    ),
  };
}

export async function getCloudConfig(): Promise<CloudBackendConfig | null> {
  const stored = await chrome.storage.local.get(STORAGE_KEYS.cloudConfig);
  const fromStorage = stored[STORAGE_KEYS.cloudConfig] as
    | Partial<CloudBackendConfig>
    | undefined;
  const fallback = envFallback();

  const apiUrl = normalizeApiUrl(fromStorage?.apiUrl ?? fallback.apiUrl ?? "");
  const cognitoDomain = normalizeDomain(
    fromStorage?.cognitoDomain ?? fallback.cognitoDomain ?? "",
  );
  const cognitoClientId = trimOptional(
    fromStorage?.cognitoClientId ?? fallback.cognitoClientId ?? "",
  );

  if (!apiUrl || !cognitoDomain || !cognitoClientId) {
    return null;
  }

  try {
    parseHttpsApiUrl(apiUrl);
  } catch {
    return null;
  }

  return { apiUrl, cognitoDomain, cognitoClientId };
}

export async function saveCloudConfig(
  config: CloudBackendConfig,
): Promise<void> {
  const normalized: CloudBackendConfig = {
    apiUrl: normalizeApiUrl(config.apiUrl),
    cognitoDomain: normalizeDomain(config.cognitoDomain),
    cognitoClientId: config.cognitoClientId.trim(),
  };

  if (
    !normalized.apiUrl ||
    !normalized.cognitoDomain ||
    !normalized.cognitoClientId
  ) {
    throw new Error("All cloud backend fields are required.");
  }

  assertHttpsApiUrl(normalized.apiUrl);

  await requestCloudPermissions(normalized);
  await chrome.storage.local.set({
    [STORAGE_KEYS.cloudConfig]: normalized,
  });
}

export async function clearCloudConfig(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEYS.cloudConfig);
}

export async function isCloudConfigured(): Promise<boolean> {
  return (await getCloudConfig()) !== null;
}

export async function requestCloudPermissions(
  config: CloudBackendConfig,
): Promise<void> {
  const origins = new Set<string>();
  origins.add(`${parseHttpsApiUrl(config.apiUrl).origin}/*`);

  origins.add(`https://${normalizeDomain(config.cognitoDomain)}/*`);

  const needed = [...origins];
  const has = await chrome.permissions.contains({ origins: needed });
  if (!has) {
    const granted = await chrome.permissions.request({ origins: needed });
    if (!granted) {
      throw new Error(
        "Host permissions required to reach your API and Cognito domain.",
      );
    }
  }
}

export function getOAuthRedirectUri(): string {
  return chrome.identity.getRedirectURL("syncx");
}

export async function testCloudHealth(apiUrl: string): Promise<boolean> {
  parseHttpsApiUrl(apiUrl);
  const normalized = normalizeApiUrl(apiUrl);
  const response = await fetch(`${normalized}/health`);
  return response.ok;
}
