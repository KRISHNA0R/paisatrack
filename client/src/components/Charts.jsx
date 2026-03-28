import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const Charts = ({ summary, totalBudget }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Donut', icon: '🍩' },
    { name: 'Daily', icon: '📊' },
    { name: 'Cumulative', icon: '📈' },
    { name: 'Monthly', icon: '📅' }
  ];

  if (!summary) return null;

  const { categoryTotals, dailyTotals, cumulativeData, totalSpent } = summary;

  const categoryData = Object.entries(categoryTotals || {}).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  const dailyData = Object.entries(dailyTotals || {}).map(([date, value]) => ({
    date: date.split('-')[2],
    fullDate: date,
    amount: value
  }));

  const colors = ['#7B2FFF', '#14B8A6', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#EF4444', '#22C55E'];

  return (
    <div className="rounded-2xl p-5" style={{ 
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="flex gap-2 mb-6 overflow-x-auto custom-scrollbar">
        {tabs.map((tab, i) => (
          <motion.button
            key={tab.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === i
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            style={{
              background: activeTab === i 
                ? 'linear-gradient(135deg, #7B2FFF 0%, #A855F7 100%)'
                : 'rgba(255, 255, 255, 0.05)'
            }}
          >
            {tab.icon} {tab.name}
          </motion.button>
        ))}
      </div>

      <div className="min-h-[350px]">
        {activeTab === 0 && (
          <DonutChart data={categoryData} colors={colors} totalSpent={totalSpent} />
        )}
        {activeTab === 1 && (
          <DailyBarChart data={dailyData} />
        )}
        {activeTab === 2 && (
          <CumulativeLineChart data={cumulativeData} totalBudget={totalBudget} />
        )}
        {activeTab === 3 && (
          <MonthlyComparison />
        )}
      </div>
    </div>
  );
};

const DonutChart = ({ data, colors, totalSpent }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No expenses this month</p>
          <p className="text-sm">Add some expenses to see the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
      <div className="relative w-56 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  style={{ 
                    filter: activeIndex === index ? 'brightness(1.3)' : 'none',
                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center'
                  }}
                  className="transition-all duration-200"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(12, 12, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white'
              }}
              formatter={(value) => [`₹${value}`, 'Spent']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-white">₹{totalSpent}</span>
          <span className="text-sm text-gray-500">Total</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {data.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
              activeIndex === i ? 'bg-accent-purple/20' : ''
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="text-sm text-white flex-1">{item.name}</span>
            <span className="font-display font-medium text-gray-300">₹{item.value}</span>
            <span className="text-xs text-gray-500 w-12 text-right">
              {totalSpent > 0 ? Math.round((item.value / totalSpent) * 100) : 0}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DailyBarChart = ({ data }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No expenses this month</p>
          <p className="text-sm">Add some expenses to see the chart</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.amount), 1);

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(12, 12, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white'
            }}
            formatter={(value) => [`₹${value}`, 'Daily Spend']}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Bar 
            dataKey="amount" 
            fill="url(#barGradient)" 
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B2FFF" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const CumulativeLineChart = ({ data, totalBudget }) => {
  if (!data || !data.length) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No data available</p>
          <p className="text-sm">Add expenses to see cumulative spending</p>
        </div>
      </div>
    );
  }

  const dailyBudget = totalBudget / 30;
  const budgetLine = data.map((_, i) => ({
    day: i + 1,
    budget: Math.round(dailyBudget * (i + 1))
  }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(12, 12, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white'
            }}
            formatter={(value, name) => [
              `₹${value}`,
              name === 'cumulative' ? 'Cumulative' : 'Budget Line'
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#7B2FFF" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#7B2FFF' }}
          />
          <Line 
            type="monotone" 
            dataKey="budget" 
            stroke="#EF4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span style={{ color: '#9CA3AF' }}>{value === 'cumulative' ? 'Cumulative Spend' : 'Budget Line'}</span>}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const MonthlyComparison = () => {
  return (
    <div className="flex items-center justify-center h-[350px] text-gray-500">
      <div className="text-center">
        <p className="text-lg mb-2">Monthly Comparison</p>
        <p className="text-sm max-w-xs">
          This feature requires historical data from at least 2 months of expenses.
          Keep tracking to see monthly comparisons!
        </p>
      </div>
    </div>
  );
};

export default Charts;
