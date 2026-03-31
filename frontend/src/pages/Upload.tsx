import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useBharosaStore } from '../store/bharosaStore';

interface UploadProps {
  onBack: () => void;
  onComplete: () => void;
}

const Upload: React.FC<UploadProps> = ({ onBack, onComplete }) => {
  const { analyzeSample, isLoading } = useBharosaStore();

  const handleSample = async (type: string) => {
    await analyzeSample(type);
    onComplete();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 font-jakarta">
      
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Return to Dashboard</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
           Orchestration Gateway
        </div>
        <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">
          Initialize Your 
          <br />
          <span className="text-emerald-500">Prosperity Path</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Select a financial archetype that aligns with your current status. Our 7-agent pipeline will then orchestrate a personalized roadmap to your future goals.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full relative">
        {/* Decorative backdrop glow */}
        <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl -z-10"></div>

        <GlassCard className="flex flex-col h-full bg-[#0d0d12] border-white/5 relative overflow-hidden p-8 rounded-[2.5rem]">
          <div className="relative z-10 flex flex-col gap-5">
            
            {/* Prime Profile */}
            <button 
              onClick={() => handleSample('good')}
              className="group flex items-center p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 bg-white/[0.02] hover:bg-emerald-500/[0.08] transition-all text-left relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white text-lg font-bold">Prime Worker</h4>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest italic">Optimal</span>
                </div>
                <p className="text-slate-500 text-xs">Consistent income flow, ultra-disciplined repayment rhythm</p>
              </div>
            </button>

            {/* Borderline Profile */}
            <button 
              onClick={() => handleSample('medium')}
              className="group flex items-center p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 bg-white/[0.02] hover:bg-blue-500/[0.08] transition-all text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-lg font-bold mb-1">Struggling Gig Worker</h4>
                <p className="text-slate-500 text-xs">Highly volatile income, multiple micro-loan overlaps</p>
              </div>
            </button>

            {/* Ravi Profile (Edge Case) - Highlighted */}
            <button 
              onClick={() => handleSample('edge')}
              className="group flex flex-col p-6 rounded-[2rem] border-2 border-emerald-500/40 bg-emerald-500/10 transition-all text-left relative overflow-hidden shadow-[0_20px_40px_rgba(16,185,129,0.15)] active:scale-[0.98]"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-6 group-hover:rotate-6 transition-transform text-white font-extrabold text-2xl shadow-xl shadow-emerald-500/30">
                  R
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-xl font-extrabold tracking-tight">Ravi Kumar</h4>
                    <span className="text-[9px] font-bold bg-white text-emerald-600 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">
                      Edge Case Test
                    </span>
                  </div>
                  <p className="text-emerald-400/80 text-xs font-bold mt-1 uppercase tracking-widest">Seasonal Agricultural • Maharashtra</p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap mt-2">
                {["2 bounces (Recovered)", "Seasonal Gaps", "Mehnat Adjusted"].map((s, i) => (
                  <span key={i} className="text-[10px] font-bold text-white bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">{s}</span>
                ))}
              </div>

              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                 <ShieldAlert className="w-12 h-12 text-white" />
              </div>
            </button>

            {/* Priya Profile (Multi-Account Worker) */}
            <button 
              onClick={() => handleSample('edge')}
              className="group flex flex-col p-6 rounded-[2rem] border-2 border-violet-500/40 bg-violet-500/10 transition-all text-left relative overflow-hidden shadow-[0_20px_40px_rgba(139,92,246,0.15)] active:scale-[0.98]"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mr-6 group-hover:rotate-6 transition-transform text-white font-extrabold text-2xl shadow-xl shadow-violet-500/30">
                  P
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-xl font-extrabold tracking-tight">Priya Sharma</h4>
                    <span className="text-[9px] font-bold bg-white text-violet-600 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">
                      Multi-Account Test
                    </span>
                  </div>
                  <p className="text-violet-400/80 text-xs font-bold mt-1 uppercase tracking-widest">Domestic Worker • Delhi NCR</p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap mt-2">
                {["4 microcredit overlaps", "Hidden Income Streams", "Behavioral Resilience"].map((s, i) => (
                  <span key={i} className="text-[10px] font-bold text-white bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30">{s}</span>
                ))}
              </div>

              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                 <ShieldAlert className="w-12 h-12 text-white" />
              </div>
            </button>

            {/* High Risk Profile */}
            <button 
              onClick={() => handleSample('poor')}
              className="group flex items-center p-6 rounded-3xl border border-white/5 hover:border-red-500/30 bg-white/[0.02] hover:bg-red-500/[0.08] transition-all text-left opacity-60 hover:opacity-100"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-7 h-7 text-red-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-lg font-bold mb-1 text-slate-200">System Rejection Demo</h4>
                <p className="text-slate-500 text-xs text-slate-500">Chronic defaults, over-leveraged behavioral patterns</p>
              </div>
            </button>

          </div>

          {/* Loader Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                 <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-white font-bold text-sm tracking-widest uppercase">Launching Agents...</p>
            </div>
          )}
        </GlassCard>
      </div>

      <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        Pipeline v4.0 • Autonomous Underwriting Secured
      </p>
    </div>
  );
};

export default Upload;
