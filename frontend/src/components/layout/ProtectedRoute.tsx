import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { isAuthenticated, isCheckingAuth, isAuthChecked, checkAuth } = useAuthStore();

  useEffect(() => {
    // Only check auth if not already checked and not currently checking
    if (!isAuthChecked && !isCheckingAuth) {
      checkAuth();
    }
  }, [isAuthChecked, isCheckingAuth, checkAuth]);

  // Show loading only while checking auth
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a12] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <div className="text-[#9ca3af]">Checking your session...</div>
      </div>
    );
  }

  // After auth check, redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

