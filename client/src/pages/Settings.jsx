import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../hooks/useBudget';
import BottomNav from '../components/BottomNav';
import RainbowButton from '../components/RainbowButton';
import { formatCurrency } from '../utils/formatCurrency';
import API_BASE from '../utils/api';

const Settings = () => {
  const { user } = useAuth();
  const { budget, updateBudget, loading: budgetLoading } = useBudget();
  
  const [formData, setFormData] = useState({
    totalBudget: 4000,
    alertThreshold: 1000,
    categories: []
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', budget: 0, icon: '💰' });

  useEffect(() => {
    if (budget) {
      setFormData({
        totalBudget: budget.totalBudget || 4000,
        alertThreshold: budget.alertThreshold || 1000,
        categories: budget.categories || []
      });
    }
  }, [budget]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBudget({
        totalBudget: formData.totalBudget,
        alertThreshold: formData.alertThreshold,
        categories: formData.categories
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    if (newCategory.name && newCategory.budget > 0) {
      setFormData({
        ...formData,
        categories: [...formData.categories, { ...newCategory }]
      });
      setNewCategory({ name: '', budget: 0, icon: '💰' });
    }
  };

  const removeCategory = (index) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((_, i) => i !== index)
    });
  };

  const updateCategory = (index, field, value) => {
    const updated = [...formData.categories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, categories: updated });
  };

  const exportCSV = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/expenses?month=${new Date().toISOString().slice(0, 7)}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const expenses = await res.json();
      
      const headers = ['Date', 'Category', 'Note', 'Amount'];
      const rows = expenses.map(e => [
        new Date(e.date).toLocaleDateString(),
        e.category,
        e.note || '',
        e.amount
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses-${new Date().toISOString().slice(0, 7)}.csv`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const icons = ['💰', '⛽', '🍔', '🏸', '📦', '💎', '🎮', '👕', '🏠', '✈️', '🎓', '💊'];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Settings</h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
          >
            <h2 className="font-display text-base sm:text-lg font-semibold mb-4">Account</h2>
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=7C3AED&color=fff`}
                alt="Profile"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate text-sm sm:text-base">{user?.displayName}</p>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
          >
            <h2 className="font-display text-base sm:text-lg font-semibold mb-4"> Budget Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Budget (₹)</label>
                <input
                  type="number"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 outline-none font-display text-base"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alert Threshold (₹)</label>
                <p className="text-xs text-[var(--text-secondary)] mb-2">
                  Get notified when remaining budget falls below this amount
                </p>
                <input
                  type="number"
                  value={formData.alertThreshold}
                  onChange={(e) => setFormData({ ...formData, alertThreshold: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 outline-none font-display text-base"
                  min="0"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
          >
            <h2 className="font-display text-base sm:text-lg font-semibold mb-4">Categories</h2>
            
            <div className="space-y-3 mb-4">
              {formData.categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-2 sm:p-0 rounded-lg sm:rounded-none"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <span className="text-lg flex-shrink-0">{cat.icon}</span>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => updateCategory(i, 'name', e.target.value)}
                    className="flex-1 min-w-[80px] px-3 py-2 rounded-lg glass border border-[var(--border-color)] focus:border-accent-purple outline-none text-sm min-h-[44px]"
                  />
                  <input
                    type="number"
                    value={cat.budget}
                    onChange={(e) => updateCategory(i, 'budget', parseInt(e.target.value) || 0)}
                    className="w-20 sm:w-24 px-2 sm:px-3 py-2 rounded-lg glass border border-[var(--border-color)] focus:border-accent-purple outline-none text-sm font-display min-h-[44px]"
                    min="0"
                  />
                  <select
                    value={cat.icon}
                    onChange={(e) => updateCategory(i, 'icon', e.target.value)}
                    className="px-2 py-2 rounded-lg glass text-sm min-h-[44px]"
                  >
                    {icons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeCategory(i)}
                    className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-[var(--border-color)] pt-4">
              <p className="text-sm font-medium mb-3">Add New Category</p>
              <div className="flex flex-wrap gap-2">
                <select
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="px-2 py-2 rounded-lg glass text-lg min-h-[44px]"
                >
                  {icons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Name"
                  className="flex-1 min-w-[80px] px-3 py-2 rounded-lg glass border border-[var(--border-color)] focus:border-accent-purple outline-none text-sm min-h-[44px]"
                />
                <input
                  type="number"
                  value={newCategory.budget || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, budget: parseInt(e.target.value) || 0 })}
                  placeholder="₹"
                  className="w-20 sm:w-24 px-2 sm:px-3 py-2 rounded-lg glass border border-[var(--border-color)] focus:border-accent-purple outline-none text-sm font-display min-h-[44px]"
                  min="0"
                />
                <button
                  onClick={addCategory}
                  className="px-4 py-2 bg-accent-purple text-white rounded-lg text-sm font-medium min-h-[44px]"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
          >
            <h2 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-4">Export Data</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4">
              Download your expenses as a CSV file for this month
            </p>
            <RainbowButton 
              onClick={exportCSV}
              className="w-full py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </RainbowButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RainbowButton 
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 text-base sm:text-lg"
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </RainbowButton>
          </motion.div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;
