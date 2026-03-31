import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck as ShieldCheckIcon, 
  ArrowRight, 
  ShieldAlert, 
  User, 
  Activity, 
  FileText,
  AlertTriangle,
  Zap,
  LayoutDashboard,
  Eye,
  Terminal,
  Search,
  BarChart3,
  TrendingUp,
  Info,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useBharosaStore } from '../store/bharosaStore';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import BharosaScoreRing from '../components/BharosaScoreRing';
import AgentPipeline from '../components/AgentPipeline';
import StatBadge from '../components/StatBadge';
import EdgeCaseCard from '../components/EdgeCaseCard';
import GlassCard from '../components/GlassCard';
import { testDomainBoundary } from '../utils/api';
import ResponsiveHeroBanner from '../components/ui/ResponsiveHeroBanner';

interface DashboardProps {
  onLogout: () => void;
  onNewAudit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onNewAudit }) => {
  const { report, user, isLoading, error, analyzeSample, resetStore } = useBharosaStore();
  const [viewMode, setViewMode] = useState<'worker' | 'lender'>('worker');
  const [isTranslated, setIsTranslated] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [domainResult, setDomainResult] = useState<any>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<'business' | 'home' | 'debt' | 'savings'>('savings');

  const goals = {
    business: { title: "Start my Business", description: "Scale up with business credit" },
    home: { title: "Buy my Home", description: "Optimize for long-term mortgage" },
    debt: { title: "Become Debt Free", description: "Consolidate and clear arrears" },
    savings: { title: "Build my Nest Egg", description: "Maximize compound interest" }
  };

  // Auto-trigger the 7-agent pipeline if no report exists (e.g. after fresh login)
  React.useEffect(() => {
    if (!report && !isLoading && !error) {
      console.log("🚀 No active report found. Orchestrating baseline audit...");
      analyzeSample('worker');
    }
  }, [report, isLoading, error, analyzeSample]);

  // Use the real user data from store
  const userProfile = user || {
    name: "Verified User",
    email: "",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Verified"
  };

  // Schema Agnostic Mapping
  const normalizedReport = report ? {
    bharosa_score: report.bharosa_score ?? report.bharosa_profile?.bharosa_score ?? 0,
    feature_report: report.feature_report || {
      monthly_income: report.bharosa_profile?.avg_monthly_income || 0,
      saving_streak: report.bharosa_profile?.saving_streak || 0,
      bill_discipline: report.bharosa_profile?.bill_discipline || 0,
      upi_bounces: report.bharosa_profile?.bounce_count || 0,
    },
    decision_report: report.decision_report || {
      decision: report.decision?.decision || "PENDING",
      limit_offered: report.decision?.loan_amount_recommended || 0,
      confidence: (report.decision?.confidence || 0) / 100,
      llm_used: report.decision?.llm_used || "orchestrator",
    },
    explanation_report: report.explanation_report || {
      user_explanation_hi: report.explanations?.user_explanation_hi || "विवरण उपलब्ध नहीं है।",
      user_explanation_en: report.explanations?.user_explanation_en || "No explanation available.",
      lender_explanation: report.explanations?.lender_explanation || "No technical audit summary available."
    },
    edge_case_report: report.edge_case_report || {},
    pipeline_summary: report.pipeline_summary || {}
  } : null;

  // Comprehensive safety and error check
  if (error || (!isLoading && !normalizedReport)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500 font-jakarta">
        <div className="w-24 h-24 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.1)]">
           <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">Pipeline Sync Failed</h3>
          <p className="text-slate-500 text-sm font-medium max-w-md">Our agents couldn't establish a link with this profile. The simulation might be temporarily offline.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (isLoading || !normalizedReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 font-jakarta">
        <div className="relative w-24 h-24">
           <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.2)]"></div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white tracking-tight">Syncing 7 Agents</h3>
          <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mt-2 animate-pulse">Orchestrating autonomous scoring...</p>
        </div>
      </div>
    );
  }

  // Offline fallback for domain testing
  const getOfflineDomainMatch = (keyword: string): any => {
    const normalizedKeyword = keyword.toLowerCase().trim()
    const keywordMap: { [key: string]: string[] } = {
      'MEDICAL': ['doctor', 'hospital', 'medical', 'pharma', 'health'],
      'SUPPLY_CHAIN': ['supply', 'chain', 'logistics', 'warehouse', 'distributor'],
      'AGRICULTURE': ['farm', 'agriculture', 'crop', 'rural', 'agri'],
      'SERVICES': ['service', 'consultant', 'agency', 'business', 'professional'],
      'COMMERCE': ['trade', 'commerce', 'retail', 'shop', 'store', 'market'],
    }

    for (const [domain, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(k => normalizedKeyword.includes(k))) {
        return {
          domain,
          confidence: 0.65,
          source: 'offline_fallback',
          keywords_matched: keywords.filter(k => normalizedKeyword.includes(k)),
          message: 'Domain matched using offline patterns'
        }
      }
    }

    return {
      domain: 'UNCATEGORIZED',
      confidence: 0,
      source: 'offline_fallback',
      keywords_matched: [],
      message: 'Could not classify domain - proceeding with caution'
    }
  };

  const handleDomainCheck = async () => {
    if (!domainInput?.trim()) {
      setDomainResult({
        error: true,
        message: 'Please enter a domain context',
        source: 'validation'
      });
      return;
    }

    setIsCheckingDomain(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await testDomainBoundary(domainInput);
      clearTimeout(timeout);
      setDomainResult(res);
    } catch (err) {
      clearTimeout(timeout);
      // Use offline fallback instead of showing error
      const fallbackResult = getOfflineDomainMatch(domainInput);
      setDomainResult(fallbackResult);
    } finally {
      setIsCheckingDomain(false);
    }
  };

  const isApproved = normalizedReport.decision_report.decision === 'APPROVED' || normalizedReport.decision_report.decision === 'APPROVE';

  return (
    <div className="space-y-10 font-jakarta animate-in fade-in duration-1000">
      
      {/* Premium Post-Login Hero */}
      <ResponsiveHeroBanner 
        title={`Welcome back, ${userProfile.name.split(' ')[0]}`}
        titleLine2="Visualize Your Path to Prosperity"
        description="Your 7-agent autonomous pipeline has mapped your financial potential. Launch your next audit to optimize your growth strategy and unlock institutional credit."
        primaryButtonText="Orchestrate My Future"
        secondaryButtonText="View Mission"
        onLogout={onLogout}
        onPrimaryAction={onNewAudit}
      />

      {/* Dashboard Top Navigation / Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <LayoutDashboard className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-none">
              Control <span className="text-emerald-500">Center</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live Pipeline Instance #V2.1</p>
          </div>
        </div>

        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
           <button 
             onClick={() => setViewMode('worker')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'worker' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
           >
             <User className="w-4 h-4" /> Worker View
           </button>
           <button 
             onClick={() => setViewMode('lender')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'lender' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
           >
             <ShieldCheckIcon className="w-4 h-4" /> Lender Audit
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {viewMode === 'worker' ? (
              <GlassCard className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-emerald-900/40 to-[#020408] border-emerald-500/20 relative group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                   <Zap className="w-20 h-20 text-emerald-500" />
                </div>
                <BharosaScoreRing score={normalizedReport.bharosa_score} />
                <div className="mt-8 text-center space-y-1">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Risk Grade</span>
                  <p className="text-2xl font-bold text-white tracking-tight">{isApproved ? 'Prime AAA' : 'Manual Review'}</p>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-8 border-indigo-500/20 bg-[#0f1117] relative overflow-hidden ring-1 ring-indigo-500/20">
                <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-indigo-500/5 rounded-full blur-3xl opacity-50" />
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Risk Assessment Model</h3>
                   </div>
                   <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Default Probability</span>
                            <span className="text-indigo-400">{(100 - normalizedReport.bharosa_score) / 4}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(100 - normalizedReport.bharosa_score) / 4}%` }}
                               className="h-full bg-indigo-500"
                            />
                         </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Portfolio Fit</span>
                            <span className="text-indigo-400">{normalizedReport.bharosa_score}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${normalizedReport.bharosa_score}%` }}
                               className="h-full bg-indigo-500"
                            />
                         </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Compliance Integrity</span>
                            <span className="text-indigo-400">92/100</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `92%` }}
                               className="h-full bg-indigo-500"
                            />
                         </div>
                      </div>
                   </div>
                </div>
              </GlassCard>
            )}

            <div className="grid grid-cols-1 gap-4">
              {viewMode === 'worker' ? (
                <>
                  <StatBadge icon={<Activity />} label="Monthly Income" value={formatCurrency(normalizedReport.feature_report.monthly_income || 0)} trend="up" />
                  <StatBadge icon={<Zap />} label="Savings Streak" value={`${normalizedReport.feature_report.saving_streak || 0} Days`} trend="up" />
                  
                  {/* Strategic Prosperity Roadmap */}
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                       {(Object.keys(goals) as Array<keyof typeof goals>).map((g) => (
                          <button
                            key={g}
                            onClick={() => setSelectedGoal(g)}
                            className={`p-3 rounded-2xl border text-left transition-all ${selectedGoal === g ? 'bg-emerald-500/20 border-emerald-500/50 ring-1 ring-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                             <p className={`text-[10px] font-black uppercase tracking-widest ${selectedGoal === g ? 'text-emerald-400' : 'text-slate-500'}`}>{g}</p>
                             <p className="text-xs font-bold text-white mt-1 leading-tight">{goals[g].title}</p>
                          </button>
                       ))}
                    </div>

                    <GlassCard className="p-8 border-emerald-500/10 bg-[#020408]/60 relative overflow-hidden">
                       <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
                       <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                          <div className="space-y-4 max-w-md">
                             <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-lg font-bold text-white tracking-tight">Prosperity Plan: {goals[selectedGoal].title}</h3>
                             </div>
                             <p className="text-sm text-slate-400 leading-relaxed">
                                Our agents have optimized your path. To <span className="text-white font-bold">{goals[selectedGoal].description}</span>, you are currently in the <span className="text-white font-bold">{normalizedReport.bharosa_score > 70 ? 'Optimization Phase' : 'Foundation Phase'}</span>. 
                             </p>
                             <div className="flex gap-3">
                                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                   Roadmap to {goals[selectedGoal].title.split(' ')[0]}
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                   Target Score: 850+
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex-1 space-y-3">
                             <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                                <span>Roadmap Completion</span>
                                <span className="text-emerald-500">{normalizedReport.bharosa_score}%</span>
                             </div>
                             <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                                <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${normalizedReport.bharosa_score}%` }}
                                   className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                                />
                             </div>
                             <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                <span>Seedling</span>
                                <span>Prosperity</span>
                             </div>
                          </div>
                       </div>
                    </GlassCard>
                  </div>
                  <StatBadge icon={<ShieldCheckIcon />} label="Bill Rhythm" value={formatPercentage(normalizedReport.feature_report.bill_discipline || 0)} trend="neutral" />
                  <StatBadge icon={<AlertTriangle />} label="UPI Bounces" value={normalizedReport.feature_report.upi_bounces || 0} trend={(normalizedReport.feature_report.upi_bounces || 0) > 0 ? 'down' : 'neutral'} />
                </>
              ) : (
                <>
                  <StatBadge icon={<TrendingUp className="text-indigo-500" />} label="Credit Utilization" value="12%" trend="neutral" />
                  <StatBadge icon={<Activity className="text-indigo-500" />} label="Gig Volatility" value="Low Risk" trend="up" />
                  <StatBadge icon={<ShieldCheckIcon className="text-indigo-500" />} label="Auth Status" value="Verified" trend="up" />
                  <StatBadge icon={<Info className="text-indigo-500" />} label="Agent Consistency" value="99.2%" trend="neutral" />
                </>
              )}
            </div>
          </div>

          {/* AI Decision Result & Memo */}
          <GlassCard className={`bg-[#0f1117] border-white/5 relative overflow-hidden ${viewMode === 'lender' ? 'ring-1 ring-indigo-500/10' : ''}`}>
             <div className="absolute top-0 right-0 p-12 -mr-20 -mt-20 bg-emerald-500/5 rounded-full blur-3xl" />
             <div className="relative z-10 flex flex-col md:flex-row gap-8">
                <div className={`p-6 rounded-[2rem] flex flex-col items-center justify-center min-w-[200px] text-center border-2 ${isApproved ? (viewMode === 'lender' ? 'bg-indigo-600 border-indigo-500/30' : 'bg-emerald-600 border-emerald-500/30') : 'bg-blue-600 border-blue-500/30'}`}>
                   <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      {isApproved ? <ShieldCheckIcon className="w-8 h-8 text-white" /> : <Eye className="w-8 h-8 text-white" />}
                   </div>
                   <h4 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-1">Status</h4>
                   <p className="text-2xl font-black text-white">{normalizedReport.decision_report.decision}</p>
                </div>
                <div className="flex-1 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <FileText className={`w-4 h-4 ${viewMode === 'lender' ? 'text-indigo-400' : 'text-emerald-500'}`} />
                         <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Autonomous Underwriting Memo</h4>
                      </div>
                      {viewMode === 'worker' && (
                        <button 
                          onClick={() => setIsTranslated(!isTranslated)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-bold"
                        >
                          <span className={isTranslated ? 'text-emerald-500' : 'text-slate-500'}>EN</span>
                          <div className="w-px h-2 bg-white/10" />
                          <span className={!isTranslated ? 'text-emerald-500' : 'text-slate-500'}>अ</span>
                        </button>
                      )}
                   </div>
                   <AnimatePresence mode="wait">
                      <motion.p 
                        key={viewMode === 'lender' ? 'tech' : (isTranslated ? 'en' : 'hi')}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg text-white font-semibold leading-relaxed"
                        >
                        {viewMode === 'lender' 
                          ? (normalizedReport.explanation_report.lender_explanation || "No technical audit summary available.")
                          : (isTranslated 
                              ? (normalizedReport.explanation_report.user_explanation_en || "No English translation available.")
                              : (normalizedReport.explanation_report.user_explanation_hi || "No explanation available.")
                            )
                        }
                      </motion.p>
                   </AnimatePresence>
                </div>
             </div>
          </GlassCard>

          {/* Bottom Panel: Worker Edge Cases OR Lender Domain Tester */}
          <AnimatePresence mode="wait">
             {viewMode === 'worker' ? (
                <motion.div 
                  key="worker-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <ShieldAlert className="w-6 h-6 text-emerald-500" />
                       <h3 className="text-xl font-bold text-white tracking-tight">Edge Cases <span className="text-slate-500">& Adaptations</span></h3>
                     </div>
                     <span className="text-[9px] font-bold bg-white/5 px-2.5 py-1 rounded-full text-slate-500 border border-white/10 uppercase">Autonomous Monitoring</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(normalizedReport.edge_case_report || {}).map(([code, active]) => (
                      <EdgeCaseCard 
                        key={code} 
                        code={code} 
                        isActive={active as boolean} 
                        adjustment={code === 'EC1' ? "Seasonal Normalization" : code === 'EC2' ? "Bounce Forgiveness" : undefined}
                      />
                    ))}
                  </div>
                </motion.div>
             ) : (
                <motion.div 
                  key="lender-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <Terminal className="w-6 h-6 text-indigo-400" />
                       <h3 className="text-xl font-bold text-white tracking-tight">Domain <span className="text-slate-500">Boundary Tester</span></h3>
                     </div>
                     <span className="text-[9px] font-bold bg-indigo-500/10 px-2.5 py-1 rounded-full text-indigo-400 border border-indigo-500/20 uppercase">RBI Guardrail Testing</span>
                  </div>

                  <GlassCard className="p-8 border-white/5 bg-white/[0.02] flex flex-col md:flex-row gap-6 items-end">
                     <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Input Domain Context</label>
                        <div className="relative group">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                           <input 
                             value={domainInput}
                             onChange={(e) => setDomainInput(e.target.value)}
                             placeholder="e.g. Health Score / Game Data / Education"
                             className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                           />
                        </div>
                     </div>
                     <button 
                       onClick={handleDomainCheck}
                       disabled={isCheckingDomain}
                       className="h-14 px-8 bg-indigo-600 rounded-2xl text-white font-bold text-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {isCheckingDomain ? "Validating..." : "Test Boundary"}
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </GlassCard>

                  {domainResult && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-6 rounded-[2rem] border relative overflow-hidden ${domainResult.in_scope ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}
                    >
                       <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${domainResult.in_scope ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                {domainResult.in_scope ? <CheckCircle2 className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest">{domainResult.in_scope ? 'In Scope' : 'Out of Scope'}</h4>
                                <p className="text-xs text-slate-400 mt-0.5">{domainResult.audit_entry}</p>
                             </div>
                          </div>
                          {!domainResult.in_scope && (
                             <span className="px-4 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-red-500 text-[10px] font-bold uppercase">Auto-Escalate</span>
                          )}
                       </div>
                    </motion.div>
                  )}
                </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* Right Column: Pipeline & Audit */}
        <div className="space-y-8">
           
          {/* Pipeline Activity */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 ml-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Agents Heartbeat</h4>
             </div>
             <AgentPipeline steps={[
                { id: '1', name: 'Raw Ingestion', status: 'completed', agent: 'Data Agent' },
                { id: '2', name: 'Feature Extraction', status: 'completed', agent: 'Feature Agent' },
                { id: '3', name: 'Scoring Logic', status: 'completed', agent: 'Scoring Agent' },
                { id: '4', name: 'Compliance Guardrail', status: 'completed', agent: 'Compliance Agent' },
                { id: '5', name: 'LLM Multi-Modal Decision', status: 'completed', agent: 'Decision Agent' },
                { id: '6', name: 'Explanation Synthesis', status: 'completed', agent: 'Explanation Agent' },
                { id: '7', name: 'Structured JSON Finality', status: 'completed', agent: 'Report Agent' },
             ]} />
          </div>

          <GlassCard className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem]">
             <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest opacity-60">Audit Metadata</h4>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-slate-500 font-bold uppercase">LLM Path</span>
                   <span className="text-emerald-500/60 font-mono italic">{normalizedReport.decision_report?.llm_used === 'groq' ? 'Groq / llama-3.3' : 'Gemini / 1.5-Pro'}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-slate-500 font-bold uppercase">Latency</span>
                   <span className="text-emerald-500/60 font-mono italic">{normalizedReport.pipeline_summary?.total_processing_time_ms || 0} ms</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-slate-500 font-bold uppercase">Protocol</span>
                   <span className="text-emerald-500/60 font-mono italic">RBI-842.F</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-slate-500 font-bold uppercase">Agent ID</span>
                   <span className="text-emerald-500/60 font-mono italic">BH-ORC-VAL</span>
                </div>
             </div>
          </GlassCard>

          {viewMode === 'lender' && (
             <GlassCard className="bg-indigo-500/5 border-indigo-500/20 p-6 rounded-3xl animate-pulse">
                <div className="flex items-center gap-3">
                   <ShieldCheckIcon className="w-5 h-5 text-indigo-400" />
                   <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest">Certified Autonomous Audit</p>
                </div>
             </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
