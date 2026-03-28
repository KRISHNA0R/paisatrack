import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../hooks/useBudget';
import ExpenseModal from '../components/ExpenseModal';
import CategoryCard from '../components/CategoryCard';
import Charts from '../components/Charts';
import AlertToast from '../components/AlertToast';
import SmartInsights from '../components/SmartInsights';
import PaisaGoals from '../components/PaisaGoals';
import AnimatedCircularProgressBar from '../components/AnimatedCircularProgressBar';
import RainbowButton from '../components/RainbowButton';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/Skeleton';
import { formatCurrency, formatCurrencyCompact } from '../utils/formatCurrency';
import { getCurrentMonth, getNextMonth, getPrevMonth, getMonthDisplay, formatDateTime } from '../utils/dateHelpers';

const Dashboard = ({ onOpenOnboarding }) => {
  const { user } = useAuth();
  const { budget, loading: budgetLoading, refetch: refetchBudget } = useBudget();
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showExport, setShowExport] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const [expRes, sumRes] = await Promise.all([
        fetch(`/api/expenses?month=${currentMonth}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        }),
        fetch(`/api/summary/${currentMonth}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        })
      ]);

      if (expRes.ok && sumRes.ok) {
        const expData = await expRes.json();
        const sumData = await sumRes.json();
        setExpenses(expData);
        setSummary(sumData);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.token, currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (budget?.totalBudget && summary?.totalSpent !== undefined) {
      const remaining = budget.totalBudget - summary.totalSpent;
      if (remaining < 0) {
        setToast({
          message: 'Budget exceeded! You are over budget by ₹' + Math.abs(remaining),
          type: 'error'
        });
      } else if (remaining <= budget.alertThreshold) {
        setToast({
          message: `Only ₹${remaining} left in your budget!`,
          type: 'warning'
        });
      }
    }
  }, [summary?.totalSpent, budget]);

  const handleExpenseAdded = () => {
    fetchData();
    refetchBudget();
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setExpenses(prev => prev.filter(e => e._id !== id));
        fetchData();
        refetchBudget();
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
    setDeleteConfirm(null);
  };

  const totalSpent = summary?.totalSpent || 0;
  const totalBudget = budget?.totalBudget || 0;
  const remaining = totalBudget - totalSpent;
  const savings = budget?.categories?.find(c => c.name === 'SIP' || c.name === 'SIP/Savings')?.budget || 0;
  const budgetPercent = totalBudget > 0 ? Math.max(0, Math.min(100, (remaining / totalBudget) * 100)) : 0;
  const isOverBudget = remaining < 0;

  const filteredExpenses = categoryFilter === 'all' 
    ? expenses 
    : expenses.filter(e => e.category === categoryFilter);

  const getCategorySpent = (categoryName) => {
    return summary?.categoryTotals?.[categoryName] || 0;
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Note'];
    const rows = expenses.map(e => [
      new Date(e.date).toLocaleDateString('en-IN'),
      e.category,
      e.amount,
      e.note || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paisatrack-${currentMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Ruckle, sans-serif' }}>Dashboard</h1>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setShowExport(true)}
              className="p-2 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              title="Export CSV"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentMonth(getPrevMonth(currentMonth))}
              className="p-2 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-medium min-w-[100px] sm:min-w-[140px] text-center text-white text-sm sm:text-base" style={{ fontFamily: 'Ruckle, sans-serif' }}>
              {getMonthDisplay(currentMonth)}
            </span>
            <button
              onClick={() => setCurrentMonth(getNextMonth(currentMonth))}
              className="p-2 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <SummaryCard
            title="Total Spent"
            value={formatCurrencyCompact(totalSpent)}
            subtitle="this month"
            color="red"
            delay={0.1}
          />
          <SummaryCard
            title="Remaining"
            value={formatCurrencyCompact(Math.max(0, remaining))}
            subtitle={`of ${formatCurrency(totalBudget)}`}
            color={isOverBudget ? 'red' : remaining > totalBudget * 0.25 ? 'green' : 'amber'}
            delay={0.2}
          />
          <SummaryCard
            title="Savings"
            value={formatCurrencyCompact(savings)}
            subtitle="SIP locked"
            color="teal"
            delay={0.3}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-4 sm:mb-6 p-4 sm:p-5 rounded-2xl"
          style={{ 
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300" style={{ fontFamily: 'Ruckle, sans-serif' }}>Budget Health</span>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-xs text-gray-500">
                    <span className="text-red-400 font-medium">{formatCurrency(totalSpent)}</span> spent
                  </span>
                </div>
              </div>
              <div className="h-3 sm:h-4 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <motion.div
                  layoutId="budgetBar"
                  initial={{ width: '100%' }}
                  animate={{ width: `${budgetPercent}%` }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: isOverBudget 
                      ? 'linear-gradient(90deg, #EF4444, #F87171)'
                      : budgetPercent > 50 
                        ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                        : 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </motion.div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>₹0</span>
                <span className={isOverBudget ? "text-red-400 font-medium" : "text-green-400 font-medium"}>
                  {isOverBudget ? `-${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
                </span>
                <span>{formatCurrency(totalBudget)}</span>
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center">
              <AnimatedCircularProgressBar 
                value={budgetPercent}
                gaugePrimaryColor={isOverBudget ? '#EF4444' : budgetPercent > 50 ? '#22C55E' : '#F59E0B'}
                className="scale-75 sm:scale-100"
              />
            </div>
          </div>
        </motion.div>

        <SmartInsights summary={summary} budget={budget} currentMonth={currentMonth} />

        <PaisaGoals budget={budget} totalSpent={totalSpent} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-white" style={{ fontFamily: 'Ruckle, sans-serif' }}>Category Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetLoading ? (
              Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
            ) : budget?.categories?.length > 0 ? (
              budget.categories.map((cat, i) => (
                <CategoryCard
                  key={cat.name}
                  category={cat}
                  spent={getCategorySpent(cat.name)}
                  index={i}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-8">Set up your budget to see categories</p>
            )}
          </div>
        </motion.div>

        {loading ? (
          <ChartSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <Charts summary={summary} totalBudget={totalBudget} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl p-4 sm:p-5"
          style={{ 
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-white" style={{ fontFamily: 'Ruckle, sans-serif' }}>Transaction History</h2>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 rounded-xl text-sm outline-none w-full sm:w-auto"
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontFamily: 'Ruckle, sans-serif'
              }}
            >
              <option value="all" style={{ background: '#08080E' }}>All</option>
              {budget?.categories?.map(cat => (
                <option key={cat.name} value={cat.name} style={{ background: '#08080E' }}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-12 sm:py-16 text-gray-500">
              <p className="text-base sm:text-lg mb-2" style={{ fontFamily: 'Ruckle, sans-serif' }}>No transactions this month</p>
              <p className="text-sm">Click + to add your first expense</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExpenses.map((expense, i) => {
                const cat = budget?.categories?.find(c => c.name === expense.category);
                return (
                  <motion.div
                    key={expense._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all group"
                    style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl"
                      style={{ background: 'rgba(123, 47, 255, 0.2)' }}>
                      {cat?.icon || '💰'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate text-sm sm:text-base" style={{ fontFamily: 'Ruckle, sans-serif' }}>{expense.note || expense.category}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formatDateTime(expense.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="font-bold text-accent-purple text-sm sm:text-base" style={{ fontFamily: 'Ruckle, sans-serif' }}>
                        -{formatCurrency(expense.amount)}
                      </span>
                      {deleteConfirm === expense._id ? (
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="px-2 sm:px-3 py-1 text-xs rounded-lg text-white min-h-[32px]"
                            style={{ background: 'rgba(239, 68, 68, 0.8)' }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 sm:px-3 py-1 text-xs rounded-lg min-h-[32px]"
                            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(expense._id)}
                          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 sm:group-hover:opacity-0 transition-all text-red-400 min-w-[32px] min-h-[32px] flex items-center justify-center"
                          style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setModalOpen(true)}
        className="fixed bottom-28 sm:bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center z-30"
        style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #A855F7 100%)', boxShadow: '0 0 30px rgba(123, 47, 255, 0.5)' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>

      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        month={currentMonth}
        onSuccess={handleExpenseAdded}
      />

      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-5 sm:p-6 max-w-sm w-full mx-4" style={{ background: 'rgba(15, 15, 25, 0.98)', border: '1px solid rgba(123, 47, 255, 0.3)' }}>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4" style={{ fontFamily: 'Ruckle, sans-serif' }}>Export Report</h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Ruckle, sans-serif' }}>Download your expenses for {getMonthDisplay(currentMonth)} as CSV file.</p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowExport(false)}
                className="flex-1 py-3 rounded-xl text-sm sm:text-base"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'Ruckle, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={exportToCSV}
                className="flex-1 py-3 rounded-xl text-white text-sm sm:text-base"
                style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #A855F7 100%)', fontFamily: 'Ruckle, sans-serif' }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertToast toast={toast} onClose={() => setToast(null)} />
      <BottomNav />
    </div>
  );
};

const SummaryCard = ({ title, value, subtitle, color, delay }) => {
  const colorClasses = {
    purple: { bg: 'rgba(123, 47, 255, 0.1)', border: '#7B2FFF', text: '#A78BFA' },
    green: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22C55E', text: '#4ADE80' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', border: '#F59E0B', text: '#FBBF24' },
    red: { bg: 'rgba(239, 68, 68, 0.1)', border: '#EF4444', text: '#F87171' },
    teal: { bg: 'rgba(20, 184, 166, 0.1)', border: '#14B8A6', text: '#2DD4BF' }
  };

  const colors = colorClasses[color] || colorClasses.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-4 sm:p-5 relative overflow-hidden"
      style={{ 
        background: colors.bg,
        backdropFilter: 'blur(16px)',
        borderLeft: `4px solid ${colors.border}`
      }}
    >
      <p className="text-xs sm:text-sm text-gray-400 mb-1" style={{ fontFamily: 'Ruckle, sans-serif' }}>{title}</p>
      <p className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text, fontFamily: 'Ruckle, sans-serif' }}>{value}</p>
      <p className="text-xs text-gray-500 mt-1 hidden sm:block" style={{ fontFamily: 'Ruckle, sans-serif' }}>{subtitle}</p>
      <div 
        className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 rounded-full blur-2xl opacity-30"
        style={{ background: colors.border }}
      />
    </motion.div>
  );
};

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40" style={{ background: 'rgba(8, 8, 14, 0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="flex justify-around py-3">
        {[
          { icon: '🏠', label: 'Home', path: '/' },
          { icon: '➕', label: 'Add', path: '/add' },
          { icon: '📅', label: 'Monthly', path: '/monthly' },
          { icon: '⚙️', label: 'Settings', path: '/settings' }
        ].map((item) => (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.location.href = item.path}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              window.location.pathname === item.path
                ? 'text-accent-purple'
                : 'text-gray-500'
            }`}
            style={{ fontFamily: 'Ruckle, sans-serif' }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default Dashboard;
