import { render } from '@testing-library/react';
import React, { StrictMode, type ReactElement } from 'react';
import { ChatbotProvider } from '../src/chatbot-provider';

/** Render `ui` inside a provider, optionally under StrictMode's double mount. */
export function renderWithProvider(ui: ReactElement, { strict = false } = {}) {
  const tree = <ChatbotProvider apiKey="k">{ui}</ChatbotProvider>;
  return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
}

export const widgetHostCount = (): number =>
  document.querySelectorAll('#onedeskpro-chatbot-host').length;

/** A promise the test resolves by hand, to hold a request open mid-flight. */
export function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
