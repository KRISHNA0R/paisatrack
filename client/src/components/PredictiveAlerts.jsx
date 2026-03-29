import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAlert } from '../context/AlertContext';

const PredictiveAlerts = ({ totalSpent, totalBudget, alertThreshold, currentMonth }) => {
  const { addAlert, requestNotificationPermission, notifPermission } = useAlert();

  const today = new Date();
  const daysPassed = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remaining = totalBudget - totalSpent;

  const spendingAnalysis = useMemo(() => {
    if (totalBudget <= 0 || daysPassed <= 0) return null;

    const dailyAverage = totalSpent / daysPassed;
    const projectedTotal = dailyAverage * daysInMonth;
    const projectedOverspend = projectedTotal - totalBudget;
    const daysRemaining = daysInMonth - daysPassed;

    return {
      dailyAverage,
      projectedTotal,
      projectedOverspend,
      daysRemaining,
      budgetUsedPercent: (totalSpent / totalBudget) * 100,
      severity: projectedOverspend > totalBudget * 0.2 ? 'red' : projectedOverspend > 0 ? 'amber' : 'green'
    };
  }, [totalSpent, totalBudget, daysPassed, daysInMonth]);

  useEffect(() => {
    if (notifPermission === 'default') {
      requestNotificationPermission();
    }
  }, [notifPermission, requestNotificationPermission]);

  useEffect(() => {
    if (!spendingAnalysis || totalBudget <= 0) return;

    if (remaining < alertThreshold && remaining > 0) {
      addAlert({
        type: 'warning',
        title: 'Low Budget Alert!',
        message: `Only ₹${remaining.toLocaleString('en-IN')} left in your budget`,
        icon: '⚠️',
        sendNotification: true
      });
    }

    if (spendingAnalysis.projectedOverspend > 0) {
      addAlert({
        type: spendingAnalysis.severity,
        title: 'Budget Alert!',
        message: `At this rate, you'll exceed your budget by ₹${Math.round(spendingAnalysis.projectedOverspend).toLocaleString('en-IN')}`,
        icon: spendingAnalysis.severity === 'red' ? '🔴' : '🟡',
        sendNotification: true
      });
    }

    if (daysPassed >= 20 && spendingAnalysis.budgetUsedPercent >= 80) {
      addAlert({
        type: 'info',
        title: '80% Budget Used',
        message: `${spendingAnalysis.daysRemaining} days left in the month!`,
        icon: '📅',
        sendNotification: true
      });
    }
  }, []);

  if (!spendingAnalysis || totalBudget <= 0 || spendingAnalysis.projectedOverspend <= 0) {
    return null;
  }

  const bannerStyle = spendingAnalysis.severity === 'red'
    ? { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', icon: '🔴' }
    : { background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', icon: '🟡' };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 mb-4"
      style={{ 
        background: bannerStyle.background,
        border: bannerStyle.border
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{bannerStyle.icon}</span>
        <div className="flex-1">
          <p className="text-white font-medium text-sm sm:text-base" style={{ fontFamily: 'Ruckle, sans-serif' }}>
            At this rate, you'll exceed your ₹{totalBudget.toLocaleString('en-IN')} budget
          </p>
          <p className="text-white/70 text-sm mt-1" style={{ fontFamily: 'Ruckle, sans-serif' }}>
            Projected overspend: ₹{Math.round(spendingAnalysis.projectedOverspend).toLocaleString('en-IN')} 
            <span className="text-white/50 ml-2">
              ({spendingAnalysis.daysRemaining} days left)
            </span>
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
            <span>₹{Math.round(spendingAnalysis.dailyAverage).toLocaleString('en-IN')}/day avg</span>
            <span>•</span>
            <span>{Math.round(spendingAnalysis.projectedTotal).toLocaleString('en-IN')} projected</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictiveAlerts;
