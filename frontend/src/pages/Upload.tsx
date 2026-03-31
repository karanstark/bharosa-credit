import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  User,
  Briefcase,
  Wallet,
  Trophy
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useBharosaStore } from '../store/bharosaStore';

interface UploadProps {
  onBack: () => void;
  onComplete: () => void;
}

const Upload: React.FC<UploadProps> = ({ onBack, onComplete }) => {
  const { analyzeCustom, isLoading, user } = useBharosaStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: 'Business Expansion',
    current_cibil: 750,
    loan_amount: 500000,
    monthly_income: 45000,
    profession: 'Salaried',
    full_name: user?.name || 'User'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyzeCustom(formData);
    onComplete();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 font-jakarta">
      
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Return to Dashboard</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
           Strategic Orchestration
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">
          Audit Your <span className="text-emerald-500">Financial Future</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Discard generic profiles. Input your real-world metrics to launch the 7-agent pipeline for a personalized prosperity roadmap.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full relative">
        <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-3xl -z-10"></div>

        <GlassCard className="bg-[#0d0d12] border-white/5 relative overflow-hidden p-10 rounded-[2.5rem]">
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Target className="w-3 h-3 text-emerald-500" />
                      What is your primary financial goal?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Business Expansion', 'Home Purchase', 'Education', 'Personal Growth'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({...formData, goal: g})}
                          className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                            formData.goal === g 
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                            : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase className="w-3 h-3 text-emerald-500" />
                      Current Profession
                    </label>
                    <select 
                      value={formData.profession}
                      onChange={(e) => setFormData({...formData, profession: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-emerald-500/50 transition-all appearance-none"
                    >
                      <option className="bg-[#0d0d12]">Salaried Professional</option>
                      <option className="bg-[#0d0d12]">Self-Employed / Business</option>
                      <option className="bg-[#0d0d12]">Gig Worker / Freelancer</option>
                      <option className="bg-[#0d0d12]">Farmer / Agricultural</option>
                    </select>
                  </div>

                  <button 
                    type="button"
                    onClick={nextStep}
                    className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-white text-black font-extrabold hover:bg-emerald-500 hover:text-white transition-all group"
                  >
                    Next Logic Step
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-emerald-500" />
                        Estimated CIBIL
                      </label>
                      <input 
                        type="number"
                        value={formData.current_cibil}
                        onChange={(e) => setFormData({...formData, current_cibil: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-emerald-500/50"
                        placeholder="300-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Wallet className="w-3 h-3 text-emerald-500" />
                        Monthly Income (₹)
                      </label>
                      <input 
                        type="number"
                        value={formData.monthly_income}
                        onChange={(e) => setFormData({...formData, monthly_income: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. 45000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      Financial Ambition (Loan Amt ₹)
                    </label>
                    <input 
                      type="number"
                      value={formData.loan_amount}
                      onChange={(e) => setFormData({...formData, loan_amount: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-emerald-500/50"
                      placeholder="e.g. 500000"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="flex-1 p-5 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="flex-[2] flex items-center justify-center gap-3 p-5 rounded-2xl bg-emerald-500 text-white font-extrabold hover:bg-emerald-400 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] group disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Orchestrate My Future
                          <Zap className="w-4 h-4 fill-white" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        </GlassCard>
      </div>

      <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
        Orchestration Engine v4.0 • Zero Legacy Demo Detected
      </p>
    </div>
  );
};

export default Upload;
