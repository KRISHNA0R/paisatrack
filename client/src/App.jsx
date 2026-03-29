import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Monthly from './pages/Monthly';
import Settings from './pages/Settings';
import OnboardingModal from './components/OnboardingModal';
import EtherealShadow from './components/EtherealShadow';
import SmoothCursor from './components/SmoothCursor';
import LoadingScreen from './components/LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingBudget, setCheckingBudget] = useState(false);
  const previousUserId = useRef(null);
  
  useEffect(() => {
    const checkUserBudget = async () => {
      if (user?.token && isAuthenticated) {
        setCheckingBudget(true);
        try {
          const res = await fetch('/api/budget', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          
          if (res.status === 404) {
            setShowOnboarding(true);
          } else if (res.ok) {
            const data = await res.json();
            if (!data.totalBudget) {
              setShowOnboarding(true);
            } else {
              setShowOnboarding(false);
            }
          } else {
            setShowOnboarding(true);
          }
        } catch (err) {
          console.error('Failed to check budget:', err);
          setShowOnboarding(true);
        } finally {
          setCheckingBudget(false);
        }
      }
    };
    
    if (user?.uid && isAuthenticated) {
      if (previousUserId.current !== user.uid) {
        previousUserId.current = user.uid;
        checkUserBudget();
      }
    }
  }, [user?.uid, user?.token, isAuthenticated]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      setShowOnboarding(false);
      previousUserId.current = null;
    }
  }, [isAuthenticated]);
  
  if (loading) {
    return <LoadingScreen />;
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    previousUserId.current = user?.uid;
  };

  return (
    <>
      <SmoothCursor />
      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard onOpenOnboarding={() => setShowOnboarding(true)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Navbar />
              <AddExpense />
            </ProtectedRoute>
          }
        />
        <Route
          path="/monthly"
          element={
            <ProtectedRoute>
              <Navbar />
              <Monthly />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Navbar />
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <div className="dark min-h-screen" style={{ backgroundColor: '#08080E' }}>
            <EtherealShadow />
            <AppRoutes />
          </div>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
