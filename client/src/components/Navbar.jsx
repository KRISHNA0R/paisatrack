import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import AlertDropdown from './AlertDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 px-3 sm:px-4 py-2.5 sm:py-3"
      style={{ 
        background: 'rgba(10, 10, 26, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #A855F7 100%)' }}>
            <img src="/logo.png" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-cover rounded-full" />
          </div>
          <span className="font-bold text-lg sm:text-xl text-white hidden sm:block" style={{ fontFamily: 'Ruckle, sans-serif' }}>
            PaisaTrack
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">

          {user && (
            <>
              <AlertDropdown />
            <div className="relative" ref={dropdownRef}>
              <motion.img
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=7C3AED&color=fff`}
                alt="Profile"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover cursor-pointer"
                style={{ border: '2px solid rgba(123, 47, 255, 0.5)' }}
                onClick={() => setShowDropdown(!showDropdown)}
              />
              
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 sm:w-64 rounded-2xl overflow-hidden"
                  style={{ 
                    background: 'rgba(15, 15, 25, 0.98)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(123, 47, 255, 0.3)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(123, 47, 255, 0.1)'
                  }}
                >
                  <div className="p-3 sm:p-4 border-b" style={{ borderColor: 'rgba(123, 47, 255, 0.2)' }}>
                    <p className="font-medium text-white truncate text-sm sm:text-base" style={{ fontFamily: 'Ruckle, sans-serif' }}>{user.displayName}</p>
                    <p className="text-xs text-gray-400 truncate mt-1" style={{ fontFamily: 'Ruckle, sans-serif' }}>{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors text-sm sm:text-base"
                      onClick={() => setShowDropdown(false)}
                      style={{ fontFamily: 'Ruckle, sans-serif' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <button
                      onClick={() => { logout(); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm sm:text-base"
                      style={{ fontFamily: 'Ruckle, sans-serif' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
