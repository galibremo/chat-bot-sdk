import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http } from 'msw';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildChatResponse } from '../test/factories/chat.factory';
import { seedVisitorToken } from '../test/factories/visitor.factory';
import { ok, sdkUrl } from '../test/mocks/handlers';
import { server } from '../test/mocks/server';
import { deferred, widgetHostCount } from '../test/render-chat';
import { ChatbotProvider } from './chatbot-provider';
import { ChatbotHeadless } from './chatbot-widget';

describe('ChatbotHeadless', () => {
  beforeEach(() => {
    seedVisitorToken();
  });

  it('should drive custom UI through render props when the visitor sends a message', async () => {
    // Arrange
    const user = userEvent.setup();
    const reply = deferred<void>();
    server.use(
      http.post(sdkUrl('chat'), async () => {
        await reply.promise;
        return ok(buildChatResponse());
      }),
    );
    render(
      <ChatbotProvider apiKey="k">
        <ChatbotHeadless
          renderLauncher={({ toggle }) => <button onClick={toggle}>launch</button>}
          renderWindow={({ messages, isLoading, sendMessage }) => (
            <div>
              <span role="status" aria-label="count">{messages.length}</span>
              <span role="status" aria-label="loading">{String(isLoading)}</span>
              <button onClick={() => void sendMessage('from headless')}>go</button>
            </div>
          )}
        />
      </ChatbotProvider>,
    );
    expect(screen.getByRole('button', { name: 'launch' })).toBeInTheDocument();
    await waitFor(() => expect(widgetHostCount()).toBe(1));

    // Act
    await user.click(screen.getByRole('button', { name: 'go' }));

    // Assert
    expect(screen.getByRole('status', { name: 'count' })).toHaveTextContent('1');
    expect(screen.getByRole('status', { name: 'loading' })).toHaveTextContent('true');
    reply.resolve();
    await waitFor(() => expect(screen.getByRole('status', { name: 'count' })).toHaveTextContent('2'));
  });
});
