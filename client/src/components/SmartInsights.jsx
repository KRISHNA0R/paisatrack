import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';

const SmartInsights = ({ summary, budget, currentMonth }) => {
  if (!summary || !budget) return null;

  const insights = [];
  const { categoryTotals, totalSpent } = summary;
  const { totalBudget, categories } = budget;

  if (totalSpent > totalBudget * 0.9) {
    insights.push({
      icon: '⚠️',
      text: `You have spent ${Math.round((totalSpent / totalBudget) * 100)}% of your budget! Only ₹${Math.max(0, totalBudget - totalSpent)} left.`,
      type: 'warning'
    });
  }

  if (totalSpent > totalBudget) {
    insights.push({
      icon: '🚨',
      text: `You are over budget by ₹${Math.abs(totalBudget - totalSpent)}! Time to cut back.`,
      type: 'error'
    });
  }

  const topCategory = Object.entries(categoryTotals || {}).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    const categoryBudget = categories?.find(c => c.name === topCategory[0])?.budget || 0;
    if (topCategory[1] > categoryBudget) {
      insights.push({
        icon: '📊',
        text: `You spent ₹${topCategory[1]} on ${topCategory[0]}, exceeding its budget of ₹${categoryBudget}.`,
        type: 'info'
      });
    }
  }

  if (totalSpent < totalBudget * 0.5 && totalSpent > 0) {
    insights.push({
      icon: '🎉',
      text: `Great job! You have spent only ${Math.round((totalSpent / totalBudget) * 100)}% of your budget. ₹${totalBudget - totalSpent} saved!`,
      type: 'success'
    });
  }

  const dailyAverage = totalSpent / new Date().getDate();
  const projectedMonthly = dailyAverage * 30;
  if (projectedMonthly > totalBudget) {
    insights.push({
      icon: '📈',
      text: `At this rate, you'll spend ₹${Math.round(projectedMonthly)} this month, ₹${Math.round(projectedMonthly - totalBudget)} over budget.`,
      type: 'warning'
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: '💡',
      text: 'Track your daily expenses to get personalized insights!',
      type: 'info'
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-4 sm:mb-6 p-4 rounded-2xl"
      style={{ 
        background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
        border: '1px solid rgba(123, 47, 255, 0.2)'
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧠</span>
        <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'Ruckle, sans-serif' }}>Smart Insights</h3>
      </div>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-start gap-2 sm:gap-3 p-3 rounded-xl"
            style={{ 
              background: insight.type === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                         insight.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                         insight.type === 'success' ? 'rgba(34, 197, 94, 0.1)' :
                         'rgba(123, 47, 255, 0.1)'
            }}
          >
            <span className="text-base sm:text-lg flex-shrink-0">{insight.icon}</span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed" style={{ fontFamily: 'Ruckle, sans-serif' }}>{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SmartInsights;
