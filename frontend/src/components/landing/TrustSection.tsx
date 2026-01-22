import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function TrustSection() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl font-bold mb-4">
            <span className="text-gradient">Trust is designed, not assumed</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6"
            style={{ willChange: 'transform' }}
          >
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-6 h-6 text-[#a855f7]" />
                <h3 className="text-xl font-semibold text-[#e5e7eb]">
                  Verification badges
                </h3>
              </div>
              <p className="text-[#9ca3af] text-sm">
                Paid identity confirmation ensures authentic profiles
              </p>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-[#06b6d4]" />
                <h3 className="text-xl font-semibold text-[#e5e7eb]">
                  Reduced spam
                </h3>
              </div>
              <p className="text-[#9ca3af] text-sm">
                Account-level trust filters out low-quality content
              </p>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Lock className="w-6 h-6 text-[#a855f7]" />
                <h3 className="text-xl font-semibold text-[#e5e7eb]">
                  Higher signal content
                </h3>
              </div>
              <p className="text-[#9ca3af] text-sm">
                Verified users create more meaningful interactions
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setIsUnlocked(true)}
              onMouseLeave={() => setIsUnlocked(false)}
            >
              <motion.div
                animate={{
                  scale: isUnlocked ? 1.1 : 1,
                  boxShadow: isUnlocked
                    ? '0 0 40px rgba(168, 85, 247, 0.5)'
                    : '0 0 20px rgba(168, 85, 247, 0.3)',
                }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl p-12"
              >
                {isUnlocked ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="w-24 h-24 text-[#06b6d4] mx-auto" />
                    <p className="text-center mt-4 text-[#e5e7eb] font-semibold">
                      Verified
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Lock className="w-24 h-24 text-[#a855f7] mx-auto" />
                    <p className="text-center mt-4 text-[#e5e7eb] font-semibold">
                      Locked
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

