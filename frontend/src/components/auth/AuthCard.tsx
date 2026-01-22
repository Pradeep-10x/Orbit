import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    location.pathname === '/register' ? 'register' : 'login'
  );

  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    navigate(tab === 'login' ? '/login' : '/register', { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel rounded-2xl p-8 sm:p-10 w-full max-w-md"
    >
      {/* Card Title */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-[#e5e7eb] text-center">
        {activeTab === 'login' ? 'Sign In ' : 'Create your account'}
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 glass-card rounded-lg">
        <button
          onClick={() => handleTabChange('login')}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'login'
              ? 'bg-[#7c3aed] text-white'
              : 'text-[#9ca3af] hover:text-[#e5e7eb]'
            }`}
        >
          Login
        </button>
        <button
          onClick={() => handleTabChange('register')}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'register'
              ? 'bg-[#7c3aed] text-white'
              : 'text-[#9ca3af] hover:text-[#e5e7eb]'
            }`}
        >
          Register
        </button>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

