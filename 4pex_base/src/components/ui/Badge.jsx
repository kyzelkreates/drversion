// 4P3X Badge component — RUN 1

import React from 'react';

const variantMap = {
  active:   'badge-active',
  reserved: 'badge-reserved',
  warn:     'badge-warn',
  error:    'badge-error',
  info:     'badge-info',
  neutral:  'badge-neutral',
  gold:     'badge-gold',
};

export function Badge({ variant = 'neutral', children, style }) {
  const cls = variantMap[variant] || 'badge-neutral';
  return (
    <span className={`badge ${cls}`} style={style}>
      {children}
    </span>
  );
}

export default Badge;
