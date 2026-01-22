import { motion } from 'framer-motion';
import { Shield, Zap, CheckCircle } from 'lucide-react';
import Logo from '@/components/Logo';

export default function SideInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col justify-center h-full px-8 lg:px-12"
    >
      <div className="mb-12">
        <h1 className="flex items-center gap-4 text-5xl sm:text-6xl font-bold mb-6">
          <Logo className="h-16 sm:h-20 w-auto" />
        </h1>
        <p className="text-xl sm:text-2xl text-[#e5e7eb] mb-4 leading-relaxed">
          Identity is your entry point.
        </p>
        <p className="text-lg text-[#9ca3af] leading-relaxed">
          Secure. Real-time. Verified.
        </p>
      </div>

      <div className="space-y-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-[#a855f7] mt-0.5 flex-shrink-0" />
          <span className="text-sm text-[#9ca3af]">
            JWT-secured sessions
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-start gap-3"
        >
          <Zap className="w-5 h-5 text-[#06b6d4] mt-0.5 flex-shrink-0" />
          <span className="text-sm text-[#9ca3af]">
            Real-time access layer
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-start gap-3"
        >
          <CheckCircle className="w-5 h-5 text-[#a855f7] mt-0.5 flex-shrink-0" />
          <span className="text-sm text-[#9ca3af]">
            Verified identity support
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

