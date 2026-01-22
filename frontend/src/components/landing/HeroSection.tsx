import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-7xl sm:text-8xl md:text-9xl font-bold mb-8 tracking-tight"
          >


            <div className="flex items-center justify-center">
              <Logo className="ml-9 h-24 sm:h-32 md:h-40 w-auto"  />
            </div>

          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl  font-medium mb-6 text-[#e5e7eb] leading-tight"
          >
            Where conversations, content, and creators
            <br />
            move in real time.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-[#9ca3af] max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            A modern social platform built for real-time interaction — posts, reels, stories,
            live chat, video calls, and verified identities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="group px-8 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg font-semibold text-white text-lg transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                 Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>

            <button
              onClick={onExploreClick}
              className="group px-8 py-4 glass-card rounded-lg font-semibold text-[#e5e7eb] text-lg transition-all duration-300 hover:scale-105 hover:border-[rgba(168,85,247,0.3)] flex items-center gap-2"
            >
              Explore More
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
