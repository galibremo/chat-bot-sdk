const TOKEN_KEY_PREFIX = 'onedeskpro_visitor_token';

/**
 * `typeof window !== 'undefined'` is not enough to reach localStorage safely:
 * Safari private mode, blocked site data, and sandboxed iframes all throw a
 * SecurityError on *access*, not just on write. The widget is embedded in
 * third-party pages, so both directions have to degrade to in-memory instead
 * of taking down init().
 */
function readStored(key: string): string | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable or full — the token lives in memory for this page.
  }
}

function removeStored(key: string): void {
  try {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
}

export class VisitorTokenManager {
  private token: string | null = null;
  private storageKey = TOKEN_KEY_PREFIX;

  /** Scope the token to an agent so multiple widgets on one origin stay isolated. */
  setScope(agentId: string | null | undefined): void {
    this.storageKey = agentId?.trim()
      ? `${TOKEN_KEY_PREFIX}:${agentId.trim()}`
      : TOKEN_KEY_PREFIX;
    this.token = readStored(this.storageKey);
  }

  get(): string | null {
    return this.token ?? readStored(this.storageKey);
  }

  set(token: string): void {
    this.token = token;
    writeStored(this.storageKey, token);
  }

  clear(): void {
    this.token = null;
    removeStored(this.storageKey);
  }
}

/** @deprecated Use VisitorTokenManager. Kept for import compatibility. */
export { VisitorTokenManager as SessionManager };
