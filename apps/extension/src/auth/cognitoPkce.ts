import { SESSION_KEYS } from "@syncx/shared";
import {
  getCloudConfig,
  getOAuthRedirectUri,
  isCloudConfigured,
} from "../config/cloudConfig";

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

async function requireConfig(): Promise<{
  domain: string;
  clientId: string;
}> {
  const config = await getCloudConfig();
  if (!config) {
    throw new Error(
      "Cloud backend not configured. Open Settings and enter your API URL and Cognito credentials.",
    );
  }
  return {
    domain: config.cognitoDomain,
    clientId: config.cognitoClientId,
  };
}

async function storeTokens(tokens: {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}): Promise<void> {
  const expiresAt = Date.now() + tokens.expires_in * 1000;
  await chrome.storage.session.set({
    [SESSION_KEYS.accessToken]: tokens.access_token,
    [SESSION_KEYS.expiresAt]: expiresAt,
    ...(tokens.refresh_token
      ? { [SESSION_KEYS.refreshToken]: tokens.refresh_token }
      : {}),
  });
}

async function exchangeCodeForTokens(
  code: string,
  domain: string,
  clientId: string,
): Promise<void> {
  const redirectUri = getOAuthRedirectUri();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(`https://${domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  const tokens = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  await storeTokens(tokens);
}

export async function login(): Promise<void> {
  const { domain, clientId } = await requireConfig();
  const redirectUri = getOAuthRedirectUri();

  const authUrl = new URL(`https://${domain}/oauth2/authorize`);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("redirect_uri", redirectUri);

  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authUrl.toString(),
    interactive: true,
  });

  if (!responseUrl) {
    throw new Error("Login cancelled");
  }

  const url = new URL(responseUrl);
  const code = url.searchParams.get("code");
  if (!code) {
    const error =
      url.searchParams.get("error_description") ?? "No authorization code";
    throw new Error(error);
  }

  await exchangeCodeForTokens(code, domain, clientId);
}

async function refreshAccessToken(): Promise<boolean> {
  const { domain, clientId } = await requireConfig();
  const session = await chrome.storage.session.get([
    SESSION_KEYS.refreshToken,
  ]);
  const refreshToken = session[SESSION_KEYS.refreshToken] as string | undefined;
  if (!refreshToken) {
    return false;
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });

  const response = await fetch(`https://${domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    return false;
  }

  const tokens = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  await storeTokens(tokens);
  return true;
}

export async function getAccessToken(): Promise<string | null> {
  if (!(await isCloudConfigured())) {
    return null;
  }

  const session = await chrome.storage.session.get([
    SESSION_KEYS.accessToken,
    SESSION_KEYS.expiresAt,
  ]);

  const accessToken = session[SESSION_KEYS.accessToken] as string | undefined;
  const expiresAt = session[SESSION_KEYS.expiresAt] as number | undefined;

  if (!accessToken || !expiresAt) {
    return null;
  }

  if (Date.now() < expiresAt - TOKEN_REFRESH_BUFFER_MS) {
    return accessToken;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    await logout();
    return null;
  }

  const updated = await chrome.storage.session.get(SESSION_KEYS.accessToken);
  return (updated[SESSION_KEYS.accessToken] as string | undefined) ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  if (!(await isCloudConfigured())) {
    return false;
  }
  const token = await getAccessToken();
  return token !== null;
}

export async function logout(): Promise<void> {
  await chrome.storage.session.remove([
    SESSION_KEYS.accessToken,
    SESSION_KEYS.refreshToken,
    SESSION_KEYS.expiresAt,
  ]);
}

export { isCloudConfigured as isCognitoConfigured };
