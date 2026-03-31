import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const INDIA_STATES_AND_UTS = [
  "Andaman and Nicobar Islands (UT)", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh (UT)", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu (UT)", "Delhi (NCT)", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir (UT)", "Jharkhand", "Karnataka", "Kerala", "Ladakh (UT)", "Lakshadweep (UT)", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry (UT)", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface SignUpProps {
  onBack: () => void;
  onSignUpSuccess: () => void;
}

export default function SignUp({ onBack, onSignUpSuccess }: SignUpProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    otp: "",
    address: "",
    country: "",
    state: "",
    profession: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    // Reset state if country changes and is no longer India
    if (name === "country" && value !== "India") {
      setFormData((prev) => ({ ...prev, state: "" }));
    }
  };

  const handleSendOtp = async () => {
    if (!formData.phone) {
      setError("Please enter a phone number first.");
      return;
    }
    
    setIsOtpSending(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/sms/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send SMS.");
      
      setOtpSessionId(data.session_id);
      setOtpSent(true);
      setSuccessMsg("SMS OTP sent to your phone via 2Factor! 📱");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || !otpSessionId) {
      setError("Please enter the OTP or resend it.");
      return;
    }
    setIsOtpVerifying(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/sms/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: formData.phone, 
          otp: formData.otp,
          session_id: otpSessionId
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid OTP.");
      
      setOtpVerified(true);
      setSuccessMsg("Phone verified successfully! ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) {
      setError("Please verify your phone number with OTP first.");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // 1. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Send Verification Email
      await sendEmailVerification(user);

      // 3. Post to Backend
      const profileData = {
        firebase_uid: user.uid,
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: parseInt(formData.age),
        phone: formData.phone,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        profession: formData.profession,
        email: formData.email,
      };

      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile on the backend.");
      }

      setSuccessMsg("Account created! We've sent a verification email to " + formData.email + ". Please verify your email before logging in.");
      
      // Delay to show success message before redirecting
      setTimeout(() => {
        onSignUpSuccess();
      }, 5000);

    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "An error occurred during sign up.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center p-6 text-white font-jakarta">
      <div className="w-full max-w-2xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-8 relative z-10">
          <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Sparkles className="size-4 text-emerald-400" />
          </div>
          <span className="text-white">BharosaCredit SignUp</span>
        </div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Join us to start building your credit profile today.</p>
        </div>

        {successMsg ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-8 text-center relative z-10">
            <CheckCircle2 className="size-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Registration Complete!</h3>
            <p className="text-slate-300 mb-6">{successMsg}</p>
            <Button onClick={onSignUpSuccess} className="bg-emerald-600 hover:bg-emerald-500 text-white w-full">
              Proceed to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                <Input required id="firstName" name="firstName" placeholder="Rahul" value={formData.firstName} onChange={handleChange} className="bg-white/5 border-white/10 focus:border-emerald-500 text-white h-11" />
              </div>
              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                <Input required id="lastName" name="lastName" placeholder="Sharma" value={formData.lastName} onChange={handleChange} className="bg-white/5 border-white/10 focus:border-emerald-500 text-white h-11" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-slate-300">Age</Label>
                <Input required id="age" name="age" type="number" min="18" placeholder="25" value={formData.age} onChange={handleChange} className="bg-white/5 border-white/10 focus:border-emerald-500 text-white h-11" />
              </div>
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                <div className="flex gap-2">
                  <Input 
                    required 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="+91 9876543210" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    disabled={otpVerified || otpSent}
                    className="bg-white/5 border-white/10 focus:border-emerald-500 text-white h-11 flex-1" 
                  />
                  {!otpVerified && (
                    <Button 
                      type="button" 
                      onClick={handleSendOtp} 
                      disabled={isOtpSending || !formData.phone}
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 h-11 px-4"
                    >
                      {isOtpSending ? "..." : (otpSent ? "Resend" : "Send OTP")}
                    </Button>
                  )}
                  {otpVerified && <div className="h-11 flex items-center px-2 text-emerald-400"><CheckCircle2 className="size-5" /></div>}
                </div>
              </div>
            </div>

            {/* OTP Input Field */}
            {otpSent && !otpVerified && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="otp" className="text-emerald-400">Enter 6-digit OTP</Label>
                <div className="flex gap-2">
                  <Input 
                    required 
                    id="otp" 
                    name="otp" 
                    maxLength={6}
                    placeholder="123456" 
                    value={formData.otp} 
                    onChange={handleChange} 
                    className="bg-white/5 border-white/10 focus:border-emerald-500 text-white h-11 flex-1 tracking-[0.5em] text-center font-mono text-lg" 
                  />
                  <Button 
                    type="button" 
                    onClick={handleVerifyOtp} 
                    disabled={isOtpVerifying || formData.otp.length < 6}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white h-11 px-6 font-bold"
                  >
                    {isOtpVerifying ? "Verifying..." : "Verify"}
                  </Button>
                </div>
                <p className="text-xs text-slate-500">OTP sent via 2Factor Gateway to your phone.</p>
              </div>
            )}


            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-300">Address line</Label>
              <Input required id="address" name="address" placeholder="123 Sector 4, Main Road" value={formData.address} onChange={handleChange} className="bg-white/5 border-white/10 focus:border-emerald-500 text-white h-11" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Country */}
               <div className="space-y-2">
                  <Label className="text-slate-300">Country</Label>
                  <Select onValueChange={(val) => handleSelectChange('country', val)} required>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 focus:ring-emerald-500">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f121a] border-white/10 text-white max-h-[300px]">
                      {COUNTRIES.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

               {/* State (Conditional) */}
               {formData.country === "India" && (
                 <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                    <Label className="text-slate-300">State / Union Territory</Label>
                    <Select onValueChange={(val) => handleSelectChange('state', val)} required>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 focus:ring-emerald-500">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f121a] border-white/10 text-white max-h-[300px]">
                        {INDIA_STATES_AND_UTS.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profession */}
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-slate-300">Profession</Label>
                <Input required id="profession" name="profession" placeholder="e.g. Gig Worker, Plumber, IT" value={formData.profession} onChange={handleChange} className="bg-white/5 border-white/10 focus:border-emerald-500 text-white h-11" />
              </div>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <Input required id="email" name="email" type="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} className="bg-white/5 border-white/10 focus:border-emerald-500 text-white h-11" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input required id="password" name="password" type="password" placeholder="Create a strong password (min 6 chars)" value={formData.password} onChange={handleChange} className="bg-white/5 border-white/10 focus:border-emerald-500 text-white h-11" />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox required id="terms" className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white" />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer text-slate-400">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg flex items-start gap-2">
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={onBack} className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 h-12">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !otpVerified} className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white h-12 font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                {isLoading ? "Creating Account..." : "Create Account & Send Verification"}
              </Button>
            </div>
          </form>
        )}
        {/* Invisible reCAPTCHA container for Phone Auth */}
        <div id="recaptcha-container" className="mt-4"></div>
      </div>
    </div>
  );
}
