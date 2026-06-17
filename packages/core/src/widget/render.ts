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
  bubble.textContent = content;

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
