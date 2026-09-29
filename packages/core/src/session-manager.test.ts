import { describe, expect, it, vi } from 'vitest';
import { blockedStorage } from '../test/mocks/storage';
import { VisitorTokenManager } from './session-manager';

const KEY = 'onedeskpro_visitor_token';
const SCOPED_KEY = 'onedeskpro_visitor_token:agent-1';

describe('VisitorTokenManager', () => {
  it('should persist the visitor token when one is set', () => {
    // Arrange
    const manager = new VisitorTokenManager();

    // Act
    manager.set('sv_abc');

    // Assert
    expect(manager.get()).toBe('sv_abc');
    expect(localStorage.getItem(KEY)).toBe('sv_abc');
  });

  it('should reuse the token when one is already in storage', () => {
    // Arrange
    localStorage.setItem(KEY, 'existing-token');
    const manager = new VisitorTokenManager();

    // Act
    manager.setScope(null);

    // Assert
    expect(manager.get()).toBe('existing-token');
  });

  it('should scope the stored token when an agent id is given', () => {
    // Arrange
    const manager = new VisitorTokenManager();
    manager.setScope('agent-1');

    // Act
    manager.set('sv_scoped');

    // Assert
    expect(localStorage.getItem(SCOPED_KEY)).toBe('sv_scoped');
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('should remove the stored token when clear() is called', () => {
    // Arrange
    const manager = new VisitorTokenManager();
    manager.set('sv_abc');

    // Act
    manager.clear();

    // Assert
    expect(manager.get()).toBeNull();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  // Safari private mode, blocked site data and sandboxed iframes throw on *access*,
  // not just on write — a `typeof window` guard does not catch this.
  describe('when localStorage is unavailable', () => {
    it('should keep an in-memory token instead of throwing when storage access throws', () => {
      // Arrange
      vi.stubGlobal('localStorage', blockedStorage);
      const manager = new VisitorTokenManager();

      // Act
      const set = () => manager.set('sv_mem');

      // Assert
      expect(set).not.toThrow();
      expect(manager.get()).toBe('sv_mem');
    });

    it('should clear the in-memory token without throwing when storage access throws', () => {
      // Arrange
      vi.stubGlobal('localStorage', blockedStorage);
      const manager = new VisitorTokenManager();
      manager.set('sv_mem');

      // Act
      const clear = () => manager.clear();

      // Assert
      expect(clear).not.toThrow();
      expect(manager.get()).toBeNull();
    });
  });
});
