// 4P3X LoadingState component — RUN 1

import React from 'react';

export function LoadingState({ message = 'Loading…' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: 'var(--text-secondary)',
      gap: 10,
    }}>
      <span style={{
        width: 16, height: 16,
        border: '2px solid var(--silver-dim)',
        borderTopColor: 'var(--gold-bright)',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
      }} />
      <span>{message}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default LoadingState;
