import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../hooks/useBudget';
import BottomNav from '../components/BottomNav';
import { formatCurrency } from '../utils/formatCurrency';
import { getLast6Months, getMonthDisplay, getDaysInMonth } from '../utils/dateHelpers';

const MonthlyPage = () => {
  const { user } = useAuth();
  const { budget } = useBudget();
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (user?.token) {
      fetchMonthlyData();
    }
  }, [user?.token]);

  const fetchMonthlyData = async () => {
    setLoading(true);
    const months = getLast6Months();
    
    try {
      const data = await Promise.all(
        months.map(async (month) => {
          const res = await fetch(`/api/summary/${month}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          if (res.ok) {
            const summary = await res.json();
            return {
              month,
              display: getMonthDisplay(month),
              totalSpent: summary.totalSpent,
              budget: budget?.totalBudget || 0,
              savings: Math.max(0, (budget?.totalBudget || 0) - summary.totalSpent)
            };
          }
          return {
            month,
            display: getMonthDisplay(month),
            totalSpent: 0,
            budget: budget?.totalBudget || 0,
            savings: budget?.totalBudget || 0
          };
        })
      );
      setMonthlyData(data);
    } catch (err) {
      console.error('Failed to fetch monthly data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCalendarData = (month) => {
    const daysInMonth = getDaysInMonth(month);
    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${month}-${String(day).padStart(2, '0')}`;
      data.push({
        day,
        date: dateStr,
        intensity: Math.random() * 100
      });
    }
    return data;
  };

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return 'bg-[var(--bg-primary)]';
    if (intensity < 25) return 'bg-accent-purple/20';
    if (intensity < 50) return 'bg-accent-purple/40';
    if (intensity < 75) return 'bg-accent-purple/60';
    return 'bg-accent-purple/80';
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold mb-6">Monthly Tracker</h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-4 mb-6"
          >
            <h2 className="font-display text-lg font-semibold mb-4">Spending Heatmap</h2>
            <div className="grid grid-cols-7 gap-1">
              {getCalendarData(selectedMonth || getLast6Months()[5]).map((day) => (
                <motion.div
                  key={day.day}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: day.day * 0.01 }}
                  className={`aspect-square rounded ${getIntensityColor(day.intensity)}`}
                  title={`Day ${day.day}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-[var(--text-secondary)]">
              <span>Less</span>
              <div className="w-4 h-4 rounded bg-[var(--bg-primary)]" />
              <div className="w-4 h-4 rounded bg-accent-purple/20" />
              <div className="w-4 h-4 rounded bg-accent-purple/40" />
              <div className="w-4 h-4 rounded bg-accent-purple/60" />
              <div className="w-4 h-4 rounded bg-accent-purple/80" />
              <span>More</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="font-display text-lg font-semibold">Month Summary</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--bg-primary)]/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">Month</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-secondary)]">Spent</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-secondary)]">Budget</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-secondary)]">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((data, i) => {
                    const isOverBudget = data.totalSpent > data.budget;
                    return (
                      <motion.tr
                        key={data.month}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="border-t border-[var(--border-color)] hover:bg-[var(--border-color)]/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedMonth(data.month)}
                      >
                        <td className="px-4 py-3 font-medium">{data.display}</td>
                        <td className="px-4 py-3 text-right font-display">{formatCurrency(data.totalSpent)}</td>
                        <td className="px-4 py-3 text-right font-display text-[var(--text-secondary)]">{formatCurrency(data.budget)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-flex items-center gap-1 text-sm ${
                            isOverBudget ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {isOverBudget ? '↑' : '↓'}
                            {isOverBudget ? 'Over' : 'Under'}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-display ${
                          data.savings > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatCurrency(data.savings)}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 grid grid-cols-2 gap-4"
          >
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-sm text-[var(--text-secondary)] mb-1">Average Monthly</p>
              <p className="font-display text-xl font-bold">
                {formatCurrency(
                  monthlyData.length > 0
                    ? monthlyData.reduce((sum, d) => sum + d.totalSpent, 0) / monthlyData.length
                    : 0
                )}
              </p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-sm text-[var(--text-secondary)] mb-1">Total Saved</p>
              <p className="font-display text-xl font-bold text-green-500">
                {formatCurrency(
                  monthlyData.reduce((sum, d) => sum + Math.max(0, d.savings), 0)
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default MonthlyPage;
