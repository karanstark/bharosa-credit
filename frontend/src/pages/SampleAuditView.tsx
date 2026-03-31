import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import GlassCard from "../components/GlassCard";

interface AuditViewProps {
  profileId: string;
  profileName: string;
  onBack: () => void;
}

const agentSteps = [
  {
    id: 1,
    name: "Data Agent",
    status: "SUCCESS",
    output: "Extracted bank transactions, 24-month history validated",
    time: "234ms",
  },
  {
    id: 2,
    name: "Feature Agent",
    status: "SUCCESS",
    output: "Engineered 47 behavioral features from transaction graph",
    time: "156ms",
  },
  {
    id: 3,
    name: "Scoring Agent",
    status: "SUCCESS",
    output: "Bharosa Score: 62/100 (MEDIUM RISK)",
    time: "89ms",
  },
  {
    id: 4,
    name: "Compliance Agent",
    status: "SUCCESS",
    output: "RBI guidelines validated ✓ KYC requirements met ✓",
    time: "102ms",
  },
  {
    id: 5,
    name: "Decision Agent",
    status: "SUCCESS",
    output: "APPROVED: ₹20,000-₹50,000 | 14% Interest Rate",
    time: "198ms",
  },
  {
    id: 6,
    name: "Explanation Agent",
    status: "SUCCESS",
    output: "Generated multi-language explanations + audit trail",
    time: "167ms",
  },
  {
    id: 7,
    name: "Report Agent",
    status: "SUCCESS",
    output: "Compiled final report with edge case analysis",
    time: "145ms",
  },
];

export const SampleAuditView: React.FC<AuditViewProps> = ({
  profileId,
  profileName,
  onBack,
}) => {
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#020408] text-white font-jakarta flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Generating Audit Report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#020408] text-white font-jakarta p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Header */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>

        {/* Title */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            <Zap className="w-3 h-3" />
            7-Agent Pipeline Audit
          </div>
          <h1 className="text-4xl font-bold text-white">
            {profileName} - Complete Decision Trail
          </h1>
          <p className="text-slate-400">
            Real-time execution of autonomous credit underwriting pipeline
          </p>
        </div>

        {/* Pipeline Summary */}
        <GlassCard className="p-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Agents</p>
              <p className="text-3xl font-bold text-white">7</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Time</p>
              <p className="text-3xl font-bold text-cyan-400">1,091ms</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-emerald-400">100%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Compliance</p>
              <p className="text-3xl font-bold text-emerald-400">✓</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Status</p>
              <p className="text-lg font-bold text-green-400">APPROVED</p>
            </div>
          </div>
        </GlassCard>

        {/* Agent Pipeline Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">Agent Execution Timeline</h2>

          {agentSteps.map((step, index) => (
            <motion.button
              key={step.id}
              onClick={() => setExpandedAgent(expandedAgent === step.id ? null : step.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-full text-left"
            >
              <GlassCard
                className={`p-6 border-l-4 transition-all cursor-pointer hover:bg-white/[0.05] ${
                  step.status === "SUCCESS"
                    ? "border-l-emerald-500 bg-emerald-500/5"
                    : "border-l-red-500 bg-red-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {step.status === "SUCCESS" ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {index + 1}. {step.name}
                      </h3>
                      <p className="text-sm text-slate-400">{step.output}</p>

                      {expandedAgent === step.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-slate-700 space-y-3"
                        >
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                              Detailed Agent Output
                            </p>
                            <pre className="text-xs bg-black/40 p-3 rounded border border-slate-700 overflow-x-auto text-slate-300">
                              {`{
  "agent": "${step.name}",
  "status": "${step.status}",
  "output": "${step.output}",
  "execution_time_ms": ${parseInt(step.time)},
  "confidence_score": 0.94,
  "fallback_triggered": false
}`}
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-500 font-mono">{step.time}</p>
                    <p className="text-xs font-bold text-emerald-400 mt-1">{step.status}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.button>
          ))}
        </div>

        {/* Decision Rationale */}
        <GlassCard className="p-8 bg-blue-500/5 border-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Decision Rationale</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-slate-700 bg-white/5">
              <h3 className="font-bold text-white mb-2">✓ Positive Signals</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Consistent income pattern detected over 24 months</li>
                <li>• Recovery from previous defaults demonstrated</li>
                <li>• Payment discipline score: 76/100 (Above average)</li>
                <li>• No overlapping high-risk loans detected</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-slate-700 bg-white/5">
              <h3 className="font-bold text-white mb-2">⚠ Risk Factors</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Seasonal income volatility: 35% variation</li>
                <li>• 2 historical bounces (recovered)</li>
                <li>• Income below median worker baseline</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-emerald-700 bg-emerald-500/10">
              <h3 className="font-bold text-emerald-300 mb-2">🎯 Final Decision</h3>
              <p className="text-sm text-emerald-100">
                APPROVED for ₹20,000-₹50,000 at 14% interest rate. Recommended
                repayment: 6-month tenure with flexibility for seasonal gaps.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Compliance Checklist */}
        <GlassCard className="p-8 bg-emerald-500/5 border-emerald-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Regulatory Compliance</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "RBI Guidelines", status: "PASS" },
              { label: "KYC Verification", status: "PASS" },
              { label: "Anti-Money Laundering", status: "PASS" },
              { label: "Data Privacy (GDPR)", status: "PASS" },
              { label: "Credit Information Bureau", status: "PASS" },
              { label: "Fair Lending Practices", status: "PASS" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-white/5">
                <span className="text-sm text-slate-300">{item.label}</span>
                <span className="text-xs font-bold text-emerald-400">✓ {item.status}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center space-y-4 py-8">
          <p className="text-slate-500 text-sm">
            Pipeline v4.0 • Autonomous Underwriting Secured
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
          >
            Back to Profile Selection
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SampleAuditView;
