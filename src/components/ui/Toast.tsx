import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'bg-dark-800 text-white border border-dark-700',
        duration: 4000,
        style: {
          background: '#1E1E27',
          color: '#FFFFFF',
          border: '1px solid #2A2A38',
        },
        success: {
          iconTheme: {
            primary: '#4aedc8',
            secondary: '#1E1E27',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#1E1E27',
          },
        },
      }}
    />
  );
}