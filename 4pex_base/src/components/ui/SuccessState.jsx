// 4P3X SuccessState component — RUN 1

import React from 'react';

export function SuccessState({ message = 'Done.' }) {
  return (
    <div className="alert alert-success">
      {message}
    </div>
  );
}

export default SuccessState;
