import React from 'react';
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { getEdgeCaseLabel, getEdgeCaseDescription, getEdgeCaseSeverity } from '../utils/formatters';

interface EdgeCaseCardProps {
  code: string;
  adjustment?: string;
  isActive?: boolean;
}

const EdgeCaseCard: React.FC<EdgeCaseCardProps> = ({ code, adjustment, isActive = true }) => {
  const label = getEdgeCaseLabel(code);
  const description = getEdgeCaseDescription(code);
  const severity = getEdgeCaseSeverity(code);

  const severityStyles = {
    info: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    warning: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    critical: "text-white bg-emerald-600 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
  };

  const icons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    critical: <ShieldCheck className="w-5 h-5" />
  };

  return (
    <div className={cn(
      "p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden",
      severityStyles[severity as keyof typeof severityStyles] || severityStyles.info,
      !isActive && "opacity-40 grayscale pointer-events-none"
    )}>
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {icons[severity as keyof typeof icons] || icons.info}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-extrabold text-sm uppercase tracking-widest">{label}</h5>
            <span className="text-[10px] font-bold opacity-60 font-mono">{code}</span>
          </div>
          <p className="text-xs leading-relaxed opacity-80 mb-4">{description}</p>
          
          {adjustment && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/5 text-[10px] font-bold uppercase tracking-tight">
              <span className="opacity-60">Adaptation:</span>
              <span>{adjustment}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Background flare */}
      {severity === 'critical' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
      )}
    </div>
  );
};

export default EdgeCaseCard;
