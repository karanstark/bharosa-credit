import React, { useState } from 'react';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import OnboardingForm from './pages/OnboardingForm';
import { LoginPage } from './components/ui/animated-characters-login-page';
import SignUp from './pages/SignUp';
import { useBharosaStore } from './store/bharosaStore';
import GlassCard from './components/GlassCard';
import BankSelect from './pages/BankSelect';
import ConsentFlow from './pages/ConsentFlow';
import FetchingData from './pages/FetchingData';
import SampleProfileSelect from './pages/SampleProfileSelect';
import SampleWorkerView from './pages/SampleWorkerView';
import SampleAuditView from './pages/SampleAuditView';
import Solutions from './pages/Solutions';
import TrustEngine from './pages/TrustEngine';
import Compliance from './pages/Compliance';
import Insights from './pages/Insights';
import RequirementForm from './pages/RequirementForm';

/* --- Error Boundary --- */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(
      "ErrorBoundary caught an error",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020408] flex items-center justify-center p-4 font-sans">
          <GlassCard className="max-w-md text-center p-12 border-emerald-500/30">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-emerald-500">🛡️</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Bharosa System Recovery
            </h2>
            <p className="text-slate-400 mb-8 text-sm">
              Our 7-Agent pipeline encountered
              an unexpected edge case. We've
              safely isolated the error.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
              >
                Restart Session
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = '/';
                }}
                className="w-full py-4 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-2xl transition-all"
              >
                Exit to Safety
              </button>
            </div>
          </GlassCard>
        </div>
      );
    }
    return this.props.children;
  }
}

/* --- Types --- */
interface BankType {
  id: string;
  name: string;
  short: string;
  color: string;
}

interface ConsentType {
  consent_id: string;
  status: string;
  bank?: BankType;
}

