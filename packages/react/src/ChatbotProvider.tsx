'use client';

import React, { useEffect, useRef, type ReactNode } from 'react';
import { ChatbotCore } from '@typetechit/chatbot-core';
import type { ChatbotInitOptions } from '@typetechit/chatbot-types';
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
    void instance.init(options);
    return () => instance.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChatbotContext.Provider value={instanceRef.current}>
      {children}
    </ChatbotContext.Provider>
  );
}
