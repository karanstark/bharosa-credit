import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, TrendingUp, Shield } from "lucide-react";
import GlassCard from "../components/GlassCard";

interface CreditScore {
  name: string;
  score: number;
  range: string;
  status: "excellent" | "good" | "fair" | "poor";
  lastUpdated: string;
  sources: number;
}

interface VerificationStatus {
  type: string;
  status: "verified" | "pending" | "failed";
  completedAt: string;
  checkType: string;
}

export const TrustEngine: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const creditScores: CreditScore[] = [
    {
      name: "Aaron Maashoh",
      score: 742,
      range: "700-750",
      status: "good",
      lastUpdated: "22 Feb 2026",
      sources: 3,
    },
    {
      name: "Rick Rothackerj",
      score: 658,
      range: "650-700",
      status: "fair",
      lastUpdated: "21 Feb 2026",
      sources: 2,
    },
    {
      name: "Langep",
      score: 812,
      range: "800+",
      status: "excellent",
      lastUpdated: "20 Feb 2026",
      sources: 4,
    },
  ];

  const verifications: VerificationStatus[] = [
    {
      type: "PAN Verification",
      status: "verified",
      completedAt: "22 Feb 2026 10:30 AM",
      checkType: "Government Database Match",
    },
    {
      type: "Employment Verification",
      status: "verified",
      completedAt: "22 Feb 2026 09:15 AM",
      checkType: "Third-party Verification",
    },
    {
      type: "Bank Account Verification",
      status: "verified",
      completedAt: "22 Feb 2026 08:45 AM",
      checkType: "Bank APIs",
    },
    {
      type: "Address Verification",
      status: "pending",
      completedAt: "In Progress",
      checkType: "Document Verification",
    },
  ];

  const [selectedScore, setSelectedScore] = useState<number>(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "emerald";
      case "good":
        return "blue";
      case "fair":
        return "yellow";
      case "poor":
        return "red";
      default:
        return "slate";
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 800) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    return "Poor";
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white font-jakarta p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* Header */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
        >
          <span>← Back</span>
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">
            Trust Engine Assessment
          </h1>
          <p className="text-slate-400 text-xl">
            Real-time credit scoring and verification system
          </p>
        </div>

        {/* Credit Scores */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Credit Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creditScores.map((score, idx) => {
              const color = getStatusColor(score.status);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => setSelectedScore(idx)}
                  className="cursor-pointer"
                >
                  <GlassCard
                    className={`p-6 border-2 transition-all ${
                      selectedScore === idx
                        ? `border-${color}-500 bg-${color}-500/5`
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">
                        {score.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold bg-${color}-500/20 text-${color}-400`}
                      >
                        {getScoreBadge(score.score)}
                      </span>
                    </div>

                    <div className="mb-6">
                      <div className="text-5xl font-bold text-white mb-2">
                        {score.score}
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-2 rounded-full`}
                          style={{
                            width: `${(score.score / 900) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Range:</span>
                        <span className="text-white font-semibold">
                          {score.range}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sources:</span>
                        <span className="text-white font-semibold">
                          {score.sources} bureaus
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Updated:</span>
                        <span className="text-emerald-400 text-xs font-semibold">
                          {score.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Verification Status */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Verification Status
          </h2>
          <GlassCard className="p-8 border-2 border-emerald-500/20">
            <div className="space-y-4">
              {verifications.map((verification, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {verification.status === "verified" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {verification.type}
                      </p>
                      <p className="text-xs text-slate-400">
                        {verification.checkType}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        verification.status === "verified"
                          ? "text-emerald-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {verification.status === "verified"
                        ? "Verified"
                        : "Pending"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {verification.completedAt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Risk Assessment */}
        <GlassCard className="p-8 border-2 border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Risk Assessment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                2.3%
              </div>
              <p className="text-sm text-slate-400">Default Risk</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                18.5%
              </div>
              <p className="text-sm text-slate-400">Fraud Risk</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                91%
              </div>
              <p className="text-sm text-slate-400">Loan Approval Rate</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                LOW
              </div>
              <p className="text-sm text-slate-400">Overall Risk</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default TrustEngine;
