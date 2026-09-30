/**
 * A `localStorage` that throws on *access*, the way Safari private mode, blocked
 * site data and sandboxed iframes do. Install per test with
 * `vi.stubGlobal('localStorage', blockedStorage)`; setup restores it afterwards.
 */
export const blockedStorage = {
  get getItem(): never {
    throw new DOMException('insecure', 'SecurityError');
  },
  get setItem(): never {
    throw new DOMException('insecure', 'SecurityError');
  },
  get removeItem(): never {
    throw new DOMException('insecure', 'SecurityError');
  },
};
