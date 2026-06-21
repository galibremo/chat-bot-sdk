import type {
  ChatbotEventMap,
  ChatbotInitOptions,
  ChatbotState,
  ChatMessage,
} from '@typetechit/chatbot-types';
import { ApiClient } from './api-client';
import { EventEmitter } from './event-emitter';
import { SessionManager } from './session-manager';
import { ChatWidget } from './widget/widget';

type Listener<K extends keyof ChatbotEventMap> =
  ChatbotEventMap[K] extends void ? () => void : (payload: ChatbotEventMap[K]) => void;

const DEFAULTS = {
  apiBaseUrl: 'http://localhost:8080',
  chatbotName: 'AI Assistant',
  primaryColor: '#2563EB',
  theme: 'auto' as const,
  position: 'bottom-right' as const,
  welcomeMessage: '',
  placeholder: 'Type your message…',
  autoOpen: false,
  sessionId: '',
};

export class ChatbotCore {
  private apiClient!: ApiClient;
  private emitter = new EventEmitter();
  private session = new SessionManager();
  private widget: ChatWidget | null = null;
  private options!: Required<ChatbotInitOptions>;

  private _state: ChatbotState = {
    isOpen: false,
    isLoading: false,
    messages: [],
    sessionId: null,
    error: null,
  };

  async init(options: ChatbotInitOptions): Promise<void> {
    this.options = { ...DEFAULTS, ...options };

    this.apiClient = new ApiClient({
      baseUrl: this.options.apiBaseUrl,
      apiKey: this.options.apiKey,
    });

    const sessionId = this.session.init(this.options.sessionId || undefined);
    this._state.sessionId = sessionId;

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.widget = new ChatWidget(this.options, {
        onSend: (text) => void this.sendMessage(text),
        onOpen: () => {
          this._state.isOpen = true;
          this.emitter.emit('open');
        },
        onClose: () => {
          this._state.isOpen = false;
          this.emitter.emit('close');
        },
        onReset: () => this.resetSession(),
      });
    }

    // Warm CSRF token eagerly (non-blocking)
    void this.apiClient.warmCsrf();

    await this.loadHistory();
  }

  async sendMessage(text: string): Promise<void> {
    if (!text.trim() || this._state.isLoading) return;

    const sessionId = this.session.get()!;

    const optimistic: ChatMessage = {
      id: Date.now(),
      sessionId,
      message: { type: 'human', content: text },
    };
    this._state.messages.push(optimistic);
    this.widget?.appendMessage(optimistic);

    this._state.isLoading = true;
    this._state.error = null;
    this.widget?.setLoading(true);

    try {
      const response = await this.apiClient.sendMessage({ chatInput: text, sessionId });

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sessionId,
        message: { type: 'ai', content: response.text },
      };
      this._state.messages.push(aiMsg);
      this.widget?.appendMessage(aiMsg);
      this.emitter.emit('message', aiMsg);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this._state.error = error.message;
      this.emitter.emit('error', error);
    } finally {
      this._state.isLoading = false;
      this.widget?.setLoading(false);
    }
  }

  private async loadHistory(): Promise<void> {
    const sessionId = this.session.get();
    if (!sessionId) return;
    try {
      const messages = await this.apiClient.fetchHistory(sessionId);
      this._state.messages = messages;
      if (messages.length > 0) this.widget?.setMessages(messages);
    } catch {
      // History load failure is non-fatal
    }
  }

  on<K extends keyof ChatbotEventMap>(event: K, listener: Listener<K>): () => void {
    return this.emitter.on(event, listener);
  }

  resetSession(): void {
    const newId = this.session.reset();
    this._state.sessionId = newId;
    this._state.messages = [];
    this._state.error = null;
    this.widget?.clearMessages(this.options.chatbotName);
    this.emitter.emit('session-reset');
  }

  open(): void { this.widget?.open(); }
  close(): void { this.widget?.close(); }
  toggle(): void { this.widget?.toggle(); }

  getState(): Readonly<ChatbotState> {
    return { ...this._state };
  }

  destroy(): void {
    this.widget?.destroy();
    this.emitter.removeAllListeners();
  }
}
