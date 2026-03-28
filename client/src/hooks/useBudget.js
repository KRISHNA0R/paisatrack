import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useBudget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchBudget = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      setLoading(true);
      const res = await fetch('/api/budget', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setBudget(data);
        setError(null);
      } else if (res.status === 404) {
        setBudget(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const updateBudget = async (updates) => {
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update budget');
      const data = await res.json();
      setBudget(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { budget, loading, error, updateBudget, refetch: fetchBudget };
};
