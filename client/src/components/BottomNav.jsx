import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/add', icon: '➕', label: 'Add' },
    { path: '/monthly', icon: '📅', label: 'Monthly' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-[var(--border-color)] md:hidden z-40">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'text-accent-purple'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
