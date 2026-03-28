import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';

const CategoryCard = ({ category, spent, index }) => {
  const percentage = category.budget > 0 ? Math.min((spent / category.budget) * 100, 100) : 0;
  const isOverBudget = spent > category.budget;
  const remaining = category.budget - spent;
  
  const getProgressColor = () => {
    if (percentage > 90) return 'from-red-500 to-red-400';
    if (percentage > 70) return 'from-amber-500 to-amber-400';
    return 'from-accent-purple to-purple-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ 
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: 'rgba(123, 47, 255, 0.15)' }}>
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{category.name}</h3>
          <p className="text-sm text-gray-500">
            {formatCurrency(spent)} / {formatCurrency(category.budget)}
          </p>
        </div>
      </div>
      
      <div className="h-2.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: index * 0.08 + 0.2 }}
          className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs ${isOverBudget ? 'text-red-400' : 'text-gray-500'}`}>
          {isOverBudget ? 'Over by ' : remaining > 0 ? 'Left: ' : ''}{formatCurrency(Math.abs(remaining))}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div 
        className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20"
        style={{ 
          background: percentage > 90 ? '#EF4444' : percentage > 70 ? '#F59E0B' : '#7B2FFF',
          transform: 'translate(30%, -30%)'
        }}
      />
    </motion.div>
  );
};

export default CategoryCard;
