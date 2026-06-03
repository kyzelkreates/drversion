// 4P3X Card component — RUN 1

import React from 'react';

export function Card({ variant, children, className = '', style, ...rest }) {
  const cls = ['card', variant ? `card-${variant}` : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={style} {...rest}>
      {children}
    </div>
  );
}

export default Card;
