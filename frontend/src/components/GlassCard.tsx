import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "glass-panel rounded-[2rem] p-6 transition-all duration-300",
      "bg-[#0d0d12] border-white/5 shadow-2xl overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
};

export default GlassCard;
