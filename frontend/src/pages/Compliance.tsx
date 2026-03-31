import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Clock, FileText, Shield, TrendingUp, Activity, Eye } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart } from 'recharts';

interface ComplianceCheck {
  id: string;
  name: string;
  framework: string;
  status: "compliant" | "warning" | "non-compliant";
  completedOn: string;
  details: string;
}

interface RegulatoryRequirement {
  id: string;
  regulation: string;
  requirement: string;
  status: "met" | "pending" | "review";
  lastChecked: string;
}

export const Compliance: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m');
  const [animatedScore, setAnimatedScore] = useState(0);

  // Mock compliance trend data
  const complianceTrend = [
    { month: 'Jan', score: 92, checks: 45, issues: 3 },
    { month: 'Feb', score: 94, checks: 48, issues: 2 },
    { month: 'Mar', score: 91, checks: 52, issues: 4 },
    { month: 'Apr', score: 96, checks: 46, issues: 1 },
    { month: 'May', score: 98, checks: 50, issues: 0 },
    { month: 'Jun', score: 98, checks: 48, issues: 0 },
  ];

  // Risk assessment data
  const riskData = [
    { category: 'Credit Risk', value: 85, fullMark: 100 },
    { category: 'Operational Risk', value: 92, fullMark: 100 },
    { category: 'Market Risk', value: 78, fullMark: 100 },
    { category: 'Compliance Risk', value: 98, fullMark: 100 },
    { category: 'Liquidity Risk', value: 88, fullMark: 100 },
  ];

  // Compliance distribution
  const complianceDistribution = [
    { name: 'Fully Compliant', value: 68, color: '#10b981' },
    { name: 'Minor Issues', value: 22, color: '#f59e0b' },
    { name: 'Under Review', value: 8, color: '#3b82f6' },
    { name: 'Non-Compliant', value: 2, color: '#ef4444' },
  ];

  // Audit frequency data
  const auditFrequency = [
    { type: 'Daily', count: 12, efficiency: 98 },
    { type: 'Weekly', count: 28, efficiency: 95 },
    { type: 'Monthly', count: 8, efficiency: 92 },
    { type: 'Quarterly', count: 4, efficiency: 88 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(98), 500);
    return () => clearTimeout(timer);
  }, []);

  const complianceChecks: ComplianceCheck[] = [
    {
      id: "1",
      name: "KYC Verification",
      framework: "RBI Guidelines",
      status: "compliant",
      completedOn: "22 Feb 2026",
      details:
        "All customer identification verified against government databases",
    },
    {
      id: "2",
      name: "AML Screening",
      framework: "FEMA Act",
      status: "compliant",
      completedOn: "22 Feb 2026",
      details: "Cross-checked against UNSC and OFAC watchlists",
    },
    {
      id: "3",
      name: "Credit Limit Review",
      framework: "RBI Master Circular",
      status: "warning",
      completedOn: "21 Feb 2026",
      details: "5% of accounts require limit review",
    },
    {
      id: "4",
      name: "Data Protection",
      framework: "DPDP Act 2023",
      status: "compliant",
      completedOn: "20 Feb 2026",
      details: "End-to-end encryption with AES-256 standard",
    },
  ];

  const regulatoryRequirements: RegulatoryRequirement[] = [
    {
      id: "1",
      regulation: "Risk-Based Pricing",
      requirement: "Ensure pricing reflects credit risk",
      status: "met",
      lastChecked: "22 Feb 2026",
    },
    {
      id: "2",
      regulation: "Fair Lending",
      requirement: "No discrimination based on protected attributes",
      status: "met",
      lastChecked: "22 Feb 2026",
    },
    {
      id: "3",
      regulation: "Grievance Redressal",
      requirement: "Process complaints within 30 days",
      status: "met",
      lastChecked: "21 Feb 2026",
    },
    {
      id: "4",
      regulation: "Audit Trail",
      requirement: "Maintain complete transaction logs",
      status: "review",
      lastChecked: "20 Feb 2026",
    },
  ];

  const [selectedCheck, setSelectedCheck] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
      case "met":
        return (
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        );
      case "warning":
        return (
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        );
      case "non-compliant":
        return (
          <AlertTriangle className="w-5 h-5 text-red-400" />
        );
      case "pending":
        return <Clock className="w-5 h-5 text-slate-400" />;
      case "review":
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "met":
        return "emerald";
      case "warning":
        return "yellow";
      case "non-compliant":
        return "red";
      case "pending":
      case "review":
        return "blue";
      default:
        return "slate";
    }
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-emerald-400" />
            <h1 className="text-5xl font-bold text-white">
              RBI Compliance Engine
            </h1>
          </div>
          <p className="text-slate-400 text-xl">
            Autonomous regulatory auditing with real-time guardrail monitoring
          </p>
        </div>

        {/* Compliance Summary with Animated Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="p-6 border-2 border-emerald-500/20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
              <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-3 relative z-10" />
              <motion.div 
                className="text-4xl font-bold text-white mb-2 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {animatedScore}%
              </motion.div>
              <p className="text-sm text-slate-400 relative z-10">Compliance Score</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="p-6 border-2 border-blue-500/20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
              <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-3 relative z-10" />
              <div className="text-3xl font-bold text-white mb-2 relative z-10">248</div>
              <p className="text-sm text-slate-400">Active Audits</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="p-6 border-2 border-yellow-500/20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent"></div>
              <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3 relative z-10" />
              <div className="text-3xl font-bold text-white mb-2 relative z-10">3</div>
              <p className="text-sm text-slate-400">Minor Issues</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassCard className="p-6 border-2 border-purple-500/20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-3 relative z-10" />
              <div className="text-3xl font-bold text-white mb-2 relative z-10">0</div>
              <p className="text-sm text-slate-400">Critical Breaches</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Compliance Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard className="p-8 border-2 border-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Compliance Trend Analysis</h2>
              <div className="flex gap-2">
                {['1m', '3m', '6m', '1y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                      selectedTimeRange === range
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={complianceTrend}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#scoreGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Compliance Checks */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Compliance Checks
          </h2>
          <div className="space-y-4">
            {complianceChecks.map((check, idx) => {
              const color = getStatusColor(check.status);
              return (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => setSelectedCheck(check.id)}
                  className="cursor-pointer"
                >
                  <GlassCard
                    className={`p-6 border-2 transition-all ${
                      selectedCheck === check.id
                        ? `border-${color}-500 bg-${color}-500/5`
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">
                          {getStatusIcon(check.status)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg mb-1">
                            {check.name}
                          </h3>
                          <p className="text-xs text-slate-400 mb-2">
                            {check.framework}
                          </p>
                          <p className="text-sm text-slate-300">
                            {check.details}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-${color}-500/20 text-${color}-400 mb-2`}
                        >
                          {check.status.toUpperCase()}
                        </span>
                        <p className="text-xs text-slate-400">
                          {check.completedOn}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Regulatory Requirements */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Regulatory Requirements
          </h2>
          <GlassCard className="p-8 border-2 border-emerald-500/20">
            <div className="space-y-4">
              {regulatoryRequirements.map((req, idx) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  <div>
                    <p className="font-semibold text-white">{req.regulation}</p>
                    <p className="text-sm text-slate-400">{req.requirement}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-2">
                      {getStatusIcon(req.status)}
                      <span className="text-xs font-bold capitalize text-slate-300">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{req.lastChecked}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Risk Assessment & Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Assessment Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GlassCard className="p-8 border-2 border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">Risk Assessment Matrix</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={riskData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                  <Radar
                    name="Risk Score"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Compliance Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <GlassCard className="p-8 border-2 border-blue-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">Compliance Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={complianceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {complianceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* Audit Frequency Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <GlassCard className="p-8 border-2 border-emerald-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Audit Frequency & Efficiency</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={auditFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="type" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Audit Count" />
                <Bar dataKey="efficiency" fill="#3b82f6" name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Documentation */}
        <GlassCard className="p-8 border-2 border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Documentation & Audit Trail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <p className="font-semibold text-white mb-2">Last Audit</p>
              <p className="text-slate-400 text-sm">
                Internal audit completed on <span className="text-emerald-400 font-semibold">20 Feb 2026</span>
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <p className="font-semibold text-white mb-2">Next Audit</p>
              <p className="text-slate-400 text-sm">
                Scheduled for <span className="text-blue-400 font-semibold">20 May 2026</span>
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <p className="font-semibold text-white mb-2">Records Retention</p>
              <p className="text-slate-400 text-sm">
                <span className="text-emerald-400 font-semibold">7 years</span> as per regulatory requirement
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
              <p className="font-semibold text-white mb-2">Certifications</p>
              <p className="text-slate-400 text-sm">
                ISO 27001, SOC2 Type II compliant
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Compliance;
