import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowUpRight, Zap, Shield } from "lucide-react";

/** BharosaCredit Refined Landing Page (adapted from moneyflow) */

interface StatProps {
  label: string;
  value: string;
}

const Stat: React.FC<StatProps> = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
    <div className="text-sm text-slate-400 font-medium">{label}</div>
  </div>
);

interface SoftButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const SoftButton: React.FC<SoftButtonProps> = ({ children, className = "", ...props }) => (
  <button
    className={
      "rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 " +
      "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-400 " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

function MiniBars() {
  return (
    <div className="mt-6 flex h-36 items-end gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 relative overflow-hidden">
      {[18, 48, 72, 96].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0.6 }}
          animate={{ height: h }}
          transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
          className="w-10 rounded-xl bg-gradient-to-t from-emerald-600/40 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)] ring-1 ring-white/10"
        />
      ))}
    </div>
  );
}

function Planet() {
  return (
    <motion.svg
      initial={{ rotate: -8 }}
      animate={{ rotate: 0 }}
      transition={{ duration: 2, type: "spring" }}
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="56" fill="url(#grad)" opacity="0.9" />
      <circle cx="94" cy="98" r="10" fill="white" opacity="0.45" />
      <circle cx="132" cy="126" r="8" fill="white" opacity="0.35" />
      <motion.ellipse
        cx="110" cy="110" rx="100" ry="34" stroke="white" strokeOpacity="0.6" fill="none"
        animate={{ strokeDashoffset: [200, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} strokeDasharray="200 200"
      />
      <motion.circle cx="210" cy="110" r="4" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.2, repeat: Infinity }} />
    </motion.svg>
  );
}

interface BharosaLandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onSampleData: () => void;
  onSolutions?: () => void;
  onTrustEngine?: () => void;
  onCompliance?: () => void;
  onInsights?: () => void;
}

