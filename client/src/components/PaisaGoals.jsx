import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

const PaisaGoals = ({ budget, totalSpent }) => {
  const { user } = useAuth();
  const [goal, setGoal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ target: '', months: 3 });

  useEffect(() => {
    const savedGoal = localStorage.getItem(`paisatrack_goal_${user?.uid}`);
    if (savedGoal) {
      setGoal(JSON.parse(savedGoal));
    }
  }, [user?.uid]);

  const saveGoal = () => {
    if (!formData.target) return;
    const newGoal = {
      target: parseFloat(formData.target),
      months: parseInt(formData.months),
      startDate: new Date().toISOString(),
      saved: 0
    };
    setGoal(newGoal);
    localStorage.setItem(`paisatrack_goal_${user?.uid}`, JSON.stringify(newGoal));
    setShowForm(false);
  };

  const deleteGoal = () => {
    setGoal(null);
    localStorage.removeItem(`paisatrack_goal_${user?.uid}`);
  };

  if (!budget) return null;

  const monthlyBudget = budget.totalBudget || 0;
  const monthlySavings = goal ? monthlyBudget - totalSpent : 0;
  const projectedSavings = monthlySavings * (goal?.months || 1);
  const progress = goal ? Math.min(100, (projectedSavings / goal.target) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="mb-4 sm:mb-6 p-4 rounded-2xl"
      style={{ 
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'Ruckle, sans-serif' }}>Paisa Goals</h3>
        </div>
        {!goal && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs px-3 py-1.5 rounded-lg text-accent-purple min-h-[32px]"
            style={{ background: 'rgba(123, 47, 255, 0.2)' }}
          >
            Set Goal
          </button>
        )}
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl mb-3"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        >
          <p className="text-xs text-gray-400 mb-3" style={{ fontFamily: 'Ruckle, sans-serif' }}>Set a savings target for the next few months</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Target Amount (₹)</label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-white outline-none text-sm sm:text-base"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(123, 47, 255, 0.3)',
                  fontFamily: 'Ruckle, sans-serif'
                }}
                placeholder="5000"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Months</label>
              <select
                value={formData.months}
                onChange={(e) => setFormData({ ...formData, months: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-white outline-none text-sm sm:text-base"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(123, 47, 255, 0.3)',
                  fontFamily: 'Ruckle, sans-serif'
                }}
              >
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-lg text-sm min-h-[44px]"
                style={{ background: 'rgba(255, 255, 255, 0.05)', fontFamily: 'Ruckle, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={saveGoal}
                className="flex-1 py-2.5 rounded-lg text-sm text-white min-h-[44px]"
                style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #A855F7 100%)', fontFamily: 'Ruckle, sans-serif' }}
              >
                Save Goal
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {goal ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 truncate mr-2" style={{ fontFamily: 'Ruckle, sans-serif' }}>
              ₹{Math.round(projectedSavings)} of ₹{formatCurrency(goal.target)}
            </span>
            <span className="text-xs font-bold text-accent-purple flex-shrink-0" style={{ fontFamily: 'Ruckle, sans-serif' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2.5 sm:h-3 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full"
              style={{
                background: progress >= 100 
                  ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                  : 'linear-gradient(90deg, #7B2FFF, #A855F7)'
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Ruckle, sans-serif' }}>
              {goal.months} month{goal.months > 1 ? 's' : ''} goal • ₹{Math.round(monthlySavings)}/month
            </p>
            <button
              onClick={deleteGoal}
              className="text-xs text-red-400 min-h-[32px]"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500" style={{ fontFamily: 'Ruckle, sans-serif' }}>
          Set a savings goal to track your progress!
        </p>
      )}
    </motion.div>
  );
};

export default PaisaGoals;
