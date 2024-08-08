import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorDisplayProps {
  message: string;
  retry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, retry }) => {
  return (
    <div className="rounded-lg bg-red-100 p-4 text-red-700">
      <div className="flex items-center">
        <FaExclamationTriangle className="mr-2" />
        <p className="font-semibold">Error</p>
      </div>
      <p className="mt-2">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
