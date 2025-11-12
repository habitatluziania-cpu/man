import { useState, useEffect } from 'react';
import { MultiStepForm } from './components/MultiStepForm';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserLogin } from './pages/UserLogin';
import { supabase } from './lib/supabase';

function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'admin' | 'login'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentRoute('admin');
    } else if (path === '/login') {
      setCurrentRoute('login');
    } else {
      setCurrentRoute('home');
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setLoading(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading && currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentRoute === 'admin') {
    if (isAuthenticated) {
      return <AdminDashboard onLogout={handleLogout} />;
    }
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentRoute === 'login') {
    return <UserLogin />;
  }

  return <MultiStepForm />;
}

export default App;
