import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AgentStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  agent: string;
}

interface AgentPipelineProps {
  steps: AgentStep[];
}

const AgentPipeline: React.FC<AgentPipelineProps> = ({ steps }) => {
  return (
    <div className="w-full space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
         <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Orchestration Lifecycle</h4>
         <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-emerald-500/20"></div>
            ))}
         </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {index !== steps.length - 1 && (
              <div className={cn(
                "absolute left-4 top-8 w-0.5 h-6 -ml-px transition-colors duration-500",
                step.status === 'completed' ? "bg-emerald-500/30" : "bg-white/5"
              )} />
            )}
            
            <div className="flex items-center group">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ring-4 ring-[#020408]",
                step.status === 'completed' ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]" :
                step.status === 'active' ? "bg-emerald-500/20 text-emerald-400 animate-pulse border border-emerald-500/30" :
                "bg-white/5 text-slate-600 border border-white/10"
              )}>
                {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                 step.status === 'active' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                 <Circle className="w-4 h-4" />}
              </div>
              
              <div className="ml-6 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className={cn(
                    "text-xs font-bold transition-colors",
                    step.status === 'completed' ? "text-white" :
                    step.status === 'active' ? "text-emerald-400" : "text-slate-500"
                  )}>
                    {step.name}
                  </h5>
                  <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    {step.agent}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentPipeline;
