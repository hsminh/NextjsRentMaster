import React from 'react';

interface FormErrorMessageProps {
  error?: {
    message?: string;
  };
  className?: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  error,
  className = '',
}) => {
  if (!error?.message) return null;

  return (
    <p className={`mt-2 text-sm text-red-600 ${className}`}>
      {error.message}
    </p>
  );
};
