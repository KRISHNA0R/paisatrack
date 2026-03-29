import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../hooks/useBudget';
import BottomNav from '../components/BottomNav';
import { formatCurrency } from '../utils/formatCurrency';
import { getCurrentMonth } from '../utils/dateHelpers';
import API_BASE from '../utils/api';

const AddExpensePage = () => {
  const { user } = useAuth();
  const { budget } = useBudget();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    note: '',
    date: new Date().toISOString().slice(0, 16)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = budget?.categories || [];

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

      setFormData({ amount: '', category: '', note: '', date: new Date().toISOString().slice(0, 16) });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="font-display text-2xl font-bold mb-6">Add Expense</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium mb-2">Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-4 rounded-xl glass border border-[var(--border-color)] focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 outline-none font-display text-2xl text-center"
                placeholder="0"
                min="0"
                step="1"
                required
                autoFocus
              />
              <p className="text-sm text-[var(--text-secondary)] mt-2 text-center">
                {formData.amount && formatCurrency(parseFloat(formData.amount) || 0)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.name })}
                    className={`p-3 rounded-xl text-center transition-all ${
                      formData.category === cat.name
                        ? 'bg-accent-purple text-white'
                        : 'glass hover:bg-accent-purple/20'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{cat.icon}</span>
                    <span className="text-xs">{cat.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2">Note (optional)</label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 outline-none"
                placeholder="What was this for?"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium mb-2">Date & Time</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 outline-none"
              />
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-accent-purple text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-purple/30"
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </motion.button>
          </form>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default AddExpensePage;
