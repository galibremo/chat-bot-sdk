import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { seedVisitorToken } from '../test/factories/visitor.factory';
import { sockets } from '../test/mocks/socket';
import { renderWithProvider, widgetHostCount } from '../test/render-chat';
import { ChatbotProvider } from './chatbot-provider';
import { useChatbot } from './hooks/use-chatbot';

function ReadyFlag() {
  const { isReady } = useChatbot();
  return <span role="status" aria-label="ready">{String(isReady)}</span>;
}

const ready = () => screen.getByRole('status', { name: 'ready' });

describe('ChatbotProvider', () => {
  beforeEach(() => {
    seedVisitorToken();
  });

  it('should mount exactly one widget when rendered under StrictMode', async () => {
    // Arrange / Act
    renderWithProvider(<ReadyFlag />, { strict: true });

    // Assert
    await waitFor(() => expect(ready()).toHaveTextContent('true'));
    expect(widgetHostCount()).toBe(1);
  });

  it('should remove the widget when the provider unmounts', async () => {
    // Arrange
    const { unmount } = renderWithProvider(<ReadyFlag />);
    await waitFor(() => expect(widgetHostCount()).toBe(1));

    // Act
    unmount();

    // Assert
    expect(widgetHostCount()).toBe(0);
  });

  it('should leave no socket, listeners or DOM nodes behind when the provider unmounts', async () => {
    // Arrange
    const { unmount, container } = renderWithProvider(<ReadyFlag />);
    await waitFor(() => expect(ready()).toHaveTextContent('true'));
    await waitFor(() => expect(sockets).toHaveLength(1));
    const [socket] = sockets;

    // Act
    unmount();

    // Assert
    expect(socket.disconnect).toHaveBeenCalledTimes(1);
    expect(socket.listenerCount()).toBe(0);
    expect(widgetHostCount()).toBe(0);
    // Only Testing Library's own (now empty) container is left in the body.
    expect(Array.from(document.body.children)).toEqual([container]);
    expect(container).toBeEmptyDOMElement();
  });

  it('should log a prefixed error instead of an unhandled rejection when init fails', async () => {
    // Arrange
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    render(
      <ChatbotProvider apiKey="">
        <ReadyFlag />
      </ChatbotProvider>,
    );

    // Assert
    await waitFor(() =>
      expect(log).toHaveBeenCalledWith('[onedeskpro-chatbot] Failed to initialise:', expect.any(Error)),
    );
    expect(ready()).toHaveTextContent('false');
  });
});
