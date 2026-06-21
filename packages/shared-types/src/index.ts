// ─── Init Options ─────────────────────────────────────────────────────────────

export interface ChatbotInitOptions {
  apiKey: string;
  apiBaseUrl?: string;
  chatbotName?: string;
  primaryColor?: string;
  theme?: 'light' | 'dark' | 'auto';
  position?: 'bottom-right' | 'bottom-left';
  welcomeMessage?: string;
  placeholder?: string;
  autoOpen?: boolean;
  sessionId?: string;
}

// ─── API Shapes ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  code: string;
  timestamp: string;
  path: string;
}

export interface ChatRequest {
  chatInput: string;
  sessionId?: string;
}

export interface ChatResponseData {
  text: string;
}

export interface ChatMessage {
  id: number;
  sessionId: string;
  message: {
    type: 'human' | 'ai';
    content: string;
  };
}

// ─── Readiness ────────────────────────────────────────────────────────────────

export type ChatbotBlockReason = 'no-origin' | 'no-prompt' | null;

export interface ChatbotSettingsResponse {
  origin: string | null;
}

export interface KnowledgeBaseResponse {
  systemMessage: string | null;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type ChatbotEventMap = {
  message: ChatMessage;
  open: void;
  close: void;
  error: Error;
  'session-reset': void;
  ready: void;
};

// ─── State ────────────────────────────────────────────────────────────────────

export interface ChatbotState {
  isOpen: boolean;
  isLoading: boolean;
  isReady: boolean;
  blockReason: ChatbotBlockReason;
  messages: ChatMessage[];
  sessionId: string | null;
  error: string | null;
}
