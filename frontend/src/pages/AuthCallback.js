import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import '../styles/auth-callback.css';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userStr = urlParams.get('user');

        console.log('🔍 OAuth Callback - Token:', token);
        console.log('🔍 OAuth Callback - User:', userStr);

        if (token && userStr) {
          // Parse user data
          const user = JSON.parse(decodeURIComponent(userStr));
          
          // Store token and user data in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          console.log('✅ OAuth Login successful:', user);
          
          // Redirect based on user role
          if (user.role === 'Client') {
            navigate('/client/dashboard');
          } else if (user.role === 'Attorney') {
            navigate('/attorney/dashboard');
          } else if (user.role === 'Admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/client/dashboard'); // Default to client dashboard
          }
        } else {
          console.error('❌ OAuth Callback - Missing token or user data');
          navigate('/login?error=missing_data');
        }
      } catch (error) {
        console.error('❌ OAuth Callback Error:', error);
        navigate('/login?error=callback_failed');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Authenticating...</h2>
          <p>Please wait while we complete your login.</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
