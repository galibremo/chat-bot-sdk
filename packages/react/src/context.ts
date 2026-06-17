import { createContext, useContext } from 'react';
import type { ChatbotCore } from '@typetechit/chatbot-core';

export const ChatbotContext = createContext<ChatbotCore | null>(null);

export function useChatbotContext(): ChatbotCore {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error('useChatbot must be used inside <ChatbotProvider>.');
  return ctx;
}
