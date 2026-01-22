import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/landing/Header'; 
import HeroSection from '@/components/landing/HeroSection';

import FeaturesSection from '@/components/landing/FeaturesSection';
import SystemSection from '@/components/landing/SystemSection';
import TrustSection from '@/components/landing/TrustSection';
import CTASection from '@/components/landing/CTASection';
import { useAuthStore } from '@/store/authStore';

export default function Landing() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isCheckingAuth, isAuthChecked, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !isCheckingAuth && !isAuthChecked) {
      checkAuth();
    }
  }, [isAuthenticated, isCheckingAuth, isAuthChecked, checkAuth]);

  const scrollToSection = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a12] text-[#9ca3af]">
        Checking your session...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ willChange: 'scroll-position' }}>
      <Header />
      <main className="relative z-10">
        <HeroSection onExploreClick={scrollToSection} />
        
        <div ref={featuresRef} style={{ contain: 'layout style paint' }}>
          <FeaturesSection />
        </div>
        <div style={{ contain: 'layout style paint' }}>
          <SystemSection />
        </div>
        <div style={{ contain: 'layout style paint' }}>
          <TrustSection />
        </div>
        <div style={{ contain: 'layout style paint' }}>
          <CTASection />
        </div>
      </main>
    </div>
  );
}
