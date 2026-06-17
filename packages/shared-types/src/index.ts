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

// ─── Events ───────────────────────────────────────────────────────────────────

export type ChatbotEventMap = {
  message: ChatMessage;
  open: void;
  close: void;
  error: Error;
};

// ─── State ────────────────────────────────────────────────────────────────────

export interface ChatbotState {
  isOpen: boolean;
  isLoading: boolean;
  messages: ChatMessage[];
  sessionId: string | null;
  error: string | null;
}
