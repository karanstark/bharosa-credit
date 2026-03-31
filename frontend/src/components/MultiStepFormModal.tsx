"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, ArrowUpRight, Globe, Info } from "lucide-react";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  // Remove ₹, commas, spaces, letters
  const cleaned = value
    .replace(/[₹,\s]/g, '')
    .replace(/[^0-9.]/g, '')

  const num = parseFloat(cleaned)

  // Handle edge cases
  if (isNaN(num)) return 20000      // default
  if (num <= 0) return 20000        // default
  if (num > 500000) return 500000   // max cap
  if (num < 1000) return 1000       // min floor

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

interface MultiStepFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MultiStepFormModal: React.FC<MultiStepFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    country: "",
    loanAmount: 20000,
    registrationNumber: "",
    confirmRegistrationNumber: "",
  });

  const [validation, setValidation] = React.useState({
    registrationMatch: false,
  });

  const handleInputChange = (field: string, value: any) => {
    // Sanitize loan amount
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

    // Validate registration number match
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

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      await submitForm();
    }
  };2

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const submitForm = async () => {
    setIsLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("requested_amount", formData.loanAmount.toString());

      // Call backend API
      const response = await analyzeStatement(formDataObj);
      
      if (response) {
        onSuccess();
        onClose();
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <MultiStepForm
        currentStep={currentStep}
        totalSteps={2}
        title="Analyze Your Financial Statement"
        description="Complete the steps to begin your autonomous credit assessment"
        onBack={handleBack}
        onNext={handleNext}
        onClose={onClose}
        nextButtonText={currentStep === 2 ? "Submit & Analyze" : "Next Step"}
        footerContent={
          <a href="#" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Need Help? <ArrowUpRight className="h-4 w-4" />
          </a>
        }
      >
        {/* Step 1: Document Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Country Selection */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="country" className="text-white font-semibold text-base">In which country is your document from?</Label>
                  <TooltipIcon text="Select the country where your financial document is issued." />
                </div>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger id="country" className="text-white bg-slate-800 border border-slate-600 hover:border-emerald-500">
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

        {/* Step 2: Verification */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Registration Number */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="reg-number">Document Reference Number</Label>
                  <TooltipIcon text="Enter the reference number or ID from your financial document." />
                </div>
                <Input
                  id="reg-number"
                  placeholder="Enter document reference number"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                />
              </div>

              {/* Confirm Registration Number */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="confirm-reg-number">Confirm Reference Number</Label>
                  <TooltipIcon text="Re-enter the reference number to avoid any mistakes." />
                </div>
                <Input
                  id="confirm-reg-number"
                  placeholder="Confirm reference number"
                  value={formData.confirmRegistrationNumber}
                  onChange={(e) => handleInputChange("confirmRegistrationNumber", e.target.value)}
                />
              </div>
            </div>

            {formData.registrationNumber && formData.confirmRegistrationNumber && (
              <Alert variant={validation.registrationMatch ? "success" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {validation.registrationMatch
                    ? "✓ Reference numbers match"
                    : "✗ Reference numbers do not match"}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </MultiStepForm>
    </motion.div>
  );
};
