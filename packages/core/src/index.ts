export { ChatbotCore } from './chatbot-core';
export { ApiClient } from './api-client';
export { EventEmitter } from './event-emitter';
export { SessionManager } from './session-manager';
export type {
  ChatbotInitOptions,
  ChatbotState,
  ChatbotEventMap,
  ChatMessage,
  ApiError,
  ApiResponse,
  ChatRequest,
  ChatResponseData,
} from '@typetechit/chatbot-types';

// ─── IIFE / CDN global singleton ──────────────────────────────────────────────
// Vite builds the IIFE with name 'TypeTechITChatbot', making this
// available as window.TypeTechITChatbot in script-tag usage.

import { ChatbotCore } from './chatbot-core';
import type { ChatbotInitOptions } from '@typetechit/chatbot-types';

let _instance: ChatbotCore | null = null;

export const TypeTechITChatbot = {
  async init(options: ChatbotInitOptions): Promise<ChatbotCore> {
    _instance = new ChatbotCore();
    await _instance.init(options);
    return _instance;
  },
  getInstance(): ChatbotCore | null {
    return _instance;
  },
};
