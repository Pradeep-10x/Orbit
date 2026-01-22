import { motion } from 'framer-motion';

const badges = [
  'Modular backend',
  'API-first design',
  'Real-time architecture',
  'Secure media handling',
  'Payment workflows',
  'Clean data models',
];

export default function SystemSection() {
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
            <span className="text-gradient">Engineered for scale</span>
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-2xl mx-auto">
            Built like a system, not a toy
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, delay: index * 0.03, ease: [0.4, 0, 0.2, 1] }}
              className="glass-card rounded-full px-6 py-3 transition-transform duration-200 hover:scale-105 hover:border-[rgba(168,85,247,0.3)] hover:glow-purple"
              style={{ willChange: 'transform' }}
            >
              <span className="text-sm font-medium text-[#e5e7eb]">
                {badge}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