function App() {
  const [view, setView] = useState<
    | 'landing'
    | 'login'
    | 'signup'
    | 'upload'
    | 'dashboard'
    | 'bank-select'
    | 'consent'
    | 'fetching'
    | 'sample-profiles'
    | 'sample-worker'
    | 'sample-audit'
    | 'onboarding-form'
    | 'solutions'
    | 'trust-engine'
    | 'compliance'
    | 'insights'
    | 'requirement-form'
  >('landing');
  
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const [selectedBank, setSelectedBank] = useState<BankType | null>(null);

  const [consentData, setConsentData] = useState<ConsentType | null>(null);

  const [sampleProfileId, setSampleProfileId] = useState<string>('');
  const [sampleProfileName, setSampleProfileName] = useState<string>('');

  const { isLoading, resetStore } = useBharosaStore();

  /* --- Existing handlers --- */
  const handleStart = () => {
    setView('onboarding-form');
  };

  const handleFormSuccess = () => {
    setView('upload');
  };

  const handleLogin = () => {
    setView('login');
  };

  const handleCompleteUpload = () => {
    setView('dashboard');
  };

  const goHome = () => {
    resetStore();
    setView('landing');
    setSelectedBank(null);
    setConsentData(null);
  };

  /* --- New AA handlers --- */
  const handleBankSelect = (
    bank: BankType,
    consent: ConsentType
  ) => {
    setSelectedBank(bank);
    setConsentData(consent);
    setView('consent');
  };

  const handleConsentAllow = () => {
    setView('fetching');
  };

  const handleConsentDeny = () => {
    setView('upload');
  };

  /* --- Sample Profile handlers --- */
  const handleViewSampleData = () => {
    setView('sample-profiles');
  };

  const handleSelectSampleProfile = (profileId: string, profileName: string) => {
    setSampleProfileId(profileId);
    setSampleProfileName(profileName);
    
    if (profileId.includes('worker')) {
      setView('sample-worker');
    } else if (profileId.includes('audit')) {
      setView('sample-audit');
    }
  };

  const handleBackToSampleProfiles = () => {
    setView('sample-profiles');
  };

  const handleFetchComplete = () => {
    setView('dashboard');
  };

  const handleGoToBankSelect = () => {
    setView('bank-select');
  };

  /* --- Info Section handlers --- */
  const handleViewSolutions = () => {
    setView('solutions');
  };

  const handleViewTrustEngine = () => {
    setView('trust-engine');
  };

  const handleViewCompliance = () => {
    setView('compliance');
  };

  const handleViewInsights = () => {
    setView('insights');
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white overflow-x-hidden selection:bg-emerald-500/30 font-jakarta">
      <main
        className={`${
          view === 'landing' ||
          view === 'login' ||
          view === 'signup' ||
          view === 'onboarding-form'
            ? ''
            : 'pt-24 pb-16 px-4 sm:px-10 lg:px-16 w-full relative z-10'
        }`}
      >
        <ErrorBoundary>

          {view === 'landing' && (
            <Landing
              onStart={handleStart}
              onLogin={handleLogin}
              onSampleData={handleViewSampleData}
              onSolutions={handleViewSolutions}
              onTrustEngine={handleViewTrustEngine}
              onCompliance={handleViewCompliance}
              onInsights={handleViewInsights}
            />
          )}

          {view === 'login' && (
            <LoginPage 
              onBack={goHome} 
              onLoginSuccess={() => {
                if (selectedProduct) {
                  setView('requirement-form');
                } else {
                  setView('dashboard');
                }
              }}
              onSignUpClick={() => setView('signup')}
            />
          )}

          {view === 'signup' && (
            <SignUp 
              onBack={goHome}
              onSignUpSuccess={() => {
                if (selectedProduct) {
                  setView('login');
                } else {
                  setView('login');
                }
              }}
            />
          )}

          {view === 'onboarding-form' && (
            <OnboardingForm
              onSuccess={handleFormSuccess}
              onBack={goHome}
            />
          )}

          {view === 'upload' && (
            <Upload
              onComplete={handleCompleteUpload}
              onBack={goHome}
            />
          )}

          {view === 'dashboard' && (
            <Dashboard 
              onLogout={goHome} 
              onNewAudit={() => setView('upload')} 
            />
          )}

          {/* New AA views */}
          {view === 'bank-select' && (
            <BankSelect
              onBankSelected={handleBankSelect}
              onBack={() => setView('upload')}
            />
          )}

          {view === 'consent' && (
            <ConsentFlow
              bank={selectedBank}
              consent={consentData}
              onAllow={handleConsentAllow}
              onDeny={handleConsentDeny}
            />
          )}

          {view === 'fetching' && (
            <FetchingData
              bank={selectedBank}
              consent={consentData}
              onComplete={handleFetchComplete}
            />
          )}

          {/* Sample Profile views */}
          {view === 'sample-profiles' && (
            <SampleProfileSelect
              onBack={goHome}
              onSelectProfile={handleSelectSampleProfile}
            />
          )}

          {view === 'sample-worker' && (
            <SampleWorkerView
              profileId={sampleProfileId}
              profileName={sampleProfileName}
              onBack={handleBackToSampleProfiles}
            />
          )}

          {view === 'sample-audit' && (
            <SampleAuditView
              profileId={sampleProfileId}
              profileName={sampleProfileName}
              onBack={handleBackToSampleProfiles}
            />
          )}

          {/* Info Section views */}
          {view === 'solutions' && (
            <Solutions 
              onBack={goHome} 
              onApply={(product) => {
                setSelectedProduct(product);
                setView('login');
              }}
            />
          )}

          {view === 'trust-engine' && (
            <TrustEngine onBack={goHome} />
          )}

          {view === 'compliance' && (
            <Compliance onBack={goHome} />
          )}

          {view === 'insights' && (
            <Insights onBack={goHome} />
          )}

          {view === 'requirement-form' && (
            <RequirementForm
              productName={selectedProduct || "Personal Loan"}
              onBack={() => setView('solutions')}
              onBankSelect={(bankUrl: string) => {
                window.open(bankUrl, '_blank');
              }}
            />
          )}

          {/* Global loader */}
          {isLoading &&
            view !== 'upload' &&
            view !== 'dashboard' && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020408]/90 backdrop-blur-xl">
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]"></div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Orchestrating Agents...
                  </h3>
                  <p className="text-emerald-500/60 text-sm mt-2 font-semibold uppercase tracking-widest">
                    Autonomous Pipeline V2.1
                  </p>
                </div>
              </div>
            )}

        </ErrorBoundary>
      </main>

      {/* Ambient elements */}
      {view !== 'landing' &&
        view !== 'login' && (
          <>
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3"></div>
          </>
        )}
    </div>
  );
}

export default App;