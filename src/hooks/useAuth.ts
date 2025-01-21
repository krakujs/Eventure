import { useState, useEffect } from 'react';
import { User } from '../types';
import * as api from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // Fetch user data
      api.getCurrentUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('jwtToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  return { user, loading, logout };
};