import React from 'react';

const ErrorMessage = ({ show, message }) => {
  if (!show) {
    return null;
  }

  return <div className='text-rose-500 text-sm'>{message}</div>;
};

export default ErrorMessage;
