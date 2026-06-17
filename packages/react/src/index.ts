export { ChatbotProvider } from './ChatbotProvider';
export type { ChatbotProviderProps } from './ChatbotProvider';

export { ChatbotWidget, ChatbotHeadless } from './ChatbotWidget';
export type { ChatbotHeadlessProps } from './ChatbotWidget';

export { useChatbot } from './hooks/useChatbot';
export type { UseChatbotReturn } from './hooks/useChatbot';

export { ChatbotContext } from './context';

// Re-export core types for convenience so consumers only need this package
export type {
  ChatbotInitOptions,
  ChatbotState,
  ChatMessage,
  ChatbotEventMap,
} from '@typetechit/chatbot-types';
