// 4P3X ErrorState component — RUN 1

import React from 'react';

export function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <div className="alert alert-error">
      <strong>Error:</strong> {message}
    </div>
  );
}

export default ErrorState;
