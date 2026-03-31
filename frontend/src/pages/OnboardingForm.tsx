import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, ArrowRight, Globe, Info } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { analyzeStatement } from "@/utils/api";

const sanitizeLoanAmount = (value: string): number => {
  const cleaned = value
    .replace(/[₹,\s]/g, '')
    .replace(/[^0-9.]/g, '')

  const num = parseFloat(cleaned)

  if (isNaN(num)) return 20000
  if (num <= 0) return 20000
  if (num > 500000) return 500000
  if (num < 1000) return 1000

  return Math.round(num)
}

const TooltipIcon = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface OnboardingFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  onSuccess,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    country: "",
    loanAmount: 20000,
    registrationNumber: "",
    confirmRegistrationNumber: "",
  });

  const [validation, setValidation] = useState({
    registrationMatch: false,
  });

  const handleInputChange = (field: string, value: any) => {
    if (field === "loanAmount") {
      const cleaned = sanitizeLoanAmount(value)
      setFormData((prev) => ({
        ...prev,
        [field]: cleaned,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    setError(null);

    if (field === "registrationNumber" || field === "confirmRegistrationNumber") {
      const reg = field === "registrationNumber" ? value : formData.registrationNumber;
      const confirm = field === "confirmRegistrationNumber" ? value : formData.confirmRegistrationNumber;
      setValidation({
        registrationMatch: reg === confirm && reg.length > 0,
      });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.country) {
          setError("Please select a country");
          return false;
        }
        if (!formData.loanAmount || formData.loanAmount <= 0) {
          setError("Please enter a valid loan amount");
          return false;
        }
        return true;
      case 2:
        if (!formData.registrationNumber) {
          setError("Please enter document ID");
          return false;
        }
        if (!validation.registrationMatch) {
          setError("Document IDs do not match");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitForm();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    } else {
      onBack();
    }
  };

  const submitForm = async () => {
    setIsLoading(true);
    try {
      const payload = {
        requested_amount: formData.loanAmount,
        reference_number: formData.registrationNumber
      };

      const response = await analyzeStatement(payload);

      if (response) {
        onSuccess();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to process your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020408] text-white font-jakarta p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Header */}
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">
            Analyze Your Financial Statement
          </h1>
          <p className="text-slate-400 text-lg">
            Complete the steps to begin your autonomous credit assessment
          </p>
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">
            Step {currentStep} of 2
          </p>
        </div>

        {/* Form Card */}
        <GlassCard className="p-12 border-emerald-500/20 border-2">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Country Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="country" className="text-white font-semibold text-base">In which country is your document from?</Label>
                    <TooltipIcon text="Select the country where your financial document is issued." />
                  </div>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger id="country" className="text-white bg-slate-800 border border-slate-600 hover:border-emerald-500 h-12">
                      <Globe className="h-4 w-4 mr-2 text-emerald-500" />
                      <SelectValue placeholder="Select a country..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-2 border-emerald-500/50 text-white z-[10000]">
                      <SelectItem value="India" className="text-white focus:bg-emerald-500/20">🇮🇳 India</SelectItem>
                      <SelectItem value="United States" className="text-white focus:bg-emerald-500/20">🇺🇸 United States</SelectItem>
                      <SelectItem value="United Kingdom" className="text-white focus:bg-emerald-500/20">🇬🇧 United Kingdom</SelectItem>
                      <SelectItem value="Canada" className="text-white focus:bg-emerald-500/20">🇨🇦 Canada</SelectItem>
                      <SelectItem value="Australia" className="text-white focus:bg-emerald-500/20">🇦🇺 Australia</SelectItem>
                      <SelectItem value="Germany" className="text-white focus:bg-emerald-500/20">🇩🇪 Germany</SelectItem>
                      <SelectItem value="France" className="text-white focus:bg-emerald-500/20">🇫🇷 France</SelectItem>
                      <SelectItem value="Japan" className="text-white focus:bg-emerald-500/20">🇯🇵 Japan</SelectItem>
                      <SelectItem value="Singapore" className="text-white focus:bg-emerald-500/20">🇸🇬 Singapore</SelectItem>
                      <SelectItem value="United Arab Emirates" className="text-white focus:bg-emerald-500/20">🇦🇪 United Arab Emirates</SelectItem>
                      <SelectItem value="Malaysia" className="text-white focus:bg-emerald-500/20">🇲🇾 Malaysia</SelectItem>
                      <SelectItem value="Thailand" className="text-white focus:bg-emerald-500/20">🇹🇭 Thailand</SelectItem>
                      <SelectItem value="Indonesia" className="text-white focus:bg-emerald-500/20">🇮🇩 Indonesia</SelectItem>
                      <SelectItem value="Philippines" className="text-white focus:bg-emerald-500/20">🇵🇭 Philippines</SelectItem>
                      <SelectItem value="Bangladesh" className="text-white focus:bg-emerald-500/20">🇧🇩 Bangladesh</SelectItem>
                      <SelectItem value="Pakistan" className="text-white focus:bg-emerald-500/20">🇵🇰 Pakistan</SelectItem>
                      <SelectItem value="Sri Lanka" className="text-white focus:bg-emerald-500/20">🇱🇰 Sri Lanka</SelectItem>
                      <SelectItem value="Nepal" className="text-white focus:bg-emerald-500/20">🇳🇵 Nepal</SelectItem>
                      <SelectItem value="Mexico" className="text-white focus:bg-emerald-500/20">🇲🇽 Mexico</SelectItem>
                      <SelectItem value="Brazil" className="text-white focus:bg-emerald-500/20">🇧🇷 Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Loan Amount */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="loan-amount" className="text-white font-semibold text-base">Requested Loan Amount</Label>
                    <TooltipIcon text="The amount of credit you are seeking." />
                  </div>
                  <Input
                    id="loan-amount"
                    type="number"
                    placeholder="Enter amount (e.g., 20000)"
                    min="1000"
                    className="h-12 text-white bg-slate-800 border border-slate-600"
                    value={formData.loanAmount}
                    onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-number" className="text-white font-semibold text-base">Document Reference Number</Label>
                  <Input
                    id="reg-number"
                    placeholder="e.g., DL-2024-001234"
                    className="h-12 text-white bg-slate-800 border border-slate-600"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-reg" className="text-white font-semibold text-base">Confirm Document Reference Number</Label>
                  <Input
                    id="confirm-reg"
                    placeholder="Re-enter the reference number"
                    className="h-12 text-white bg-slate-800 border border-slate-600"
                    value={formData.confirmRegistrationNumber}
                    onChange={(e) => handleInputChange("confirmRegistrationNumber", e.target.value)}
                  />
                  {formData.registrationNumber && formData.confirmRegistrationNumber && (
                    <p className={`text-sm font-semibold ${validation.registrationMatch ? "text-emerald-400" : "text-red-400"}`}>
                      {validation.registrationMatch ? "✓ Numbers match" : "✗ Numbers don't match"}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-12 border-slate-600 text-white hover:bg-white/5"
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {currentStep === 2 ? "Submit & Analyze" : "Next Step"}
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default OnboardingForm;
