// 4P3X Button component — RUN 1

import React from 'react';

export function Button({
  variant = 'primary',
  size,
  children,
  onClick,
  disabled,
  className = '',
  ...rest
}) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size ? `btn-${size}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
