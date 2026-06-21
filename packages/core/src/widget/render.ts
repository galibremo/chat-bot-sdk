function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseMarkdown(raw: string): string {
  const stash: string[] = [];

  // Stash fenced code blocks before escaping HTML
  let text = raw.replace(/```[\w]*\n?([\s\S]*?)```/g, (_, code) => {
    const i = stash.length;
    stash.push(`<pre><code>${escapeHtml(code.trim())}</code></pre>`);
    return `\x02${i}\x03`;
  });

  // Stash inline code
  text = text.replace(/`([^`\n]+)`/g, (_, code) => {
    const i = stash.length;
    stash.push(`<code>${escapeHtml(code)}</code>`);
    return `\x02${i}\x03`;
  });

  // Escape remaining HTML
  text = escapeHtml(text);

  // Process line by line for block-level elements
  const lines = text.split('\n');
  const out: string[] = [];
  let listOpen = '';

  const closeList = () => {
    if (listOpen) { out.push(`</${listOpen}>`); listOpen = ''; }
  };

  for (const line of lines) {
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^### (.+)/))) {
      closeList(); out.push(`<h3>${m[1]}</h3>`);
    } else if ((m = line.match(/^## (.+)/))) {
      closeList(); out.push(`<h2>${m[1]}</h2>`);
    } else if ((m = line.match(/^# (.+)/))) {
      closeList(); out.push(`<h1>${m[1]}</h1>`);
    } else if ((m = line.match(/^[*-] (.+)/))) {
      if (listOpen !== 'ul') { closeList(); out.push('<ul>'); listOpen = 'ul'; }
      out.push(`<li>${m[1]}</li>`);
    } else if ((m = line.match(/^\d+\. (.+)/))) {
      if (listOpen !== 'ol') { closeList(); out.push('<ol>'); listOpen = 'ol'; }
      out.push(`<li>${m[1]}</li>`);
    } else {
      closeList();
      out.push(line);
    }
  }
  closeList();

  text = out.join('\n');

  // Inline: bold → italic → links (order matters)
  text = text
    .replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')
    .replace(/__(.+?)__/gs, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/gs, '<em>$1</em>')
    .replace(/_(.+?)_/gs, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Wrap non-block segments in <p> and convert single \n to <br>
  text = text
    .split(/\n{2,}/)
    .map(block => {
      const t = block.trim();
      if (!t) return '';
      if (/^<(h[1-3]|ul|ol|pre|li)/.test(t)) return t;
      return `<p>${t.replace(/\n/g, '<br>')}</p>`;
    })
    .filter(Boolean)
    .join('');

  // Restore stashed code elements
  text = text.replace(/\x02(\d+)\x03/g, (_, i) => stash[+i] ?? '');

  return text;
}

export function newSessionIcon(): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <line x1="12" y1="8" x2="12" y2="14"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
  </svg>`;
}

export function chatIcon(): string {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>`;
}

export function closeIcon(): string {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>`;
}

export function sendIcon(): string {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>`;
}

export function botIcon(): string {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z"/>
  </svg>`;
}

export function userIcon(): string {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>`;
}

export function buildMessageEl(content: string, type: 'human' | 'ai'): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = `ttcb-msg ${type}`;

  const avatar = document.createElement('div');
  avatar.className = 'ttcb-msg-avatar';
  avatar.innerHTML = type === 'human' ? userIcon() : botIcon();

  const bubble = document.createElement('div');
  bubble.className = 'ttcb-bubble';
  if (type === 'human') {
    bubble.textContent = content;
  } else {
    bubble.innerHTML = parseMarkdown(content);
  }

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  return wrapper;
}

export function buildTypingIndicator(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'ttcb-msg ai';
  wrapper.id = 'ttcb-typing';

  const avatar = document.createElement('div');
  avatar.className = 'ttcb-msg-avatar';
  avatar.innerHTML = botIcon();

  const typing = document.createElement('div');
  typing.className = 'ttcb-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';

  wrapper.appendChild(avatar);
  wrapper.appendChild(typing);
  return wrapper;
}
