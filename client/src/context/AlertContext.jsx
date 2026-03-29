import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

const STORAGE_KEY = 'paisatracker_alerts';
const NOTIF_PERMISSION_KEY = 'paisatracker_notif_permission';

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifPermission, setNotifPermission] = useState(
    localStorage.getItem(NOTIF_PERMISSION_KEY) || 'default'
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setAlerts(parsed.alerts || []);
      setUnreadCount(parsed.unreadCount || 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      alerts,
      unreadCount
    }));
  }, [alerts, unreadCount]);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return 'unsupported';
    }

    if (Notification.permission === 'granted') {
      setNotifPermission('granted');
      localStorage.setItem(NOTIF_PERMISSION_KEY, 'granted');
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      localStorage.setItem(NOTIF_PERMISSION_KEY, permission);
      return permission;
    }

    return Notification.permission;
  }, []);

  const sendBrowserNotification = useCallback((title, body, icon = '🔔') => {
    if (notifPermission === 'granted') {
      new Notification(title, {
        body,
        icon: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${icon}</text></svg>`,
        badge: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💰</text></svg>`,
        tag: `paisatracker-${Date.now()}`,
        renotify: true
      });
    }
  }, [notifPermission]);

  const addAlert = useCallback((alert) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...alert
    };
    
    setAlerts(prev => [newAlert, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);

    if (alert.sendNotification && alert.title) {
      sendBrowserNotification(alert.title, alert.message, alert.icon);
    }

    return newAlert;
  }, [sendBrowserNotification]);

  const markAsRead = useCallback((alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  const getRecentAlerts = useCallback((count = 5) => {
    return alerts.slice(0, count);
  }, [alerts]);

  const value = {
    alerts,
    unreadCount,
    notifPermission,
    requestNotificationPermission,
    addAlert,
    markAsRead,
    markAllAsRead,
    clearAlerts,
    getRecentAlerts,
    sendBrowserNotification
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};
