export const LOCAL_OPENAI_PROVIDER_ID = "local-openai";
export const DEFAULT_LOCAL_OPENAI_BASE_URL = "http://127.0.0.1:1234/v1";
export const DEFAULT_LOCAL_OPENAI_API_KEY = "lm-studio";

const CHAT_COMPLETIONS_SUFFIX = "/chat/completions";

/** Normalize an OpenAI-compatible base URL to the `/v1` API root. */
export function normalizeOpenAICompatibleBaseUrl(input: string): string | null {
  try {
    const url = new URL(input.trim());

    let pathname = url.pathname.replace(/\/+$/, "");
    if (pathname.endsWith(CHAT_COMPLETIONS_SUFFIX)) {
      pathname = pathname.slice(0, -CHAT_COMPLETIONS_SUFFIX.length);
    }

    if (!pathname || pathname === "/") {
      pathname = "/v1";
    } else if (!pathname.endsWith("/v1")) {
      pathname = `${pathname}/v1`;
    }

    url.pathname = pathname;
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function isLocalOpenAIProvider(providerId: string): boolean {
  return providerId === LOCAL_OPENAI_PROVIDER_ID;
}

export function resolveLocalOpenAIApiKey(apiKey: string | undefined): string {
  const key = apiKey?.trim();
  return key && key.length > 0 ? key : DEFAULT_LOCAL_OPENAI_API_KEY;
}

export function resolveLocalOpenAIBaseUrl(baseUrl: string | undefined): string {
  const normalized = baseUrl
    ? normalizeOpenAICompatibleBaseUrl(baseUrl)
    : normalizeOpenAICompatibleBaseUrl(DEFAULT_LOCAL_OPENAI_BASE_URL);

  return normalized ?? DEFAULT_LOCAL_OPENAI_BASE_URL;
}

function localServerRootFromBaseUrl(baseUrl: string): string | null {
  try {
    const url = new URL(resolveLocalOpenAIBaseUrl(baseUrl));
    let pathname = url.pathname.replace(/\/+$/, "");
    if (pathname.endsWith("/v1")) {
      pathname = pathname.slice(0, -3);
    }
    url.pathname = pathname || "/";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

interface LoadModelErrorShape {
  error?: {
    type?: string;
    message?: string;
  };
  message?: string;
}

/**
 * Ask a local server to load a model before generation.
 *
 * Many LM Studio setups keep a single active model and may ignore the
 * OpenAI `model` parameter unless a model is loaded explicitly.
 *
 * Returns null on success or when the endpoint is unsupported. Returns an
 * error message when model loading is supported but fails.
 */
export async function ensureLocalModelLoaded(
  modelId: string,
  baseUrl: string | undefined,
  apiKey: string | undefined,
): Promise<string | null> {
  const serverRoot = localServerRootFromBaseUrl(baseUrl ?? DEFAULT_LOCAL_OPENAI_BASE_URL);
  if (!serverRoot) {
    return "Invalid local server URL";
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const token = apiKey?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${serverRoot}/api/v1/models/load`, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: modelId }),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });

    if (res.ok) {
      return null;
    }

    const raw = await res.text();
    let payload: LoadModelErrorShape = {};
    try {
      payload = raw ? JSON.parse(raw) as LoadModelErrorShape : {};
    } catch {
      payload = {};
    }

    if (res.status === 404 || res.status === 405) {
      // Non-LM Studio local servers may not implement this endpoint.
      // If we got a structured error message, surface it. Otherwise ignore.
      const maybeMessage = payload.error?.message || payload.message;
      return maybeMessage ?? null;
    }

    return payload.error?.message || payload.message || `Model load failed with status ${res.status}`;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return `Could not switch local model: ${message}`;
  }
}
