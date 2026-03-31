import React from 'react';
import { cn } from '../lib/utils';

interface StatBadgeProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatBadge: React.FC<StatBadgeProps> = ({ label, value, icon, trend, className }) => {
  return (
    <div className={cn(
      "flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/5 ring-1 ring-white/5",
      className
    )}>
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          {icon}
        </div>
      )}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white tracking-tight">{value}</span>
          {trend === 'up' && <span className="text-[10px] text-emerald-500 font-bold">↑</span>}
          {trend === 'down' && <span className="text-[10px] text-red-400 font-bold">↓</span>}
        </div>
      </div>
    </div>
  );
};

export default StatBadge;
