import type { ChatMessage, ChatbotInitOptions } from '@typetechit/chatbot-types';
import { buildStyles } from './styles';
import { buildMessageEl, buildTypingIndicator, botIcon, chatIcon, closeIcon, sendIcon } from './render';

export interface WidgetCallbacks {
  onSend: (text: string) => void;
  onOpen: () => void;
  onClose: () => void;
}

export class ChatWidget {
  private host!: HTMLElement;
  private shadow!: ShadowRoot;
  private panel!: HTMLElement;
  private messagesContainer!: HTMLElement;
  private input!: HTMLInputElement;
  private sendBtn!: HTMLButtonElement;
  private isOpen: boolean = false;
  private position: string;
  private callbacks: WidgetCallbacks;

  constructor(options: ChatbotInitOptions, callbacks: WidgetCallbacks) {
    this.position = options.position ?? 'bottom-right';
    this.callbacks = callbacks;
    this.mount(options);
  }

  private mount(options: ChatbotInitOptions): void {
    this.host = document.createElement('div');
    this.host.id = 'typetechit-chatbot-host';
    this.shadow = this.host.attachShadow({ mode: 'closed' });

    const styleEl = document.createElement('style');
    styleEl.textContent = buildStyles(
      options.primaryColor ?? '#2563EB',
      options.theme ?? 'auto',
    );
    this.shadow.appendChild(styleEl);

    // FAB
    const fab = document.createElement('button');
    fab.className = `ttcb-fab ${this.position}`;
    fab.setAttribute('aria-label', 'Open chat');
    fab.innerHTML = chatIcon();
    fab.addEventListener('click', () => this.toggle());
    this.shadow.appendChild(fab);

    // Panel
    this.panel = document.createElement('div');
    this.panel.className = `ttcb-panel ${this.position} hidden`;
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-modal', 'true');
    this.panel.setAttribute('aria-label', options.chatbotName ?? 'AI Assistant');

    // Header
    const header = document.createElement('div');
    header.className = 'ttcb-header';
    const avatar = document.createElement('div');
    avatar.className = 'ttcb-avatar';
    avatar.innerHTML = botIcon();
    const title = document.createElement('span');
    title.className = 'ttcb-header-title';
    title.textContent = options.chatbotName ?? 'AI Assistant';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ttcb-close-btn';
    closeBtn.setAttribute('aria-label', 'Close chat');
    closeBtn.innerHTML = closeIcon();
    closeBtn.addEventListener('click', () => this.close());
    header.appendChild(avatar);
    header.appendChild(title);
    header.appendChild(closeBtn);
    this.panel.appendChild(header);

    // Messages
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'ttcb-messages';
    this.messagesContainer.setAttribute('aria-live', 'polite');
    this.messagesContainer.setAttribute('aria-label', 'Chat messages');
    this.panel.appendChild(this.messagesContainer);

    // Footer / Input
    const footer = document.createElement('div');
    footer.className = 'ttcb-footer';
    const form = document.createElement('form');
    form.className = 'ttcb-form';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSend();
    });

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = 'ttcb-input';
    this.input.placeholder = options.placeholder ?? 'Type your message…';
    this.input.setAttribute('aria-label', 'Message input');
    this.input.setAttribute('autocomplete', 'off');

    this.sendBtn = document.createElement('button');
    this.sendBtn.type = 'submit';
    this.sendBtn.className = 'ttcb-send-btn';
    this.sendBtn.innerHTML = sendIcon();
    this.sendBtn.setAttribute('aria-label', 'Send message');

    form.appendChild(this.input);
    form.appendChild(this.sendBtn);
    footer.appendChild(form);
    this.panel.appendChild(footer);
    this.shadow.appendChild(this.panel);
    document.body.appendChild(this.host);

    if (options.welcomeMessage) {
      this.appendMessage({ type: 'ai', content: options.welcomeMessage });
    } else {
      this.showEmptyState(options.chatbotName ?? 'AI Assistant');
    }

    if (options.autoOpen) this.open();
  }

  private showEmptyState(name: string): void {
    const empty = document.createElement('div');
    empty.className = 'ttcb-empty';
    empty.id = 'ttcb-empty';
    const icon = document.createElement('div');
    icon.className = 'ttcb-empty-icon';
    icon.innerHTML = botIcon();
    const p1 = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = name;
    p1.appendChild(document.createTextNode('Welcome to '));
    p1.appendChild(strong);
    const p2 = document.createElement('p');
    p2.textContent = "Ask me anything — I'm here to help!";
    p2.style.marginTop = '6px';
    p2.style.fontSize = '12px';
    empty.appendChild(icon);
    empty.appendChild(p1);
    empty.appendChild(p2);
    this.messagesContainer.appendChild(empty);
  }

  private removeEmptyState(): void {
    const el = this.shadow.getElementById('ttcb-empty');
    if (el) el.remove();
  }

  private handleSend(): void {
    const text = this.input.value.trim();
    if (!text) return;
    this.input.value = '';
    this.callbacks.onSend(text);
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  appendMessage(msg: { type: 'human' | 'ai'; content: string } | ChatMessage): void {
    this.removeEmptyState();
    const data = 'message' in msg ? msg.message : msg;
    const el = buildMessageEl(data.content, data.type);
    this.messagesContainer.appendChild(el);
    this.scrollToBottom();
  }

  setMessages(messages: ChatMessage[]): void {
    this.messagesContainer.innerHTML = '';
    if (messages.length === 0) return;
    for (const msg of messages) {
      const el = buildMessageEl(msg.message.content, msg.message.type);
      this.messagesContainer.appendChild(el);
    }
    this.scrollToBottom();
  }

  setLoading(loading: boolean): void {
    this.sendBtn.disabled = loading;
    this.input.disabled = loading;
    if (loading) {
      if (!this.shadow.getElementById('ttcb-typing')) {
        this.messagesContainer.appendChild(buildTypingIndicator());
        this.scrollToBottom();
      }
    } else {
      const el = this.shadow.getElementById('ttcb-typing');
      if (el) el.remove();
    }
  }

  open(): void {
    this.isOpen = true;
    this.panel.classList.remove('hidden');
    this.input.focus();
    this.callbacks.onOpen();
  }

  close(): void {
    this.isOpen = false;
    this.panel.classList.add('hidden');
    this.callbacks.onClose();
  }

  toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  destroy(): void {
    this.host.remove();
  }

  private scrollToBottom(): void {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}
