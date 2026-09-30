import { io, type Socket } from 'socket.io-client';
import type { TicketStatusData } from '@onedeskpro/chatbot-types';

export interface SdkSocketConnectOptions {
  /** API base URL (may include a path prefix); origin is used for the `/sdk` namespace. */
  baseUrl: string;
  apiKey: string;
  visitorToken: string;
  onTicketStatus?: (payload: TicketStatusData) => void;
  /** Raw inbox-shaped payload from `message:receive` (mapped in ChatbotCore later). */
  onMessageReceive?: (payload: unknown) => void;
  /**
   * Fired on socket.io `connect` after the first successful connection
   * (i.e. reconnect). Callers should re-fetch ticket status — no history backfill.
   */
  onReconnect?: () => void;
  onConnectError?: (error: Error) => void;
}

/**
 * Strip any path/query/hash from an API base URL so Socket.IO connects to the
 * server origin + `/sdk` namespace (not `/v1/sdk` if the REST client uses a path prefix).
 */
export function resolveSdkSocketUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/$/, '');
  try {
    const url = new URL(trimmed);
    return `${url.origin}/sdk`;
  } catch {
    return `${trimmed}/sdk`;
  }
}

/**
 * Visitor Socket.IO helper for the dedicated `/sdk` namespace.
 * Auth is handshake-only (`apiKey` + `visitorToken`); no BetterAuth session.
 */
export class SdkSocket {
  private socket: Socket | null = null;

  get connected(): boolean {
    return this.socket?.connected ?? false;
  }

  connect(opts: SdkSocketConnectOptions): void {
    this.disconnect();

    const url = resolveSdkSocketUrl(opts.baseUrl);
    this.socket = io(url, {
      auth: {
        apiKey: opts.apiKey,
        visitorToken: opts.visitorToken,
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
    });

    let hasConnectedOnce = false;
    this.socket.on('connect', () => {
      if (hasConnectedOnce) {
        opts.onReconnect?.();
        return;
      }
      hasConnectedOnce = true;
    });

    this.socket.on('ticket:status', (payload: TicketStatusData) => {
      opts.onTicketStatus?.(payload);
    });

    this.socket.on('message:receive', (payload: unknown) => {
      opts.onMessageReceive?.(payload);
    });

    this.socket.on('connect_error', (err: Error) => {
      opts.onConnectError?.(err);
    });
  }

  disconnect(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
  }
}
