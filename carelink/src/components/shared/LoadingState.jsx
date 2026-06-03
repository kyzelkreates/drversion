import React from 'react';

export function LoadingState({ message = 'Loading…' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', gap: '14px',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        border: '3px solid var(--border-card)',
        borderTopColor: 'var(--gold-bright)',
        animation: 'cl-spin 0.7s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{message}</p>
      <style>{`@keyframes cl-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
export default LoadingState;
