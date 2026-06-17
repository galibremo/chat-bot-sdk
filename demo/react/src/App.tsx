import React, { useState } from 'react';
import { DefaultWidgetDemo } from './demos/DefaultWidgetDemo';
import { HeadlessDemo } from './demos/HeadlessDemo';

type Tab = 'widget' | 'headless';

export default function App() {
  const [tab, setTab] = useState<Tab>('widget');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid var(--gray-200)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 60,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'var(--brand)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--gray-900)' }}>
            TypeTechIT Chatbot
          </span>
          <span style={{
            background: 'var(--brand-light)',
            color: 'var(--brand)',
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 20,
            letterSpacing: '0.02em',
          }}>
            React SDK Demo
          </span>
        </div>

        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {([['widget', 'Default Widget'], ['headless', 'Headless UI']] as [Tab, string][]).map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 13,
                  transition: 'all 0.15s',
                  background: tab === id ? 'var(--brand)' : 'transparent',
                  color: tab === id ? '#fff' : 'var(--gray-500)',
                }}
              >
                {label}
              </button>
            )
          )}
        </nav>
      </header>

      {/* Body */}
      <main style={{ flex: 1, padding: '40px 32px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        {tab === 'widget' ? <DefaultWidgetDemo /> : <HeadlessDemo />}
      </main>
    </div>
  );
}
