'use client';

import React, { useEffect, useRef, type ReactNode } from 'react';
import { ChatbotCore } from '@onedeskpro/chatbot-core';
import type { ChatbotInitOptions } from '@onedeskpro/chatbot-types';
import { ChatbotContext } from './context';

export type ChatbotProviderProps = ChatbotInitOptions & {
  children: ReactNode;
};

export function ChatbotProvider({ children, ...options }: ChatbotProviderProps) {
  const instanceRef = useRef<ChatbotCore | null>(null);

  // Instantiate once — never recreate on re-render
  if (!instanceRef.current) {
    instanceRef.current = new ChatbotCore();
  }

  useEffect(() => {
    const instance = instanceRef.current!;
    // init() rejects on a misconfiguration such as a missing apiKey; surface it
    // rather than leaving an unhandled rejection.
    instance.init(options).catch((err: unknown) => {
      console.error('[onedeskpro-chatbot] Failed to initialise:', err);
    });
    return () => instance.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChatbotContext.Provider value={instanceRef.current}>
      {children}
    </ChatbotContext.Provider>
  );
}
