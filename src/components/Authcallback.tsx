import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      console.log('AuthCallback component mounted');
      console.log('Current location:', location);
  
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
  
      if (token) {
        console.log('Token received:', token);
        try {
          localStorage.setItem('jwtToken', token);
          console.log('Token saved to localStorage');
          navigate('/dashboard');
        } catch (error) {
          console.error('Error saving token to localStorage:', error);
        }
      } else {
        console.error('No token received in callback');
        navigate('/login');
      }
    }, [location, navigate]);
  
    return <div>Processing authentication...</div>;
  };
  export default AuthCallback;