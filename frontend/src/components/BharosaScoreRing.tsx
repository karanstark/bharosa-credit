import React from 'react';
import { motion } from 'framer-motion';

interface BharosaScoreRingProps {
  score: number;
  maxScore?: number;
}

const BharosaScoreRing: React.FC<BharosaScoreRingProps> = ({ score, maxScore = 100 }) => {
  const percentage = (score / maxScore) * 100;
  const strokeDasharray = 332;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-48 h-48 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="96"
          cy="96"
          r="84"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-white/5"
        />
        {/* Progress circle */}
        <motion.circle
          cx="96"
          cy="96"
          r="84"
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: strokeDasharray }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-5xl font-extrabold text-white tracking-tighter"
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">BHAROSA SCORE</span>
        
        <div className="mt-2 flex flex-col items-center gap-1">
           <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tight">Level: Prime</span>
           </div>
           <div className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="text-[8px] font-bold text-blue-400 uppercase tracking-tight">CIBIL EQ: {Math.round(600 + (score * 3))} - {Math.round(650 + (score * 3))}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BharosaScoreRing;
