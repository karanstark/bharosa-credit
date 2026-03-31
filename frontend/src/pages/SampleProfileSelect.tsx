import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Shield, TrendingUp } from "lucide-react";
import GlassCard from "../components/GlassCard";

interface SampleProfileSelectProps {
  onBack: () => void;
  onSelectProfile: (profileId: string, profileName: string) => void;
}

const profiles = [
  {
    id: "ravi",
    name: "Ravi Kumar",
    title: "Seasonal Agricultural Worker",
    location: "Maharashtra",
    avatar: "R",
    color: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/10",
    highlights: ["2 bounces (Recovered)", "Seasonal Gaps", "Mehnat Adjusted"],
  },
  {
    id: "priya",
    name: "Priya Sharma",
    title: "Domestic Worker",
    location: "Delhi NCR",
    avatar: "P",
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/40",
    bgColor: "bg-violet-500/10",
    highlights: ["4 microcredit overlaps", "Hidden Income Streams", "Behavioral Resilience"],
  },
];

export const SampleProfileSelect: React.FC<SampleProfileSelectProps> = ({
  onBack,
  onSelectProfile,
}) => {
  const [selectedProfile, setSelectedProfile] = React.useState<string | null>(null);
  const [showViewOptions, setShowViewOptions] = React.useState(false);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
    setShowViewOptions(true);
  };

  const handleViewSelect = (viewType: "worker" | "audit") => {
    const profile = profiles.find((p) => p.id === selectedProfile);
    if (profile) {
      onSelectProfile(`${selectedProfile}-${viewType}`, profile.name);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020408] text-white font-jakarta p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-12"
      >
        {/* Header */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <Shield className="w-3 h-3" />
            Sample Worker Profiles
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">
            Test the 7-Agent <br />
            <span className="text-emerald-500">Autonomous Pipeline</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose a profile and explore it from either a worker perspective or an audit perspective
          </p>
        </div>

        {!showViewOptions ? (
          // Profile Selection
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {profiles.map((profile) => (
              <motion.button
                key={profile.id}
                onClick={() => handleProfileSelect(profile.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex flex-col p-8 rounded-[2rem] border-2 ${profile.borderColor} ${profile.bgColor} transition-all text-left relative overflow-hidden shadow-[0_20px_40px_rgba(139,92,246,0.15)]`}
              >
                <div className="flex items-start mb-6">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${profile.color} flex items-center justify-center mr-6 group-hover:rotate-6 transition-transform text-white font-extrabold text-3xl shadow-xl`}
                  >
                    {profile.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-extrabold text-white mb-1">
                      {profile.name}
                    </h3>
                    <p className="text-sm font-semibold text-slate-400 mb-1">
                      {profile.title}
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">
                      {profile.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/20"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-sm group-hover:gap-3 transition-all">
                  Select Profile <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          // View Options
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {profiles.find((p) => p.id === selectedProfile)?.name}
              </h2>
              <p className="text-slate-400">Choose your viewing perspective</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Worker View */}
              <motion.button
                onClick={() => handleViewSelect("worker")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-8 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Worker View</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  See the credit score, digital profile, and AI inference in your language
                </p>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  View Dashboard <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>

              {/* Audit View */}
              <motion.button
                onClick={() => handleViewSelect("audit")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-8 rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Audit View</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Review the complete agent pipeline, decision rationale, and compliance checks
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  View Audit <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            </div>

            <button
              onClick={() => setShowViewOptions(false)}
              className="w-full py-3 text-slate-400 hover:text-white transition-colors text-sm font-semibold border border-slate-700 rounded-xl hover:bg-white/5"
            >
              Change Profile
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SampleProfileSelect;
