import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlert } from '../context/AlertContext';

const AlertDropdown = () => {
  const { alerts, unreadCount, markAsRead, markAllAsRead, clearAlerts, getRecentAlerts } = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const recentAlerts = getRecentAlerts(5);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      recentAlerts.forEach(alert => {
        if (!alert.read) {
          markAsRead(alert.id);
        }
      });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case 'error': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', icon: '🔴' };
      case 'warning': return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', icon: '🟡' };
      case 'success': return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', icon: '🟢' };
      default: return { bg: 'rgba(123, 47, 255, 0.1)', border: 'rgba(123, 47, 255, 0.3)', icon: '🔔' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2.5 rounded-xl transition-all hover:bg-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center"
        title="Alerts"
      >
        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(15, 15, 25, 0.98)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(123, 47, 255, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(123, 47, 255, 0.1)'
            }}
          >
            <div className="p-3 sm:p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(123, 47, 255, 0.2)' }}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm sm:text-base" style={{ fontFamily: 'Ruckle, sans-serif' }}>Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {alerts.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ fontFamily: 'Ruckle, sans-serif' }}
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={clearAlerts}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                      style={{ fontFamily: 'Ruckle, sans-serif' }}
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="max-h-80 sm:max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-8 text-center">
                  <span className="text-4xl mb-3 block">🔔</span>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: 'Ruckle, sans-serif' }}>No notifications yet</p>
                </div>
              ) : (
                <div className="p-2">
                  {alerts.slice(0, 10).map((alert, index) => {
                    const style = getAlertStyle(alert.type);
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 sm:p-4 rounded-xl mb-2 last:mb-0 transition-all ${!alert.read ? 'bg-white/5' : ''}`}
                        style={{ background: !alert.read ? style.bg : 'transparent', border: `1px solid ${style.border}` }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl flex-shrink-0">{alert.icon || style.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-white text-sm truncate" style={{ fontFamily: 'Ruckle, sans-serif' }}>
                                {alert.title}
                              </p>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {formatTime(alert.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1" style={{ fontFamily: 'Ruckle, sans-serif' }}>
                              {alert.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlertDropdown;
