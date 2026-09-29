import type { ChatResponseData, TicketStatusData } from '@onedeskpro/chatbot-types';

export function buildChatResponse(overrides: Partial<ChatResponseData> = {}): ChatResponseData {
  return { text: 'AI reply', sessionId: 's1', mode: 'ai', ...overrides };
}

export function buildTicketStatus(overrides: Partial<TicketStatusData> = {}): TicketStatusData {
  return { mode: 'ai', ...overrides };
}
