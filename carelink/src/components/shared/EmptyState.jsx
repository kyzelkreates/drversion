import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', subtitle, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
      color: 'var(--text-muted)',
    }}>
      <Icon size={40} style={{ marginBottom: '16px', opacity: 0.4 }} />
      <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 6px' }}>{title}</p>
      {subtitle && <p style={{ fontSize: '13px', margin: '0 0 16px', maxWidth: '280px', lineHeight: 1.5 }}>{subtitle}</p>}
      {action}
    </div>
  );
}
export default EmptyState;
