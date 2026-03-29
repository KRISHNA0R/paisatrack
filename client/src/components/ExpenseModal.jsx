import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../hooks/useBudget';
import RainbowButton from './RainbowButton';
import Toast from './Toast';
import { formatCurrency } from '../utils/formatCurrency';
import API_BASE from '../utils/api';

const CATEGORY_KEYWORDS = {
  'Petrol': ['petrol', 'fuel', 'pump', 'gas', 'diesel', 'petro', 'hp', 'bp', 'shell', 'ioc'],
  'Food': ['food', 'lunch', 'dinner', 'breakfast', 'chai', 'coffee', 'restaurant', 'swiggy', 'zomato', 'meal', 'eat', 'pizza', 'burger', 'biryani', 'tiffin', 'dosa', 'idli', 'paratha', 'thali', 'snack', 'snacks', 'omelette', '蛋'],
  'Badminton': ['badminton', 'shuttle', 'shuttles', 'court', 'racket', 'grip', 'badmit', 'shuttelcock'],
  'SIP': ['sip', 'invest', 'mutual fund', 'stock', 'shares', 'mf', 'nps', 'fd', 'rd'],
  'Travel': ['uber', 'ola', 'auto', 'bus', 'metro', 'ticket', 'train', 'flight', 'cab', 'taxi', 'ride', 'travel', 'trip', 'vacation', 'holiday', 'journey'],
  'Entertainment': ['movie', 'netflix', 'amazon prime', 'hotstar', 'disney', 'game', 'gaming', 'ps5', 'xbox', 'concert', 'show', 'theatre', 'series', 'web series', 'spotify', 'youtube premium'],
  'Groceries': ['grocery', 'groceries', 'vegetables', 'fruits', 'market', 'kirana', 'bigbasket', 'reliance', 'dmart', 'supermarket'],
  'Shopping': ['shopping', 'clothes', 'clothing', 'shoes', 'amazon', 'myntra', 'flipkart', 'fashion', 'dress', 'shirt', 'jeans'],
  'Health': ['medicine', 'medical', 'doctor', 'hospital', 'pharmacy', 'health', 'gym', 'fitness', 'yoga', 'vitamin'],
  'Utilities': ['electricity', 'water', 'bill', 'phone', 'internet', 'wifi', 'recharge', 'gas cylinder', 'rent']
};

const detectCategory = (note, existingCategories) => {
  if (!note || note.trim().length < 2) return null;
  const lowerNote = note.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerNote.includes(keyword)) {
        const matchedCategory = existingCategories?.find(c => c.name === category);
        return matchedCategory || { name: category, icon: getCategoryIcon(category) };
      }
    }
  }
  return null;
};

const getCategoryIcon = (name) => {
  const icons = {
    'Petrol': '⛽', 'Food': '🍔', 'Badminton': '🏸', 'SIP': '💰',
    'Travel': '✈️', 'Entertainment': '🎬', 'Groceries': '🛒', 'Shopping': '🛍️',
    'Health': '💊', 'Utilities': '📱', 'Others': '📝', 'Miscellaneous': '📦'
  };
  return icons[name] || '📦';
};

