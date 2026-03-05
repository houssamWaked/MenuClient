import { useEffect, useState } from 'react';
import './App.css';
import {
  adminLogin,
  clearAdminSession,
  fetchAdminSession,
  restoreAdminToken,
} from './api/adminApi.js';
import { LoginScreen } from './components/LoginScreen.jsx';
import { AdminDashboard } from './components/AdminDashboard.jsx';

function App() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const restore = async () => {
      const token = restoreAdminToken();
      if (!token) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const session = await fetchAdminSession();
        setAdminUser(session?.user ?? null);
      } catch {
        clearAdminSession();
        setAdminUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    };

    restore();
  }, []);

  const handleLogin = async (email, password) => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const data = await adminLogin(email, password);
      setAdminUser(data?.user ?? null);
    } catch (error) {
      setLoginError(error?.response?.data?.message ?? error?.message ?? 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setAdminUser(null);
    setLoginError('');
  };

  if (isCheckingSession) {
    return (
      <main className="admin-loader">
        <div className="admin-loader__spinner" />
        <p>Checking session...</p>
      </main>
    );
  }

  if (!adminUser) {
    return <LoginScreen error={loginError} isLoading={isLoggingIn} onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} user={adminUser} />;
}

export default App;
