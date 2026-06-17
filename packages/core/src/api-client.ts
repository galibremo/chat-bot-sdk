import type {
  ApiError,
  ApiResponse,
  ChatMessage,
  ChatRequest,
  ChatResponseData,
} from '@typetechit/chatbot-types';

interface ApiClientOptions {
  baseUrl: string;
  apiKey: string;
}

export class ApiClient {
  private baseUrl: string;
  private apiKey: string;
  private csrfToken: string | null = null;
  private csrfFetchPromise: Promise<string | null> | null = null;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.apiKey = options.apiKey;
  }

  // ─── CSRF ──────────────────────────────────────────────────────────────────

  private async fetchCsrfToken(): Promise<string | null> {
    // Deduplicate concurrent calls
    if (this.csrfFetchPromise) return this.csrfFetchPromise;

    this.csrfFetchPromise = (async () => {
      try {
        const res = await fetch(`${this.baseUrl}/csrf`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'X-API-Key': this.apiKey },
        });

        if (!res.ok) {
          console.warn('[TypeTechIT SDK] CSRF token fetch failed:', res.status);
          return null;
        }

        // Backend returns raw token string (not JSON-wrapped)
        const token = await res.text();
        this.csrfToken = token.trim();
        return this.csrfToken;
      } catch (err) {
        console.error('[TypeTechIT SDK] CSRF fetch error:', err);
        return null;
      } finally {
        this.csrfFetchPromise = null;
      }
    })();

    return this.csrfFetchPromise;
  }

  private async ensureCsrfToken(): Promise<string | null> {
    if (this.csrfToken) return this.csrfToken;
    return this.fetchCsrfToken();
  }

  private async refreshCsrfToken(): Promise<string | null> {
    this.csrfToken = null;
    return this.fetchCsrfToken();
  }

  // ─── HTTP ──────────────────────────────────────────────────────────────────

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    body?: unknown,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
    };

    if (method !== 'GET') {
      const token = await this.ensureCsrfToken();
      if (token) headers['x-csrf-token'] = token;
    }

    const init: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    let res = await fetch(url.toString(), init);

    // 403 = CSRF expired — refresh and retry once
    if (res.status === 403 && method !== 'GET') {
      const newToken = await this.refreshCsrfToken();
      if (newToken) {
        headers['x-csrf-token'] = newToken;
        res = await fetch(url.toString(), { ...init, headers });
      }
    }

    const json = (await res.json()) as ApiResponse<T> | ApiError;

    if (!res.ok) {
      const err = json as ApiError;
      const error = Object.assign(new Error(err.message || 'Request failed'), { apiError: err });
      throw error;
    }

    return (json as ApiResponse<T>).data;
  }

  // ─── Domain methods ────────────────────────────────────────────────────────

  async sendMessage(payload: ChatRequest): Promise<ChatResponseData> {
    return this.request<ChatResponseData>('POST', '/n8n/chat', payload);
  }

  async fetchHistory(sessionId: string): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>('GET', '/n8n/fetch-chat', undefined, { sessionId });
  }

  async warmCsrf(): Promise<void> {
    await this.fetchCsrfToken();
  }
}
