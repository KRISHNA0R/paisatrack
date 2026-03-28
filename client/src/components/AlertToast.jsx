import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';

const AlertToast = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, x: 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 right-4 z-50"
      >
        <div className="glass rounded-xl p-4 shadow-xl max-w-sm border-l-4 border-amber-500">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <h4 className="font-medium text-amber-500">Budget Alert!</h4>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Only {formatCurrency(toast.remaining)} remaining
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {toast.message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[var(--border-color)] rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertToast;
