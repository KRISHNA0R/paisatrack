import { motion } from 'framer-motion';

const RainbowButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        background: 'linear-gradient(90deg, #7B2FFF, #A855F7, #EC4899, #F59E0B, #22C55E, #14B8A6, #7B2FFF)',
        backgroundSize: '400% 400%',
        animation: 'rainbowGradient 3s ease infinite',
        fontFamily: 'Ruckle, sans-serif',
        padding: '16px 32px',
        color: 'white',
        border: 'none',
        boxShadow: '0 0 20px rgba(123, 47, 255, 0.3)',
      }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      <style>{`
        @keyframes rainbowGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.button>
  );
};

export default RainbowButton;
