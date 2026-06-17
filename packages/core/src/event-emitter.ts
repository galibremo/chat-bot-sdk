import type { ChatbotEventMap } from '@typetechit/chatbot-types';

type Listener<T> = T extends void ? () => void : (payload: T) => void;

export class EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _listeners: Partial<Record<keyof ChatbotEventMap, Array<(...args: any[]) => void>>> = {};

  on<K extends keyof ChatbotEventMap>(event: K, listener: Listener<ChatbotEventMap[K]>): () => void {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event]!.push(listener);
    return () => this.off(event, listener);
  }

  off<K extends keyof ChatbotEventMap>(event: K, listener: Listener<ChatbotEventMap[K]>): void {
    const arr = this._listeners[event];
    if (!arr) return;
    this._listeners[event] = arr.filter((l) => l !== listener);
  }

  emit<K extends keyof ChatbotEventMap>(
    event: K,
    ...args: ChatbotEventMap[K] extends void ? [] : [ChatbotEventMap[K]]
  ): void {
    const arr = this._listeners[event];
    if (!arr) return;
    for (const listener of arr) listener(...(args as unknown[]));
  }

  removeAllListeners(): void {
    for (const key of Object.keys(this._listeners) as (keyof ChatbotEventMap)[]) {
      delete this._listeners[key];
    }
  }
}
