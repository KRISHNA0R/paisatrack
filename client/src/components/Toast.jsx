import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, description, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'rgba(34, 197, 94, 0.2)',
    error: 'rgba(239, 68, 68, 0.2)',
    warning: 'rgba(245, 158, 11, 0.2)',
    info: 'rgba(59, 130, 246, 0.2)'
  };

  const borderColors = {
    success: 'rgba(34, 197, 94, 0.5)',
    error: 'rgba(239, 68, 68, 0.5)',
    warning: 'rgba(245, 158, 11, 0.5)',
    info: 'rgba(59, 130, 246, 0.5)'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-28 sm:bottom-24 right-4 z-[100] max-w-sm w-full"
    >
      <div
        className="p-4 rounded-2xl backdrop-blur-xl"
        style={{
          background: bgColors[type],
          border: `1px solid ${borderColors[type]}`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              background: borderColors[type],
              color: 'white'
            }}
          >
            {icons[type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Ruckle, sans-serif' }}>
              {message}
            </p>
            {description && (
              <p className="text-gray-300 text-xs mt-1" style={{ fontFamily: 'Ruckle, sans-serif' }}>
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (options) => {
    setToast({ ...options, id: Date.now() });
  };

  return (
    <>
      {children({ showToast })}
      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.id}
            message={toast.message}
            description={toast.description}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Toast;

export const toast = {
  success: (message, description) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, description, type: 'success' } }));
  },
  error: (message, description) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, description, type: 'error' } }));
  },
  warning: (message, description) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, description, type: 'warning' } }));
  },
  info: (message, description) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, description, type: 'info' } }));
  }
};
