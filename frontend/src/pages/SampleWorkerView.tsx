import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, RefreshCw } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { useBharosaStore } from "../store/bharosaStore";

interface WorkerViewProps {
  profileId: string;
  profileName: string;
  onBack: () => void;
}

const profileData: {
  [key: string]: {
    name: string;
    score: number;
    hindiInference: string;
    englishInference: string;
    riskBand: string;
    recommendations: string[];
  };
} = {
  "ravi-worker": {
    name: "Ravi Kumar",
    score: 62,
    hindiInference:
      "राविकुमार एक मौसमी कृषि कार्यकर्ता हैं जिनकी आय पैटर्न मौसमी उतार-चढ़ाव दिखाता है। उन्होंने 2 बाउंस से उबरे हैं और अब एक सुसंगत भुगतान अनुशासन प्रदर्शित कर रहे हैं। उनका बहरोसा स्कोर उनकी वसूली क्षमता और आय लचीलापन को प्रतिबिंबित करता है।",
    englishInference:
      "Ravi Kumar is a seasonal agricultural worker whose income pattern shows seasonal fluctuations. He has recovered from 2 bounces and is now demonstrating consistent payment discipline. His Bharosa score reflects his recovery capability and income resilience.",
    riskBand: "MEDIUM",
    recommendations: [
      "Eligible for ₹20,000 - ₹50,000 credit",
      "Interest rate: 16-20%",
      "6-month repayment cycle recommended",
      "Consider seasonal income adjustments",
    ],
  },
  "priya-worker": {
    name: "Priya Sharma",
    score: 54,
    hindiInference:
      "प्रिया शर्मा एक गृह कार्यकर्ता हैं जिनकी आय कई सूक्ष्मऋणों में बिखरी हुई है। उनके पास छिपी हुई आय धाराएं हैं जिन्हें हमारे 7-एजेंट पाइपलाइन द्वारा पहचाना गया है। उनका व्यवहार संबंधी लचीलापन उनकी औपचारिक ऋण योग्यता की संभावना को दर्शाता है।",
    englishInference:
      "Priya Sharma is a domestic worker whose income is distributed across multiple microcredit sources. She has hidden income streams identified by our 7-Agent pipeline. Her behavioral resilience indicates potential for formal credit eligibility.",
    riskBand: "HIGH",
    recommendations: [
      "Eligible for ₹10,000 - ₹20,000 credit (conditional)",
      "Interest rate: 20-24%",
      "Enhanced income verification required",
      "Monthly micro-payments preferred",
    ],
  },
};

export const SampleWorkerView: React.FC<WorkerViewProps> = ({
  profileId,
  profileName,
  onBack,
}) => {
  const [showHindi, setShowHindi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const profile = profileData[profileId];
  const { isLoading: pipelineLoading } = useBharosaStore();

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#020408] text-white font-jakarta flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Generating Worker Report...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-[#020408] text-white font-jakarta p-6 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <p className="text-slate-400">Profile not found</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-all"
          >
            Go Back
          </button>
        </GlassCard>
      </div>
    );
  }

  const riskColors: { [key: string]: string } = {
    LOW: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
    MEDIUM: "bg-blue-500/20 border-blue-500/40 text-blue-300",
    HIGH: "bg-amber-500/20 border-amber-500/40 text-amber-300",
    BORDERLINE: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
  };

  return (
    <div className="min-h-screen w-full bg-[#020408] text-white font-jakarta p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>

          <button
            onClick={() => setShowHindi(!showHindi)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-600 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 transition-all"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold">{showHindi ? "हिंदी" : "English"}</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">{profile.name}</h1>
          <p className="text-slate-400">Worker Credit Profile</p>
        </div>

        {/* Bharosa Score Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-extrabold text-emerald-400">
                  {profile.score}
                </div>
                <div className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                  Score
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risk Band */}
        <div className="flex justify-center">
          <div className={`px-6 py-3 rounded-full border-2 font-bold ${riskColors[profile.riskBand]}`}>
            {profile.riskBand} RISK
          </div>
        </div>

        {/* Inference Section */}
        <GlassCard className="p-8 bg-slate-900/40 border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-lg">💡</span>
            </div>
            AI Agent Inference
          </h2>

          <div className="space-y-4">
            <div
              className={`p-6 rounded-2xl border border-slate-700 ${
                showHindi ? "text-slate-50" : "text-slate-300"
              } leading-relaxed font-medium`}
            >
              {showHindi ? profile.hindiInference : profile.englishInference}
            </div>

            <button
              onClick={() => setShowHindi(!showHindi)}
              className="mx-auto flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Switch to {showHindi ? "English" : "हिंदी"}
            </button>
          </div>
        </GlassCard>

        {/* Recommendations */}
        <GlassCard className="p-8 bg-slate-900/40 border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-lg">✅</span>
            </div>
            Credit Card Recommendations
          </h2>

          <div className="space-y-3">
            {profile.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
                <p className="text-slate-300">{rec}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Footer CTA */}
        <div className="text-center space-y-4 py-8">
          <p className="text-slate-500 text-sm">
            Generated by Bharosa 7-Agent Autonomous Pipeline
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
          >
            Explore Another Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SampleWorkerView;
