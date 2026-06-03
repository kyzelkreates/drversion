import React from 'react';
import { getStatusColor, getStatusLabel } from '../../config/workspaceStatusConfig.js';

export function WorkspaceStatusBadge({ status, size = 'sm' }) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);
  const pad = size === 'lg' ? '5px 14px' : '3px 10px';
  const fs  = size === 'lg' ? 13 : 11;

  return (
    <span style={{
      display:       'inline-block',
      padding:       pad,
      borderRadius:  4,
      fontSize:      fs,
      fontWeight:    700,
      background:    color + '22',
      color,
      border:        `1px solid ${color}55`,
      letterSpacing: '0.04em',
    }}>
      {label}
    </span>
  );
}
export default WorkspaceStatusBadge;
