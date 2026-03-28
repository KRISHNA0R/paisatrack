import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedCircularProgressBar = ({ 
  value = 0, 
  gaugePrimaryColor = 'rgb(124, 58, 237)',
  gaugeSecondaryColor = 'rgba(255,255,255,0.1)',
  maxValue = 100,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = Math.min((displayValue / maxValue) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: 100, height: 100 }}>
      <svg className="transform -rotate-90" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gaugePrimaryColor} />
            <stop offset="100%" stopColor={gaugePrimaryColor.replace('rgb', 'rgba').replace(')', ', 0.6)')} />
          </linearGradient>
        </defs>
        
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={gaugeSecondaryColor}
          strokeWidth="8"
          fill="none"
        />
        
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#circularGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-xl sm:text-2xl font-bold"
          style={{ 
            fontFamily: 'Ruckle, sans-serif',
            color: 'white'
          }}
        >
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default AnimatedCircularProgressBar;
