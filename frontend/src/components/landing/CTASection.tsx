import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8">
            <span className="text-gradient">Ready to Dive In</span>
            <br />
            <span className="text-[#e5e7eb]">your own orbit?</span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ willChange: 'transform' }}
          >
            <Link
              to="/register"
              className="group px-10 py-5 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg font-semibold text-white text-lg transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>

            <Link
              to="/login"
              className="px-10 py-5 glass-card rounded-lg font-semibold text-[#e5e7eb] text-lg transition-all duration-300 hover:scale-105 hover:border-[rgba(168,85,247,0.3)]"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
