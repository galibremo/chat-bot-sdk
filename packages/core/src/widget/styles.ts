export function buildStyles(primaryColor: string, theme: 'light' | 'dark' | 'auto'): string {
  const lightVars = `
    --ttcb-bg: #ffffff;
    --ttcb-bg-secondary: #f3f4f6;
    --ttcb-text: #111827;
    --ttcb-text-muted: #6b7280;
    --ttcb-border: #e5e7eb;
    --ttcb-user-bubble: ${primaryColor};
    --ttcb-user-text: #ffffff;
    --ttcb-ai-bubble: #f3f4f6;
    --ttcb-ai-text: #111827;
    --ttcb-input-bg: #ffffff;
    --ttcb-shadow: 0 20px 60px rgba(0,0,0,0.15);
  `;

  const darkVars = `
    --ttcb-bg: #1f2937;
    --ttcb-bg-secondary: #111827;
    --ttcb-text: #f9fafb;
    --ttcb-text-muted: #9ca3af;
    --ttcb-border: #374151;
    --ttcb-user-bubble: ${primaryColor};
    --ttcb-user-text: #ffffff;
    --ttcb-ai-bubble: #374151;
    --ttcb-ai-text: #f9fafb;
    --ttcb-input-bg: #111827;
    --ttcb-shadow: 0 20px 60px rgba(0,0,0,0.4);
  `;

  let rootVars: string;
  if (theme === 'dark') {
    rootVars = `:host { ${darkVars} }`;
  } else if (theme === 'light') {
    rootVars = `:host { ${lightVars} }`;
  } else {
    rootVars = `
      :host { ${lightVars} }
      @media (prefers-color-scheme: dark) { :host { ${darkVars} } }
    `;
  }

  return `
    ${rootVars}

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .ttcb-fab {
      position: fixed;
      width: 56px; height: 56px;
      border-radius: 50%;
      background: ${primaryColor};
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      z-index: 9999;
    }
    .ttcb-fab:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0,0,0,0.25); }
    .ttcb-fab svg { width: 24px; height: 24px; fill: #fff; }
    .ttcb-fab.bottom-right { bottom: 24px; right: 24px; }
    .ttcb-fab.bottom-left { bottom: 24px; left: 24px; }

    .ttcb-panel {
      position: fixed;
      width: 380px; height: 560px;
      background: var(--ttcb-bg);
      border: 1px solid var(--ttcb-border);
      border-radius: 16px;
      display: flex; flex-direction: column;
      box-shadow: var(--ttcb-shadow);
      overflow: hidden;
      z-index: 9998;
      transition: opacity 0.2s ease, transform 0.25s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .ttcb-panel.bottom-right { bottom: 92px; right: 24px; }
    .ttcb-panel.bottom-left { bottom: 92px; left: 24px; }
    .ttcb-panel.hidden {
      opacity: 0; pointer-events: none;
      transform: translateY(12px) scale(0.97);
    }

    .ttcb-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--ttcb-border);
      display: flex; align-items: center; gap: 10px;
      background: var(--ttcb-bg);
      flex-shrink: 0;
    }
    .ttcb-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: ${primaryColor}22;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .ttcb-avatar svg { width: 16px; height: 16px; fill: ${primaryColor}; }
    .ttcb-header-title { font-weight: 600; font-size: 14px; color: var(--ttcb-text); flex: 1; }
    .ttcb-close-btn {
      background: none; border: none; cursor: pointer;
      color: var(--ttcb-text-muted); padding: 4px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
    }
    .ttcb-close-btn:hover { background: var(--ttcb-bg-secondary); }
    .ttcb-close-btn svg { width: 18px; height: 18px; fill: currentColor; }

    .ttcb-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
      scroll-behavior: smooth;
      font-size: 14px;
    }

    .ttcb-empty {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; text-align: center;
      padding: 32px 16px; flex: 1;
      color: var(--ttcb-text-muted); font-size: 13px;
    }
    .ttcb-empty-icon {
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--ttcb-bg-secondary);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px;
    }
    .ttcb-empty-icon svg { width: 22px; height: 22px; fill: var(--ttcb-text-muted); }
    .ttcb-empty strong { color: var(--ttcb-text); }

    .ttcb-msg { display: flex; gap: 8px; max-width: 100%; }
    .ttcb-msg.human { flex-direction: row-reverse; }
    .ttcb-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--ttcb-bg-secondary);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 2px;
    }
    .ttcb-msg-avatar svg { width: 13px; height: 13px; fill: var(--ttcb-text-muted); }
    .ttcb-bubble {
      max-width: 78%; padding: 9px 13px;
      border-radius: 16px 16px 16px 4px;
      line-height: 1.5;
      color: var(--ttcb-ai-text);
      background: var(--ttcb-ai-bubble);
      white-space: pre-wrap; word-break: break-word;
      font-size: 14px;
    }
    .ttcb-msg.human .ttcb-bubble {
      background: var(--ttcb-user-bubble);
      color: var(--ttcb-user-text);
      border-radius: 16px 16px 4px 16px;
    }

    .ttcb-typing { display: flex; gap: 4px; padding: 8px 2px; align-items: center; }
    .ttcb-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--ttcb-text-muted);
      animation: ttcb-bounce 1.2s infinite;
    }
    .ttcb-typing span:nth-child(2) { animation-delay: 0.15s; }
    .ttcb-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes ttcb-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40% { transform: translateY(-5px); opacity: 1; }
    }

    .ttcb-footer {
      border-top: 1px solid var(--ttcb-border);
      padding: 12px;
      background: var(--ttcb-bg);
      flex-shrink: 0;
    }
    .ttcb-form { display: flex; gap: 8px; }
    .ttcb-input {
      flex: 1; padding: 9px 12px;
      border: 1px solid var(--ttcb-border);
      border-radius: 8px;
      font-size: 14px; outline: none;
      background: var(--ttcb-input-bg);
      color: var(--ttcb-text);
      transition: border-color 0.15s;
      font-family: inherit;
    }
    .ttcb-input:focus { border-color: ${primaryColor}; }
    .ttcb-input::placeholder { color: var(--ttcb-text-muted); }
    .ttcb-input:disabled { opacity: 0.6; cursor: not-allowed; }
    .ttcb-send-btn {
      padding: 0 14px; height: 38px;
      background: ${primaryColor}; color: #fff;
      border: none; border-radius: 8px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.15s; flex-shrink: 0;
    }
    .ttcb-send-btn:hover { opacity: 0.9; }
    .ttcb-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .ttcb-send-btn svg { width: 16px; height: 16px; fill: #fff; }

    @media (max-width: 440px) {
      .ttcb-panel { width: calc(100vw - 16px); right: 8px !important; left: 8px !important; bottom: 84px !important; }
      .ttcb-fab.bottom-right { right: 16px; }
      .ttcb-fab.bottom-left { left: 16px; }
    }
  `;
}
