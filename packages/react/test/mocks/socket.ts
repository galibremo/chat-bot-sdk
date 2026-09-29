import { vi } from 'vitest';

type SocketHandler = (...args: unknown[]) => void;

/** The subset of a socket.io `Socket` that `SdkSocket` uses, plus test controls. */
export interface MockSocket {
  url: string;
  options: unknown;
  connected: boolean;
  on: ReturnType<typeof vi.fn<(event: string, handler: SocketHandler) => MockSocket>>;
  removeAllListeners: ReturnType<typeof vi.fn<() => MockSocket>>;
  disconnect: ReturnType<typeof vi.fn<() => MockSocket>>;
  /** Simulate the server pushing `event` to this client. */
  serverEmit: (event: string, ...args: unknown[]) => void;
  /** Number of handlers still registered, across every event. */
  listenerCount: () => number;
}

/** Every socket `io()` created since the last reset, oldest first. */
export const sockets: MockSocket[] = [];

function createMockSocket(url: string, options: unknown): MockSocket {
  const listeners = new Map<string, SocketHandler[]>();
  const socket: MockSocket = {
    url,
    options,
    connected: false,
    on: vi.fn((event: string, handler: SocketHandler) => {
      listeners.set(event, [...(listeners.get(event) ?? []), handler]);
      return socket;
    }),
    removeAllListeners: vi.fn(() => {
      listeners.clear();
      return socket;
    }),
    disconnect: vi.fn(() => {
      socket.connected = false;
      return socket;
    }),
    serverEmit: (event, ...args) => {
      if (event === 'connect') socket.connected = true;
      for (const handler of listeners.get(event) ?? []) handler(...args);
    },
    listenerCount: () => [...listeners.values()].reduce((sum, list) => sum + list.length, 0),
  };
  return socket;
}

export const io = vi.fn((url: string, options?: unknown): MockSocket => {
  const socket = createMockSocket(url, options);
  sockets.push(socket);
  return socket;
});

export function resetSocketMock(): void {
  sockets.length = 0;
  io.mockClear();
}
