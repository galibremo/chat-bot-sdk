import { describe, expect, it } from 'vitest';
import { buildMessageEl } from './render';

type RenderedType = 'ai' | 'agent';

/**
 * Render a message and hand back its parsed bubble, so every assertion runs
 * against real DOM rather than the HTML string (rule 26).
 */
function bubble(content: string, type: RenderedType | 'human' = 'ai'): HTMLElement {
  const el = buildMessageEl(content, type);
  return el.querySelector('.ttcb-bubble') as HTMLElement;
}

describe('buildMessageEl', () => {
  it('should render human messages as plain text when they contain markup', () => {
    // Arrange
    const content = '<b>not bold</b>';

    // Act
    const b = bubble(content, 'human');

    // Assert
    expect(b.querySelector('b')).toBeNull();
    expect(b.textContent).toBe('<b>not bold</b>');
  });

  it('should render basic markdown when AI content uses bold, italic and links', () => {
    // Arrange
    const content = '**bold** and *italic* and [link](https://example.com)';

    // Act
    const b = bubble(content);

    // Assert
    expect(b.querySelector('strong')?.textContent).toBe('bold');
    expect(b.querySelector('em')?.textContent).toBe('italic');
    const a = b.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('https://example.com');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render headings and lists when AI content uses block markdown', () => {
    // Arrange
    const content = '## Title\n\n- one\n- two\n\n1. first';

    // Act
    const b = bubble(content);

    // Assert
    expect(b.querySelector('h2')?.textContent).toBe('Title');
    expect(b.querySelectorAll('ul li')).toHaveLength(2);
    expect(b.querySelectorAll('ol li')).toHaveLength(1);
  });

  it('should keep inline code inside the paragraph when it appears mid-sentence', () => {
    // Arrange
    const content = 'Use `npm i` to install.';

    // Act
    const b = bubble(content);

    // Assert
    expect(b.querySelectorAll('p > code')).toHaveLength(1);
    expect(b.querySelector('pre')).toBeNull();
  });

  // A <pre> inside a <p> is auto-closed by the parser, which breaks bubble layout.
  describe('fenced code', () => {
    it.each([
      { name: 'surrounded by blank lines', src: 'Here:\n\n```js\nconst a = 1;\n```\n\nDone.' },
      { name: 'with no blank lines', src: 'Try:\n```\nnpm i\n```\nThen run.' },
      { name: 'alongside inline code', src: 'Run `a` then:\n\n```\nb\n```' },
      { name: 'on its own', src: '```\nsolo\n```' },
    ])('should render a block-level <pre> when the fence is $name', ({ src }) => {
      // Arrange / Act
      const b = bubble(src);

      // Assert
      expect(b.querySelectorAll('pre')).toHaveLength(1);
      expect(b.querySelector('p pre')).toBeNull();
    });

    it('should escape markup when it appears inside fenced code', () => {
      // Arrange
      const content = '```\n<img src=x onerror=alert(1)>\n```';

      // Act
      const b = bubble(content);

      // Assert
      expect(b.querySelector('pre code')?.textContent).toBe('<img src=x onerror=alert(1)>');
      expect(b.querySelector('img')).toBeNull();
    });
  });

  // AI output and agent messages are both untrusted and both go through markdown.
  describe.each<RenderedType>(['ai', 'agent'])('untrusted %s content', (type) => {
    it.each([
      { name: 'a script tag', payload: '<script>alert(1)</script>' },
      { name: 'an img onerror', payload: '<img src=x onerror=alert(1)>' },
      { name: 'an svg onload', payload: '<svg onload=alert(1)>' },
      { name: 'an iframe', payload: '<iframe srcdoc="x"></iframe>' },
      { name: 'a single-quoted attribute', payload: "<img src='x' onerror='alert(1)'>" },
      { name: 'a javascript: url', payload: '[click](javascript:alert(1))' },
      { name: 'a data: url', payload: '[click](data:text/html,<script>alert(1)</script>)' },
      { name: 'a quote break out of href', payload: '[x](https://a" onmouseover="alert(1))' },
      { name: 'an escape out of a code fence', payload: '```\n</code></pre><img src=x onerror=alert(1)>\n```' },
      { name: 'markup nested in link text', payload: '[<img src=x onerror=alert(1)>](https://ok.com)' },
    ])('should render no live markup when the content contains $name', ({ payload }) => {
      // Arrange / Act
      const b = bubble(payload, type);

      // Assert
      expect(b.querySelector('script,iframe,object,embed,svg,img,style')).toBeNull();
      for (const el of Array.from(b.querySelectorAll('*'))) {
        for (const attr of Array.from(el.attributes)) {
          expect(attr.name.toLowerCase()).not.toMatch(/^on/);
        }
      }
      for (const a of Array.from(b.querySelectorAll('a[href]'))) {
        expect(a.getAttribute('href')).toMatch(/^https?:\/\//);
      }
    });
  });
});
