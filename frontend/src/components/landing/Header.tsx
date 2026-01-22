import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-[rgba(168,85,247,0.15)]"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="pt-3 h-15 w-auto" />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-[#9ca3af] hover:text-[#e5e7eb] transition-colors font-medium text-sm"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg font-semibold text-white text-sm transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
