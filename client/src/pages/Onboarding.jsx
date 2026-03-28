import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState({
    totalBudget: 4000,
    categories: [
      { name: 'Petrol', budget: 1200, icon: '⛽' },
      { name: 'Badminton Accessories', budget: 600, icon: '🏸' },
      { name: 'Food', budget: 500, icon: '🍔' },
      { name: 'Shuttles', budget: 500, icon: '🏸' },
      { name: 'Miscellaneous', budget: 500, icon: '📦' },
      { name: 'SIP/Savings', budget: 500, icon: '💰' }
    ]
  });
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          totalBudget: budget.totalBudget,
          alertThreshold: Math.min(budget.totalBudget * 0.25, 1000),
          categories: budget.categories
        })
      });
      
      if (res.ok) {
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to save budget:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateCategoryBudget = (index, value) => {
    const updated = [...budget.categories];
    updated[index] = { ...updated[index], budget: parseInt(value) || 0 };
    setBudget({ ...budget, categories: updated });
  };

  const totalAllocated = budget.categories.reduce((sum, c) => sum + c.budget, 0);
  const remaining = budget.totalBudget - totalAllocated;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 max-w-lg w-full relative z-10"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent-purple flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">₹</span>
          </div>
          <span className="font-display font-bold text-xl">PaisaTrack</span>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-accent-purple' : 'bg-[var(--border-color)]'}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-accent-purple' : 'bg-[var(--border-color)]'}`} />
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="font-display text-2xl font-bold mb-2">Welcome, {user?.displayName?.split(' ')[0]}!</h2>
            <p className="text-[var(--text-secondary)] mb-6">Let's set up your monthly budget to get started.</p>

            <label className="block text-sm font-medium mb-2">Monthly Budget (₹)</label>
            <input
              type="number"
              value={budget.totalBudget}
              onChange={(e) => setBudget({ ...budget, totalBudget: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-4 rounded-xl glass border border-[var(--border-color)] focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 outline-none font-display text-2xl text-center mb-6"
              min="0"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-accent-purple text-white rounded-xl font-medium"
            >
              Continue
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="font-display text-xl font-bold mb-2">Set Category Budgets</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Allocate your {budget.totalBudget} budget across categories
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {budget.categories.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-xl w-8">{cat.icon}</span>
                  <span className="flex-1 text-sm font-medium">{cat.name}</span>
                  <input
                    type="number"
                    value={cat.budget}
                    onChange={(e) => updateCategoryBudget(i, e.target.value)}
                    className="w-24 px-3 py-2 rounded-lg glass border border-[var(--border-color)] focus:border-accent-purple outline-none text-sm font-display"
                    min="0"
                  />
                </div>
              ))}
            </div>

            <div className={`mt-4 p-3 rounded-xl text-center ${
              remaining < 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
            }`}>
              <p className="font-display font-bold">
                {remaining >= 0 ? `₹${remaining} remaining` : `₹${Math.abs(remaining)} over budget`}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 glass rounded-xl font-medium"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinish}
                disabled={saving || remaining < 0}
                className="flex-1 py-4 bg-accent-purple text-white rounded-xl font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Get Started'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;
