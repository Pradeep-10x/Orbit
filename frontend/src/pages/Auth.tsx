import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import SideInfo from '@/components/auth/SideInfo';
import AuthCard from '@/components/auth/AuthCard';

export default function AuthPage() {
  const { isAuthenticated, checkAuth, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Only check auth once on mount
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    // Only redirect if auth check is complete and user is authenticated
    if (!isCheckingAuth && isAuthenticated) {
      navigate('/feed', { replace: true });
    }
  }, [isAuthenticated, isCheckingAuth, navigate]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a12]">
        <div className="text-[#9ca3af]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Info */}
            <div className="hidden lg:block">
              <SideInfo />
            </div>

            {/* Right Side - Auth Card */}
            <div className="flex justify-center lg:justify-end">
              <AuthCard />
            </div>
          </div>

          {/* Mobile: Show info above card */}
          <div className="lg:hidden mb-8">
            <SideInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

