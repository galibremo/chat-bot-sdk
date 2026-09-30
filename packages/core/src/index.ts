export { ChatbotCore } from './chatbot-core';
export { DEFAULT_API_BASE_URL } from './constants';
export { ApiClient, DEFAULT_REQUEST_TIMEOUT_MS, isChatbotRequestError } from './api-client';
export type { ChatbotRequestError } from './api-client';
export { EventEmitter } from './event-emitter';
export { SessionManager } from './session-manager';
export { SdkSocket, resolveSdkSocketUrl } from './sdk-socket';
export type { SdkSocketConnectOptions } from './sdk-socket';
export type {
  ChatbotInitOptions,
  ChatbotState,
  ChatbotEventMap,
  ChatbotTicketMode,
  ChatMessage,
  ApiError,
  ApiResponse,
  ChatRequest,
  ChatResponseData,
  IdentifyRequest,
  IdentifyResponseData,
  VisitorVerifyResponse,
  SdkConfigResponse,
  ChatbotBlockReason,
  TicketStatusData,
} from '@onedeskpro/chatbot-types';

// ─── IIFE / CDN global singleton ──────────────────────────────────────────────
// Vite builds the IIFE with name 'OnedeskProChatbot', making this
// available as window.OnedeskProChatbot in script-tag usage.

import { ChatbotCore } from './chatbot-core';
import type { ChatbotInitOptions } from '@onedeskpro/chatbot-types';

let _instance: ChatbotCore | null = null;

export const OnedeskProChatbot = {
  async init(options: ChatbotInitOptions): Promise<ChatbotCore> {
    _instance = new ChatbotCore();
    await _instance.init(options);
    return _instance;
  },
  getInstance(): ChatbotCore | null {
    return _instance;
  },
};
