// 4P3X NotFound page — RUN 1

import React from 'react';

export function NotFound({ onNavigate }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 60, marginBottom: 16, color: 'var(--silver-dim)' }}>404</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
        Page Not Found
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        This route does not exist in the current module registry.
      </div>
      <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/')}>
        Return to Dashboard
      </button>
    </div>
  );
}

export default NotFound;
