import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AnimatedThemeToggler = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full p-1 cursor-pointer ${className}`}
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #1E1E2E, #2D2D44)' 
          : 'linear-gradient(135deg, #FFE4B5, #FFD700)',
        border: '2px solid rgba(123, 47, 255, 0.3)',
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{
          x: isDark ? 0 : 28,
          rotate: isDark ? 0 : 180,
          scale: isDark ? 1 : 0.8,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
        className="w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #FBBF24, #F59E0B)'
            : 'linear-gradient(135deg, #7B2FFF, #A855F7)',
          boxShadow: isDark 
            ? '0 0 10px rgba(251, 191, 36, 0.5)'
            : '0 0 15px rgba(123, 47, 255, 0.5)',
        }}
      >
        {isDark ? (
          <motion.svg
            initial={false}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-3 h-3 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </motion.svg>
        ) : (
          <motion.svg
            initial={false}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </motion.svg>
        )}
      </motion.div>
    </motion.button>
  );
};

export default AnimatedThemeToggler;
