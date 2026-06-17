const SESSION_KEY = 'typetechit_chatbot_session_id';

export class SessionManager {
  private sessionId: string | null = null;

  init(providedSessionId?: string): string {
    if (providedSessionId) {
      this.sessionId = providedSessionId;
      this.persist();
      return this.sessionId;
    }

    if (typeof window === 'undefined') {
      this.sessionId = this.generateId();
      return this.sessionId;
    }

    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      this.sessionId = stored;
    } else {
      this.sessionId = this.generateId();
      this.persist();
    }

    return this.sessionId;
  }

  get(): string | null {
    return this.sessionId;
  }

  reset(): string {
    this.sessionId = this.generateId();
    this.persist();
    return this.sessionId;
  }

  private persist(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, this.sessionId!);
    }
  }

  private generateId(): string {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
