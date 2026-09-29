import { describe, expect, it } from 'vitest';
import * as react from './index';

describe('public API', () => {
  it('should export exactly the documented runtime members when the package is imported', () => {
    // Arrange
    const expected = ['ChatbotContext', 'ChatbotHeadless', 'ChatbotProvider', 'ChatbotWidget', 'useChatbot'];

    // Act
    const actual = Object.keys(react).sort();

    // Assert
    expect(actual).toEqual(expected);
  });
});
