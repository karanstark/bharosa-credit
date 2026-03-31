import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Shield, ExternalLink, FileText, Info } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface RequirementFormProps {
  productName: string;
  onBack: () => void;
  onBankSelect: (bankUrl: string) => void;
}

const BANK_SUGGESTIONS: Record<string, { name: string; url: string; color: string; note: string }[]> = {
  "Personal Loan": [
    { name: "Canara Bank", url: "https://canarabank.com/personal-loan", color: "#a855f7", note: "Lowest processing fee" },
    { name: "State Bank of India", url: "https://sbi.co.in/web/personal-banking/loans/personal-loans", color: "#22c55e", note: "Instant in-principle approval" },
    { name: "Indian Overseas Bank", url: "https://www.iob.in/Personal-Loan", color: "#f97316", note: "Flexible tenure up to 84 months" },
    { name: "UCO Bank", url: "https://www.ucobank.com/english/personal-loan.aspx", color: "#eab308", note: "Simplified documentation" },
  ],
  "Auto Loan": [
    { name: "Canara Bank", url: "https://canarabank.com/vehicle-loan", color: "#a855f7", note: "Financing up to 90% of on-road price" },
    { name: "State Bank of India", url: "https://sbi.co.in/web/personal-banking/loans/auto-loans", color: "#22c55e", note: "Zero hidden charges" },
  ],
  "Home Equity Loan": [
    { name: "State Bank of India", url: "https://sbi.co.in/web/personal-banking/loans/home-loans", color: "#22c55e", note: "Lowest interest rates" },
    { name: "Central Bank of India", url: "https://www.centralbankofindia.co.in/en/personal-loan", color: "#3b82f6", note: "High loan-to-value ratio" },
  ],
  "Credit Builder Loan": [
    { name: "Punjab and Sind Bank", url: "https://punjabandsindbank.co.in/content/loans", color: "#ef4444", note: "Ideal for first-time borrowers" },
  ]
};

const ESSENTIAL_DOCUMENTS = [
  { id: "id-proof", label: "Government ID Proof (Aadhar / PAN / Voter ID)", description: "Mandatory for KYC verification" },
  { id: "address-proof", label: "Address Proof (Utility Bill / Rent Agreement)", description: "Needed to verify residency" },
  { id: "income-proof", label: "Income Proof (Latest 3 Salary Slips / ITR)", description: "To assess your repayment capacity" },
  { id: "statements", label: "Bank Statements (Last 6 Months)", description: "Essential for credit scoring" },
];

export const RequirementForm: React.FC<RequirementFormProps> = ({
  productName,
  onBack,
  onBankSelect,
}) => {
  const [step, setStep] = useState(1);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const handleToggleDoc = (id: string) => {
    setCheckedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allDocsChecked = ESSENTIAL_DOCUMENTS.every(doc => checkedDocs[doc.id]);
  const suggestions = BANK_SUGGESTIONS[productName] || BANK_SUGGESTIONS["Personal Loan"];

  return (
    <div className="min-h-screen bg-[#020408] text-white font-jakarta p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Solutions</span>
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">
            Applying for {productName}
          </h1>
          <p className="text-slate-400 text-lg">
            Complete the requirement checklist to see suitable banking partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Checklist */}
          <div className="md:col-span-2 space-y-6">
            <GlassCard className="p-8 border-2 border-emerald-500/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <FileText className="size-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">Document Checklist</h3>
              </div>

              <div className="space-y-6">
                {ESSENTIAL_DOCUMENTS.map((doc) => (
                  <div 
                    key={doc.id}
                    onClick={() => handleToggleDoc(doc.id)}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 cursor-pointer transition-all"
                  >
                    <Checkbox 
                      id={doc.id} 
                      checked={!!checkedDocs[doc.id]}
                      onCheckedChange={() => handleToggleDoc(doc.id)}
                      className="mt-1 border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white"
                    />
                    <div>
                      <label htmlFor={doc.id} className="text-base font-semibold block cursor-pointer">
                        {doc.label}
                      </label>
                      <span className="text-xs text-slate-500">{doc.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <Alert className="bg-blue-500/5 border-blue-500/20 py-4 px-6 rounded-2xl">
              <Info className="size-4 text-blue-400" />
              <div className="text-xs text-blue-300 ml-2">
                <strong>Pro Tip:</strong> We recommend having digital copies (PDF/JPEG) ready for a faster application process.
              </div>
            </Alert>
          </div>

          {/* Right: Bank Suggestions */}
          <div className="space-y-6">
            <GlassCard className={`p-8 border-2 transition-all ${allDocsChecked ? "border-emerald-500/40" : "border-slate-800 opacity-50"}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Shield className="size-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold">Suggested Banks</h3>
              </div>

              {!allDocsChecked ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-sm text-slate-500 italic">Complete the checklist to unlock bank suggestions</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="size-2 rounded-full bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((bank, idx) => (
                    <motion.div
                      key={bank.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold" style={{ color: bank.color }}>{bank.name}</span>
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      </div>
                      <p className="text-[10px] text-slate-500 mb-4">{bank.note}</p>
                      <Button 
                        onClick={() => onBankSelect(bank.url)}
                        className="w-full h-9 bg-white/5 hover:bg-white/10 border border-white/10 text-xs gap-2 group-hover:border-emerald-500/30"
                      >
                        Visit Official Portal
                        <ExternalLink className="size-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>

            {allDocsChecked && (
              <p className="text-center text-[10px] text-slate-600 px-4">
                Redirection will open the bank's official portal in a new tab. BharosaCredit does not store your bank credentials.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Alert = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`flex items-start ${className}`}>
    {children}
  </div>
);

export default RequirementForm;
