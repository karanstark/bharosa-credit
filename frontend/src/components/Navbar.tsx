import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-x-0 border-t-0 bg-bg-deep/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-accent-orange/10 flex items-center justify-center border border-accent-orange/20 animate-glow-pulse">
              <ShieldCheck className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-text-muted bg-clip-text text-transparent">
                Bharosa<span className="text-accent-orange">Credit</span>
              </span>
              <p className="text-[10px] text-text-muted uppercase tracking-wider -mt-1 font-semibold">
                Autonomous AI Scoring
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
              System Online
            </div>
            <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-text-muted border-accent-orange/30">
              Agent Orchestrator: <span className="text-accent-orange">v2.1</span>
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
