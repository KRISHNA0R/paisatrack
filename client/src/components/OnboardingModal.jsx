import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import RainbowButton from './RainbowButton';

const OnboardingModal = ({ isOpen, onComplete }) => {
  const { user } = useAuth();
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
  const [newCategory, setNewCategory] = useState({ name: '', budget: '', icon: '📦' });

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
        onComplete?.();
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

  const addCategory = () => {
    if (newCategory.name && newCategory.budget) {
      setBudget({
        ...budget,
        categories: [...budget.categories, { ...newCategory, budget: parseInt(newCategory.budget) }]
      });
      setNewCategory({ name: '', budget: '', icon: '📦' });
    }
  };

  const removeCategory = (index) => {
    const updated = budget.categories.filter((_, i) => i !== index);
    setBudget({ ...budget, categories: updated });
  };

  const totalAllocated = budget.categories.reduce((sum, c) => sum + c.budget, 0);
  const remaining = budget.totalBudget - totalAllocated;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: '#08080E' }}
        >
          <div className="grain" />
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="orb" 
              style={{ 
                width: '600px', 
                height: '600px', 
                background: 'radial-gradient(circle, rgba(123, 47, 255, 0.3) 0%, transparent 70%)',
                top: '-200px',
                right: '-150px',
                filter: 'blur(100px)'
              }}
              animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div 
              className="orb" 
              style={{ 
                width: '500px', 
                height: '500px', 
                background: 'radial-gradient(circle, rgba(88, 28, 135, 0.4) 0%, transparent 70%)',
                bottom: '-100px',
                left: '-100px',
                filter: 'blur(100px)'
              }}
              animate={{ y: [0, 30, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-5 sm:p-8 max-w-lg w-full relative z-10 max-h-[90vh] overflow-y-auto"
            style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(24px)' }}
          >
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain" />
              <span className="font-bold text-lg sm:text-xl login-gradient-text" style={{ fontFamily: 'Ruckle, sans-serif' }}>PaisaTrack</span>
            </div>

            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-accent-purple' : 'bg-white/10'}`} />
              <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-accent-purple' : 'bg-white/10'}`} />
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white" style={{ fontFamily: 'Ruckle, sans-serif' }}>
                  Set Your Monthly Budget
                </h2>
                <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: 'Ruckle, sans-serif' }}>
                  Welcome, {user?.displayName?.split(' ')[0]}! Let's set up your budget.
                </p>

                <label className="block text-sm font-medium mb-3 text-gray-300" style={{ fontFamily: 'Ruckle, sans-serif' }}>Total Monthly Budget (₹)</label>
                <div className="relative mb-6 sm:mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl text-accent-purple font-bold">₹</span>
                  <input
                    type="number"
                    value={budget.totalBudget}
                    onChange={(e) => setBudget({ ...budget, totalBudget: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-2xl text-center text-2xl sm:text-3xl font-bold outline-none min-h-[56px]"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontFamily: 'Ruckle, sans-serif'
                    }}
                    min="0"
                  />
                </div>

                <RainbowButton 
                  onClick={() => setStep(2)}
                  className="w-full py-4 text-base sm:text-lg"
                >
                  Continue
                </RainbowButton>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-lg sm:text-xl font-bold mb-1 text-white" style={{ fontFamily: 'Ruckle, sans-serif' }}>Category Budgets</h2>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4" style={{ fontFamily: 'Ruckle, sans-serif' }}>
                  Allocate your budget across categories
                </p>

                <div className="space-y-2 sm:space-y-3 max-h-[220px] sm:max-h-[280px] overflow-y-auto custom-scrollbar pr-2 mb-3 sm:mb-4">
                  {budget.categories.map((cat, i) => (
                    <motion.div 
                      key={cat.name} 
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl"
                      style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <span className="text-lg sm:text-xl w-7 sm:w-8">{cat.icon}</span>
                      <span className="flex-1 text-xs sm:text-sm font-medium text-white truncate" style={{ fontFamily: 'Ruckle, sans-serif' }}>{cat.name}</span>
                      <div className="relative flex-shrink-0">
                        <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm">₹</span>
                        <input
                          type="number"
                          value={cat.budget}
                          onChange={(e) => updateCategoryBudget(i, e.target.value)}
                          className="w-16 sm:w-24 pl-5 sm:pl-7 pr-2 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-display text-right outline-none text-white min-h-[36px]"
                          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'Ruckle, sans-serif' }}
                          min="0"
                        />
                      </div>
                      <button
                        onClick={() => removeCategory(i)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                  <p className="text-xs text-gray-400 mb-2 sm:mb-3" style={{ fontFamily: 'Ruckle, sans-serif' }}>Add Custom Category</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Name"
                      className="flex-1 px-2 sm:px-3 py-2 rounded-lg text-sm outline-none text-white min-h-[40px]"
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'Ruckle, sans-serif' }}
                    />
                    <div className="relative flex-shrink-0">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                      <input
                        type="number"
                        value={newCategory.budget}
                        onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
                        placeholder="₹"
                        className="w-16 sm:w-20 pl-5 sm:pl-6 pr-2 py-2 rounded-lg text-sm outline-none text-white min-h-[40px]"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'Ruckle, sans-serif' }}
                      />
                    </div>
                    <button
                      onClick={addCategory}
                      className="px-3 py-2 rounded-lg text-white text-sm font-medium min-h-[40px]"
                      style={{ background: 'rgba(123, 47, 255, 0.3)', border: '1px solid rgba(123, 47, 255, 0.5)', fontFamily: 'Ruckle, sans-serif' }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className={`p-2 sm:p-3 rounded-xl text-center mb-4 sm:mb-6 ${
                  remaining < 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                }`}>
                  <p className="font-bold text-sm sm:text-base" style={{ fontFamily: 'Ruckle, sans-serif' }}>
                    {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over`}
                  </p>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 sm:py-4 rounded-2xl font-semibold text-white min-h-[48px]"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'Ruckle, sans-serif' }}
                  >
                    Back
                  </button>
                  <RainbowButton 
                    onClick={handleFinish}
                    disabled={saving || remaining < 0}
                    className="flex-1 py-3 sm:py-4"
                  >
                    {saving ? 'Saving...' : 'Save & Continue'}
                  </RainbowButton>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