const DEFAULT_CATEGORIES = [
  { name: 'Petrol', icon: '⛽' },
  { name: 'Food', icon: '🍔' },
  { name: 'Badminton', icon: '🏸' },
  { name: 'Shuttles', icon: '🏸' },
  { name: 'SIP', icon: '💰' },
  { name: 'Miscellaneous', icon: '📦' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Others', icon: '📝' }
];

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const ExpenseModal = ({ isOpen, onClose, month, onSuccess }) => {
  const { user } = useAuth();
  const { budget } = useBudget();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    note: '',
    date: getCurrentDateTime()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);

  const categories = budget?.categories?.length > 0 
    ? budget.categories 
    : DEFAULT_CATEGORIES;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFormData(prev => ({ ...prev, date: getCurrentDateTime() }));
      setSuggestedCategory(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const detected = detectCategory(formData.note, categories);
    setSuggestedCategory(detected);
  }, [formData.note, categories]);

  const applySuggestion = () => {
    if (suggestedCategory) {
      setFormData(prev => ({ ...prev, category: suggestedCategory.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      setError('Please fill in required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          category: formData.category,
          note: formData.note,
          date: new Date(formData.date).toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to add expense');

      setFormData({ amount: '', category: '', note: '', date: getCurrentDateTime() });
      setShowToast(true);
      setTimeout(() => {
        onSuccess?.({ amount: parseFloat(formData.amount), category: formData.category });
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 md:hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 hidden md:flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl p-5 sm:p-6"
              style={{ 
                background: 'rgba(15, 15, 25, 0.98)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(123, 47, 255, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(123, 47, 255, 0.1)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: 'Ruckle, sans-serif' }}>Add Expense</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl transition-all hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl text-accent-purple font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-2xl text-center text-xl sm:text-2xl font-bold outline-none text-white min-h-[52px]"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(123, 47, 255, 0.3)',
                        fontFamily: 'Ruckle, sans-serif'
                      }}
                      placeholder="0"
                      min="0"
                      step="1"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl outline-none text-white appearance-none cursor-pointer min-h-[48px]"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(123, 47, 255, 0.3)',
                      fontFamily: 'Ruckle, sans-serif'
                    }}
                    required
                  >
                    <option value="" style={{ background: '#0F0F19' }}>Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name} style={{ background: '#0F0F19' }}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-[42px] sm:top-[46px] w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Note (optional)</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl outline-none text-white min-h-[48px]"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(123, 47, 255, 0.3)',
                      fontFamily: 'Ruckle, sans-serif'
                    }}
                    placeholder="What was this for?"
                  />
                  <AnimatePresence>
                    {suggestedCategory && !formData.category && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs text-gray-400" style={{ fontFamily: 'Ruckle, sans-serif' }}>Suggested:</span>
                        <button
                          type="button"
                          onClick={applySuggestion}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all hover:scale-105"
                          style={{ 
                            background: 'rgba(123, 47, 255, 0.15)',
                            border: '1px solid rgba(123, 47, 255, 0.3)',
                            color: '#A78BFA',
                            fontFamily: 'Ruckle, sans-serif'
                          }}
                        >
                          <span>{suggestedCategory.icon}</span>
                          <span>{suggestedCategory.name}</span>
                          <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl outline-none text-white min-h-[48px]"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(123, 47, 255, 0.3)',
                      fontFamily: 'Ruckle, sans-serif'
                    }}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center p-2 rounded-lg bg-red-500/10">{error}</p>
                )}

                <RainbowButton 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-base sm:text-lg"
                  onClick={() => {}}
                >
                  {loading ? 'Adding...' : 'Add Expense'}
                </RainbowButton>
              </form>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 md:hidden rounded-t-3xl"
            style={{ 
              background: 'rgba(15, 15, 25, 0.98)',
              backdropFilter: 'blur(24px)',
              borderTop: '1px solid rgba(123, 47, 255, 0.3)'
            }}
          >
            <div className="w-12 h-1.5 rounded-full mx-auto mt-3 mb-4" style={{ background: 'rgba(123, 47, 255, 0.5)' }} />
            
            <div className="flex items-center justify-between px-4 sm:px-6 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: 'Ruckle, sans-serif' }}>Add Expense</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl transition-all hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-8 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl text-accent-purple font-bold">₹</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-2xl text-center text-xl sm:text-2xl font-bold outline-none text-white min-h-[56px]"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(123, 47, 255, 0.3)',
                      fontFamily: 'Ruckle, sans-serif'
                    }}
                    placeholder="0"
                    min="0"
                    step="1"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl outline-none text-white appearance-none cursor-pointer min-h-[48px]"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(123, 47, 255, 0.3)',
                    fontFamily: 'Ruckle, sans-serif'
                  }}
                  required
                >
                  <option value="" style={{ background: '#0F0F19' }}>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name} style={{ background: '#0F0F19' }}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-4 top-[42px] w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Note (optional)</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl outline-none text-white min-h-[48px]"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(123, 47, 255, 0.3)',
                    fontFamily: 'Ruckle, sans-serif'
                  }}
                  placeholder="What was this for?"
                />
                <AnimatePresence>
                  {suggestedCategory && !formData.category && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs text-gray-400" style={{ fontFamily: 'Ruckle, sans-serif' }}>Suggested:</span>
                      <button
                        type="button"
                        onClick={applySuggestion}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all hover:scale-105"
                        style={{ 
                          background: 'rgba(123, 47, 255, 0.15)',
                          border: '1px solid rgba(123, 47, 255, 0.3)',
                          color: '#A78BFA',
                          fontFamily: 'Ruckle, sans-serif'
                        }}
                      >
                        <span>{suggestedCategory.icon}</span>
                        <span>{suggestedCategory.name}</span>
                        <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl outline-none text-white min-h-[48px]"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(123, 47, 255, 0.3)',
                    fontFamily: 'Ruckle, sans-serif'
                  }}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center p-2 rounded-lg bg-red-500/10">{error}</p>
              )}

              <RainbowButton 
                type="submit"
                disabled={loading}
                className="w-full py-4 text-base sm:text-lg"
                onClick={() => {}}
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </RainbowButton>
            </form>
          </motion.div>

          <AnimatePresence>
            {showToast && (
              <Toast
                message="Expense Added!"
                description={`₹${formData.amount} spent on ${formData.category}`}
                type="success"
                onClose={() => setShowToast(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExpenseModal;