export default function BharosaLandingPage({
  onStart,
  onLogin,
  onSampleData,
  onSolutions,
  onTrustEngine,
  onCompliance,
  onInsights,
}: BharosaLandingPageProps) {
  return (
    <div className="min-h-screen w-full bg-[#020408] text-white font-jakarta">
      {/* Fonts - already loaded in index.css but keeping local for consistency if needed */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        :root { --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif; }
        .font-jakarta { font-family: var(--font-sans); }
      `}</style>

      {/* Top nav */}
      <nav className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
             <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-white">bharosa<span className="text-emerald-500">credit</span></span>
            <span className="block text-[10px] uppercase tracking-widest text-[#10B981] font-bold -mt-1 opacity-70 leading-none">Autonomous AI</span>
          </div>
        </div>
        
        <div className="hidden items-center gap-10 md:flex">
          <button
            onClick={onSolutions}
            className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Solutions
          </button>
          <button
            onClick={onTrustEngine}
            className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Trust Engine
          </button>
          <button
            onClick={onCompliance}
            className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Compliance Analytics
          </button>
          <button
            onClick={onInsights}
            className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Stock Data
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <button 
            onClick={onLogin}
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Login
          </button>
          <button
            onClick={onSampleData}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-all"
          >
            View Sample Data
          </button>
          <SoftButton onClick={onStart}>Get Started</SoftButton>
        </div>
      </nav>

      {/* Hero area */}
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-12 px-6 pb-20 pt-10 md:grid-cols-2">
        {/* Left: headline */}
        <div className="flex flex-col justify-center space-y-10">
          <div className="space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
               <Zap className="w-3.5 h-3.5" /> 7-Agent Autonomous Pipeline
             </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight text-white">
              Mehnat to Credit
              <br />
              <span className="text-emerald-500 underline decoration-emerald-800 underline-offset-8">with precision.</span>
            </h1>
            <p className="max-w-md text-slate-400 text-lg leading-relaxed">
              Built for <span className="font-semibold text-white">45Cr+ workers</span> who deserve credit but have no CIBIL score.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button 
                onClick={onStart}
                className="group relative flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              Get Started <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button
              onClick={onSampleData}
              className="group relative flex items-center gap-2 border-2 border-emerald-500/30 text-emerald-400 px-8 py-3 rounded-full font-bold text-lg hover:bg-emerald-500/10 transition-all"
            >
              View Sample <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-4 md:max-w-sm">
            <Stat label="Workers Impacted" value="45Cr+" />
            <Stat label="Trust Score" value="85%" />
          </div>

          <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-10">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Backed BY RBI GUIDELINES</span>
            <div className="flex items-center gap-8 text-slate-600 font-bold tracking-tighter text-xl">
               <span className="opacity-40 tracking-tighter">FINTECH</span>
               <span className="opacity-40 tracking-tighter">PS5</span>
               <span className="opacity-40 tracking-tighter">bharosa</span>
            </div>
          </div>
        </div>

        {/* Right: animated card grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Secure card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={onCompliance}
            className="relative col-span-1 overflow-hidden rounded-[2rem] bg-emerald-900 p-8 text-emerald-50 shadow-2xl ring-1 ring-white/10 cursor-pointer hover:ring-emerald-500/50 transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0">
              <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="rg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="400" height="400" fill="url(#rg)" />
                {[...Array(12)].map((_, i) => (
                  <circle key={i} cx="200" cy="200" r={20 + i * 14} fill="none" stroke="currentColor" strokeOpacity="0.1" />
                ))}
              </svg>
            </div>

            <div className="relative flex h-full flex-col justify-between min-h-[220px]">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-700/60 p-2.5 ring-1 ring-white/20">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">Guardrail Engine</span>
              </div>
              <div>
                 <div className="text-2xl font-bold leading-tight mb-2">
                    Regulatory Compliance
                    <br />
                    Analytics 
                 </div>
                 <p className="text-emerald-200/60 text-xs font-medium mb-3">Real-time audit monitoring & risk assessment</p>
                 <div className="flex items-center gap-2 text-emerald-300/80 text-xs font-semibold">
                    <ArrowUpRight className="w-3 h-3" /> Click to explore
                 </div>
              </div>
              <motion.div
                className="absolute -right-2 top-0 h-16 w-16 rounded-full bg-emerald-500/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Currencies card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onInsights}
            className="relative col-span-1 overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-500 to-emerald-600 p-8 text-white shadow-2xl shadow-emerald-900/40 ring-1 ring-white/20 cursor-pointer hover:ring-teal-500/50 transition-all hover:scale-105 active:scale-95"
          >
            <div className="pointer-events-none absolute -right-4 -top-8 opacity-60">
              <Planet />
            </div>
            <div className="relative flex flex-col justify-end h-full min-h-[220px]">
                <div className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest">Global Reach</div>
                <div className="text-2xl font-bold leading-tight mb-2">
                UPI Transaction
                <br />
                Analytics 
                </div>
                <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
                    <ArrowUpRight className="w-3 h-3" /> Click to explore
                </div>
            </div>
          </motion.div>

          {/* Growth card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1 rounded-[2rem] bg-white/5 p-8 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
          >
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Bharosa Score Growth</div>
            <div className="mt-2 text-4xl font-bold tracking-tight text-emerald-400 leading-none">76 / 100</div>
            <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center gap-1.5">
               <TrendingUpIcon className="w-3.5 h-3.5" /> ↑ 12% Month-over-Month
            </div>
            <MiniBars />
          </motion.div>

          <div className="hidden md:flex items-center justify-center">
             <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center animate-bounce shadow-xl">
                <ArrowUpRight className="w-6 h-6 text-slate-500" />
             </div>
          </div>
        </div>
      </div>

      <footer className="mx-auto w-full max-w-[1180px] px-6 pb-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-600 border-t border-white/5 pt-12">
        © {new Date().getFullYear()} bharosa.credit • PS5 FinTech Innovation
      </footer>
    </div>
  );
}

interface IconProps {
  className?: string;
}

function TrendingUpIcon({ className }: IconProps) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    )
}
