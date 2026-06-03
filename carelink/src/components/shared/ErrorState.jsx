import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
    }}>
      <AlertTriangle size={36} color='var(--status-error)' style={{ marginBottom: '14px' }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '280px' }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{
          marginTop: '16px', padding: '8px 20px', background: 'var(--bg-card)',
          border: '1px solid var(--border-gold)', borderRadius: '8px',
          color: 'var(--gold-bright)', cursor: 'pointer', fontSize: '13px',
        }}>Retry</button>
      )}
    </div>
  );
}
export default ErrorState;
