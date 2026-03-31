import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Zap, Shield, Percent } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { Button } from "@/components/ui/button";

interface LoanProduct {
  id: string;
  name: string;
  type: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  tenure: string;
  eligibility: string;
  icon: React.ReactNode;
  color: string;
}

export const Solutions: React.FC<{ 
  onBack: () => void, 
  onApply: (loanType: string) => void 
}> = ({ onBack, onApply }) => {
  const loanProducts: LoanProduct[] = [
    {
      id: "1",
      name: "Personal Loan",
      type: "Collateral-Free",
      minAmount: 50000,
      maxAmount: 500000,
      interestRate: 9.5,
      tenure: "12-60 months",
      eligibility: "CIBIL Score ≥ 650",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "emerald",
    },
    {
      id: "2",
      name: "Auto Loan",
      type: "Secured",
      minAmount: 200000,
      maxAmount: 2500000,
      interestRate: 7.2,
      tenure: "24-84 months",
      eligibility: "CIBIL Score ≥ 700",
      icon: <Zap className="w-6 h-6" />,
      color: "blue",
    },
    {
      id: "3",
      name: "Home Equity Loan",
      type: "Secured",
      minAmount: 500000,
      maxAmount: 5000000,
      interestRate: 6.5,
      tenure: "60-180 months",
      eligibility: "CIBIL Score ≥ 750",
      icon: <Shield className="w-6 h-6" />,
      color: "purple",
    },
    {
      id: "4",
      name: "Credit Builder Loan",
      type: "Secured",
      minAmount: 10000,
      maxAmount: 100000,
      interestRate: 12.5,
      tenure: "12-24 months",
      eligibility: "CIBIL Score ≥ 550",
      icon: <Percent className="w-6 h-6" />,
      color: "orange",
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

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
            Financial Solutions
          </h1>
          <p className="text-slate-400 text-xl">
            Tailored lending products for your financial goals
          </p>
        </div>

        {/* Loan Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loanProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedProduct(product.id)}
              className="cursor-pointer"
            >
              <GlassCard
                className={`p-6 border-2 transition-all ${
                  selectedProduct === product.id
                    ? `border-${product.color}-500 bg-${product.color}-500/5`
                    : "border-slate-600 hover:border-slate-500"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-${product.color}-500/20 flex items-center justify-center mb-4 text-${product.color}-400`}
                >
                  {product.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4">{product.type}</p>

                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-slate-500">Amount Range</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      ₹{(product.minAmount / 100000).toFixed(1)}L - ₹{(product.maxAmount / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Interest Rate</p>
                    <p className="text-sm font-semibold">{product.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tenure</p>
                    <p className="text-sm font-semibold">{product.tenure}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Eligibility</p>
                    <p className="text-sm font-semibold text-blue-400">
                      {product.eligibility}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={() => onApply(product.name)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500"
                >
                  Apply Now
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Product Details */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="p-8 border-2 border-emerald-500/30">
              <h2 className="text-2xl font-bold text-white mb-6">
                {loanProducts.find((p) => p.id === selectedProduct)?.name} Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">Features</h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li>✓ Quick approval process</li>
                    <li>✓ Flexible tenure options</li>
                    <li>✓ Competitive interest rates</li>
                    <li>✓ Digital documentation</li>
                    <li>✓ 24/7 customer support</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Documents Required
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li>• ID Proof</li>
                    <li>• Address Proof</li>
                    <li>• Income Proof</li>
                    <li>• Bank Statements (6 months)</li>
                    <li>• Employment Letter</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Processing Time
                  </h3>
                  <div className="text-slate-300">
                    <p className="text-2xl font-bold text-emerald-400 mb-2">
                      24-48 Hours
                    </p>
                    <p className="text-sm">
                      From verification to disbursement
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Solutions;
