'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage, ChatbotState } from '@typetechit/chatbot-types';
import { useChatbotContext } from '../context';

export interface UseChatbotReturn {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  sendMessage: (text: string) => Promise<void>;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useChatbot(): UseChatbotReturn {
  const instance = useChatbotContext();

  const [state, setState] = useState<ChatbotState>(() => instance.getState());

  useEffect(() => {
    // Keep local state in sync with core instance events
    const offMessage = instance.on('message', () => {
      setState({ ...instance.getState() });
    });
    const offOpen = instance.on('open', () => {
      setState((s) => ({ ...s, isOpen: true }));
    });
    const offClose = instance.on('close', () => {
      setState((s) => ({ ...s, isOpen: false }));
    });
    const offError = instance.on('error', () => {
      setState({ ...instance.getState() });
    });

    return () => {
      offMessage();
      offOpen();
      offClose();
      offError();
    };
  }, [instance]);

  const sendMessage = useCallback(
    (text: string) => instance.sendMessage(text),
    [instance],
  );
  const open = useCallback(() => instance.open(), [instance]);
  const close = useCallback(() => instance.close(), [instance]);
  const toggle = useCallback(() => instance.toggle(), [instance]);

  return {
    messages: state.messages,
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    error: state.error,
    sessionId: state.sessionId,
    sendMessage,
    open,
    close,
    toggle,
  };
}
