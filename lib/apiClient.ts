type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const REQUEST_TIMEOUT_MS = 30_000;

interface ApiRequestOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number>;
  cache?: RequestCache;
  useBasicAuth?: boolean;
  next?: { revalidate?: number | false; tags?: string[] };
  timeoutMs?: number;
}

export async function apiRequest(endpoint: string, options: ApiRequestOptions = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    next = { revalidate: 300 },
    cache = (next?.revalidate !== undefined || (next?.tags && next.tags.length > 0)) ? undefined : 'no-store',
    useBasicAuth = true,
    timeoutMs = REQUEST_TIMEOUT_MS,
  } = options;

  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!rawBaseUrl) {
    throw new Error('Missing API_BASE_URL in environment variables');
  }

  const baseUrl = rawBaseUrl.replace(/\/+$/, '');

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const queryString = params
    ? '?' +
      new URLSearchParams(
        Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
      ).toString()
    : '';

  let authHeader: Record<string, string> = {};
  if (useBasicAuth) {
    const username = process.env.API_USERNAME;
    const password = process.env.API_PASSWORD;
    if (!username || !password) {
      throw new Error('Missing BASIC_AUTH_USERNAME or BASIC_AUTH_PASSWORD');
    }

    authHeader = {
      Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
    };
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const url = `${baseUrl}${normalizedEndpoint}${queryString}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...authHeader,
        ...headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      cache,
      next,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  const contentType = res.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!res.ok) {
    if (isJson) {
      return await res.json();
    } else {
      return {
        error: 'Server returned an error in an unexpected format',
        status: res.status,
        statusText: res.statusText,
      };
    }
  }

  if (isJson) {
    return res.json();
  } else {
    throw new Error(
      `Expected JSON response but got: ${contentType} from ${url}`,
    );
  }
}
