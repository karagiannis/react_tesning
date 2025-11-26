/**
 * MODIFIED: 2025-11-23
 * PURPOSE: Multi-session localStorage scoping (orgnr-based isolation)
 * CHANGES: Added activeOnboarding state, updated getStorageKey() with orgnr scoping
 * REF: CHANGELOG_2025-11-23.md - Problem 5
 */

import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HeroSlide from './components/Slides/HeroSlide';
import LoginSlide from './components/Slides/LoginSlide';
import RegisterSlide from './components/Slides/RegisterSlide';
import VerifySlide from './components/Slides/VerifySlide';
import ForgotPasswordSlide from './components/Slides/ForgotPasswordSlide';
import ResetPasswordSlide from './components/Slides/ResetPasswordSlide';
import UppdragsvalsSlide from './components/Slides/UppdragsvalsSlide';
import RiskFragorSlide from './components/Slides/RiskFragorSlide';
import RiskFragorSteg2Slide from './components/Slides/RiskFragorSteg2Slide';
import RiskFragorSteg3Slide from './components/Slides/RiskFragorSteg3Slide';
import RiskFragorSteg4Slide from './components/Slides/RiskFragorSteg4Slide';
import BorderTestSlide from './components/Slides/BorderTestSlide';
import IdentitetskontrollSlide from './components/Slides/IdentitetskontrollSlide';
import KontrolltabellSlide from './components/Slides/KontrolltabellSlide';
import ForetagsdokumentationSlide from './components/Slides/ForetagsdokumentationSlide';
import BokforingsunderlagSlide from './components/Slides/BokforingsunderlagSlide';
import BokforingDataSlide from './components/Slides/BokforingDataSlide';
import VerksamhetSlide from './components/Slides/ResultSlides/VerksamhetSlide';
import AgarstrukturSlide from './components/Slides/ResultSlides/AgarstrukturSlide';
import StyrelseSlide from './components/Slides/ResultSlides/StyrelseSlide';
import RiskindikatorerSlide from './components/Slides/ResultSlides/RiskindikatorerSlide';
import OvrigaDataSlide from './components/Slides/ResultSlides/OvrigaDataSlide';
import LikviditetsanalysSlide from './components/Slides/LikviditetsanalysSlide';
import OmsattningsanalysSlide from './components/Slides/OmsattningsanalysSlide';
import ResultatanalysSlide from './components/Slides/ResultatanalysSlide';
import BranschjamforelseSlide from './components/Slides/BranschjamforelseSlide';
import BokforingsanalysSlide from './components/Slides/BokforingsanalysSlide';
import PenningflodesanalysSlide from './components/Slides/PenningflodesanalysSlide';
import RiskbedomningSlide from './components/Slides/RiskbedomningSlide';
import SkyldigheterSlide from './components/Slides/SkyldigheterSlide';
import AvtalSlide from './components/Slides/AvtalSlide';
import DocumentDeliverySlide from './components/Slides/DocumentDeliverySlide';
import BankRattigheterSlide from './components/Slides/BankRattigheterSlide';
import DeklarationsombudSlide from './components/Slides/DeklarationsombudSlide';
import FortnoxPackageSlide from './components/Slides/FortnoxPackageSlide';
import DocumentSetupSlide from './components/Slides/DocumentSetupSlide';
import WelcomeSlide from './components/Slides/WelcomeSlide';
import OngoingRoutinesSlide from './components/Slides/OngoingRoutinesSlide';
import SupportSlide from './components/Slides/SupportSlide';
import UnauthorizedPage from './components/Pages/UnauthorizedPage';
import ServerErrorPage from './components/Pages/ServerErrorPage';
//import SettingsPage from './components/Pages/SettingsPage';
import SettingsPageV2 from './components/Pages/SettingsPageV2';
import AdminDashboard from './components/Admin/AdminDashboard';
// import FraudDetectionDemo from './components/Demo/FraudDetectionDemo'; // KOMMENTERAD: Innehåller verklig klientdata (RS MekService A308)
import AccountingReviewPage from './pages/AccountingReviewPage';
import AccountingAnalysisWizard from './pages/AccountingAnalysisWizard';
import VoucherDetailPage from './pages/VoucherDetailPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import MainContent from './components/Layout/MainContent';
import LLMPanel from './components/Panels/LLMPanel';
import DocumentationPanel from './components/Panels/DocumentationPanel';
import SupportPanel from './components/Panels/SupportPanel';
import { AgreementProvider } from './contexts/AgreementContext';
import OnboardingResumeDialog from './components/Modals/OnboardingResumeDialog';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePanel, setActivePanel] = useState(null);
  
  // 🆕 Active onboarding session state (orgnr-scoped localStorage)
  const [activeOnboarding, setActiveOnboarding] = useState(() => {
    const cached = localStorage.getItem('activeOnboarding');
    return cached ? JSON.parse(cached) : null;
  });
  
  // Save activeOnboarding to localStorage whenever it changes
  useEffect(() => {
    if (activeOnboarding) {
      localStorage.setItem('activeOnboarding', JSON.stringify(activeOnboarding));
    } else {
      localStorage.removeItem('activeOnboarding');
    }
  }, [activeOnboarding]);
  
  // Persistent login state based on valid JWT token
  // BUT: Always force logout if explicitly on auth pages
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const authPages = ['/', '/login', '/register', '/verify', '/forgot-password', '/reset-password'];
    const isOnAuthPage = authPages.includes(window.location.pathname);
    
    if (isOnAuthPage) {
      console.log('🚪 User is on auth page - forcing logged out state');
      return false;
    }
    
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const isValid = Date.now() < expirationTime;
      console.log('🔐 Initial token check:', isValid ? 'VALID' : 'EXPIRED');
      return isValid;
    } catch (e) {
      console.log('🔐 Initial token check: INVALID format');
      return false; // Invalid token format
    }
  });
  
  // Demo mode - doesn't require real login
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('isDemoMode') === 'true';
  });
  
  // Resume dialog state
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [dialogDismissed, setDialogDismissed] = useState(false); // Prevent re-showing after user dismisses
  
  const [isPEP, setIsPEP] = useState(false);
  const [roaringData, setRoaringData] = useState(null);
  const [formData, setFormData] = useState({
    organisationsnummer: '',
    personnummer: ''
  });

  // Validera format och anropa API automatiskt
  useEffect(() => {
    const validateAndFetch = async () => {
      const orgNumRegex = /^\d{6}-?\d{4}$/;
      const persNumRegex = /^\d{8}-?\d{4}$/;
      
      if (orgNumRegex.test(formData.organisationsnummer) && 
          persNumRegex.test(formData.personnummer) &&
          !roaringData) {
        console.log('✅ Valid format - Fetching data from Roaring.io...');
        // TODO: Implementera verkligt API-anrop här
        // const data = await fetchRoaringData(formData.organisationsnummer, formData.personnummer);
        // setRoaringData(data);
        
        // För nu: använd mock data
        import('./data/mockRoaringData').then(module => {
          setRoaringData(module.mockRoaringData);
          console.log('✅ Mock data loaded');
        });
      }
    };
    
    validateAndFetch();
  }, [formData.organisationsnummer, formData.personnummer, roaringData]);

  const handleLogin = () => {
    console.log('🔐 handleLogin called - setting isLoggedIn to true');
    setIsLoggedIn(true);
    // Note: JWT tokens are already saved by LoginSlide
    // checkForOngoingOnboarding() will handle navigation
  };

  const handleDemo = () => {
    setIsDemoMode(true);
    localStorage.setItem('isDemoMode', 'true');
    navigate('/uppdragsval');  // Demo mode går direkt till uppdragsval
  };

  // 🆕 Ref to prevent double-triggering
  const hasCheckedOnboarding = useRef(false);

  // Reset ref when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      hasCheckedOnboarding.current = false;
    }
  }, [isLoggedIn]);

  // 🆕 Check for ongoing onboardings vid login
  useEffect(() => {
    console.log('🔍 useEffect triggered - isLoggedIn:', isLoggedIn, 'isDemoMode:', isDemoMode, 'dialogDismissed:', dialogDismissed);
    
    // Early returns
    if (!isLoggedIn || isDemoMode || dialogDismissed) return;
    
    // Prevent double-execution
    if (hasCheckedOnboarding.current) {
      console.log('⏭️ Already checked onboarding - skipping');
      return;
    }
    hasCheckedOnboarding.current = true;

    const checkForOngoingOnboarding = async () => {
      console.log('🚀 checkForOngoingOnboarding started');
      try {
        const token = localStorage.getItem('accessToken');
        console.log('🔑 Token check:', token ? 'EXISTS' : 'MISSING');
        if (!token) {
          console.error('No access token found after login');
          // Don't navigate - let LoginSlide handle navigation
          return;
        }
        
        // Validate token expiration
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000;
          const now = Date.now();
          const timeLeft = Math.floor((expirationTime - now) / 1000 / 60);
          console.log(`⏰ Token expires in ${timeLeft} minutes`);
          
          if (Date.now() >= expirationTime) {
            console.error('Token expired immediately after login - this should not happen');
            // Don't navigate - let LoginSlide handle navigation
            return;
          }
        } catch (e) {
          console.error('Invalid token format:', e);
          // Don't navigate - let LoginSlide handle navigation
          return;
        }

        const API_BASE = import.meta.env.VITE_API_URL || 'https://celestial.se/tic-tac-toe-api/api';
        console.log('📡 Fetching onboardings from:', `${API_BASE}/onboarding/list`);

        const response = await fetch(`${API_BASE}/onboarding/list`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('❌ Failed to fetch onboardings:', response.status);
          navigate('/uppdragsval');  // Fallback: gå till uppdragsval
          return;
        }

        const data = await response.json();
        console.log('📦 Onboarding data received:', data);
        
        if (data.companies && data.companies.length > 0) {
          console.log('✅ Found', data.companies.length, 'ongoing onboarding(s) - showing resume dialog');
          // Navigate away from auth page first so dialog is visible
          navigate('/uppdragsval');
          // Show dialog on next tick so navigation completes first
          setTimeout(() => setShowResumeDialog(true), 100);
        } else {
          console.log('✅ No ongoing onboardings - navigating to /uppdragsval');
          navigate('/uppdragsval');  // Inga företag → gå direkt till uppdragsval
        }
      } catch (error) {
        console.error('Error checking ongoing onboardings:', error);
        navigate('/uppdragsval');  // Fallback vid fel
      }
    };

    checkForOngoingOnboarding();
  }, [isLoggedIn, isDemoMode, dialogDismissed, navigate]);

  // 🆕 Helper: Extract userId from JWT for localStorage keys
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub || decoded.user_id || decoded.email;
    } catch {
      return null;
    }
  };

  // 🆕 Helper: Get user-scoped AND orgnr-scoped localStorage key
  const getStorageKey = (key) => {
    const userId = getUserIdFromToken();
    const orgnr = activeOnboarding?.orgnr;
    
    if (!userId) return `onboarding-${key}`;
    if (!orgnr) return `onboarding-${userId}-${key}`;
    
    // Full scoping: user + orgnr + key
    return `onboarding-${userId}-${orgnr}-${key}`;
  };

  // Resume callback: Ladda data och navigera (STATE MACHINE SIMPLIFIED)
  const handleResume = (data) => {
    console.log('📂 Resuming onboarding:', data);
    
    // Set active onboarding session
    setActiveOnboarding({
      orgnr: data.orgnr,
      companyName: data.companyName,
      currentStep: data.currentStep,
      state: data.state || 'draft'  // State machine support
    });
    
    // Set global localStorage keys (for IDs and basic info)
    localStorage.setItem('onboardingId', data.onboardingId);
    localStorage.setItem('currentCompanyId', data.company_id);
    localStorage.setItem('currentCompanyName', data.companyName);
    localStorage.setItem('currentOrgnr', data.orgnr);
    
    // useQuestionnaireForm will handle data loading based on state
    // No need to manually map slide data - state machine takes care of it!
    
    setShowResumeDialog(false);
    setDialogDismissed(true);
    navigate(`/${data.currentStep}`);  // Navigate to current step
  };

  // 🆕 New session callback: Stäng dialog och gå till uppdragsval
  const handleNewSession = () => {
    console.log('✨ Starting new onboarding session');
    setShowResumeDialog(false);
    setDialogDismissed(true);  // Prevent re-showing
    navigate('/uppdragsval');
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'llm':
        return <LLMPanel onClose={() => setActivePanel(null)} appData={{}} />;
      case 'documentation':
        return <DocumentationPanel onClose={() => setActivePanel(null)} />;
      case 'support':
        return <SupportPanel onClose={() => setActivePanel(null)} />;
      default:
        return null;
    }
  };

  // Inledning slide component
  const IntroSlide = () => (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-card shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-brand-900 mb-6">Inledning och bakgrund</h1>
        <div className="text-brand-800 space-y-4">
          <p>
            Denna onboarding säkerställer att byrån uppfyller penningtvättslagstiftningens krav 
            vid antagandet av nya kunder. Processen efterlever tillsynsmyndighetens krav där 
            verksamhetsutövaren (byrån) är skyldig att redovisa hur man säkerställt att byrån 
            inte gör sig skyldig till penningtvätt.
          </p>
          <p>
            Länsstyrelserna, som ansvarar för tillsynen, har skärpt kraven på redovisningsbyråer 
            och utfärdar sanktionsavgifter på hundratusentals kronor vid bristande efterlevnad.
          </p>
          <p>
            Det är dessa myndighetskrav som tvingar oss att ställa specifika frågor och att spara 
            dokumentationen i minst fem år.
          </p>
          <p className="font-semibold">
            Processen är därmed en följd av myndighetskrav och syftar till att förebygga 
            penningtvätt och ekonomisk brottslighet.
          </p>
        </div>
        <button
          onClick={() => navigate('/riskfragor')}
          className="w-full mt-8 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-box font-semibold transition-all"
        >
          Nästa
        </button>
      </div>
    </div>
  );

  // Auth pages that should NEVER show sidebar/header (even when logged in)
  const authPages = ['/', '/login', '/register', '/verify'];
  const isAuthPage = authPages.includes(location.pathname);

  // Check if Roaring.io data is available (OUTPUT slides unlocked)
  // ⚠️ MUST be called before any conditional returns (Rules of Hooks)
  const hasRoaringData = React.useMemo(() => {
    if (roaringData !== null) return true; // Demo mode or existing data
    
    const userId = getUserIdFromToken();
    if (!userId) return false;
    
    return localStorage.getItem(`onboarding-${userId}-hasRoaringData`) === 'true';
  }, [roaringData, location.pathname]); // Re-check on navigation

  // Show auth layout (no sidebar) for auth pages OR when not logged in (unless in demo mode)
  if (isAuthPage || (!isLoggedIn && !isDemoMode)) {
    return (
      <Routes>
        <Route path="/" element={<HeroSlide onNext={() => navigate('/login')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} onDemo={handleDemo} />} />
        <Route path="/login" element={<LoginSlide onNext={handleLogin} onRegister={() => navigate('/register')} />} />
        <Route path="/register" element={<RegisterSlide onNext={() => navigate('/verify')} onLogin={() => navigate('/login')} />} />
        <Route path="/verify" element={<VerifySlide onNext={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPasswordSlide onNext={() => navigate('/reset-password')} onBack={() => navigate('/login')} />} />
        <Route path="/reset-password" element={<ResetPasswordSlide onNext={() => navigate('/login')} onResendCode={() => navigate('/forgot-password')} />} />
        {/* Redirect any other route to home if not logged in and not in demo */}
        {!isLoggedIn && !isDemoMode && <Route path="*" element={<HeroSlide onNext={() => navigate('/login')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} onDemo={handleDemo} />} />}
      </Routes>
    );
  }

  // Settings page has its own sidebar, don't render app sidebar/header
  const isSettingsPage = location.pathname === '/settings' || location.pathname === '/settings-v2';
  
  // Voucher detail pages open in separate windows without sidebar/header
  const isVoucherPage = location.pathname.startsWith('/voucher/');

  return (
    <AgreementProvider>
      {/* 🆕 Resume dialog - visas över allt annat när pågående onboardings finns */}
      {showResumeDialog && (
        <OnboardingResumeDialog 
          onResume={handleResume} 
          onNewSession={handleNewSession} 
        />
      )}
      
      <div className="flex h-screen overflow-hidden">
        {!isSettingsPage && !isVoucherPage && (
          <Sidebar 
            currentPath={location.pathname}
            onNavigate={(path) => navigate(path)}
            hasRoaringData={hasRoaringData}
            isDemoMode={isDemoMode}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isSettingsPage && !isVoucherPage && <Header onPanelToggle={setActivePanel} isDemoMode={isDemoMode} />}
          <MainContent hasPanel={activePanel !== null}>
            <Routes>
            <Route path="/" element={<HeroSlide onNext={() => navigate('/login')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} onDemo={handleDemo} />} />
            <Route path="/login" element={<LoginSlide onNext={handleLogin} onRegister={() => navigate('/register')} />} />
            <Route path="/register" element={<RegisterSlide onNext={() => navigate('/verify')} onLogin={() => navigate('/login')} />} />
            <Route path="/verify" element={<VerifySlide onNext={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPasswordSlide onNext={() => navigate('/reset-password')} onBack={() => navigate('/login')} />} />
            <Route path="/reset-password" element={<ResetPasswordSlide onNext={() => navigate('/login')} onResendCode={() => navigate('/forgot-password')} />} />
            <Route path="/uppdragsval" element={
              <UppdragsvalsSlide 
                onNext={(data) => {
                  console.log('✅ Onboarding created:', data);
                  console.log('📋 company_id:', data.onboardingId);
                  // Navigate to riskfragor with company_id
                  navigate(`/riskfragor/${data.onboardingId}`);
                }} 
              />
            } />
            <Route path="/uppdragsval/:companyId/:caseId" element={
              <UppdragsvalsSlide 
                onNext={(data) => {
                  console.log('✅ Onboarding created:', data);
                  console.log('📋 company_id:', data.onboardingId);
                  // Navigate to riskfragor with company_id + case_id
                  navigate(`/riskfragor/${data.companyId}/${data.caseId}`);
                }} 
              />
            } />
            <Route path="/riskfragor/:companyId" element={
              <RiskFragorSlide 
                onNext={(companyId) => {
                  // Navigate to steg 2 with companyId
                  navigate(`/riskfragor/steg2/${companyId}`);
                }}
                onSkipPEP={(companyId) => {
                  setIsPEP(false);
                  navigate(`/riskfragor/steg2/${companyId}`);
                }}
                onFormDataChange={(data) => {
                  setFormData({
                    organisationsnummer: data.organisationsnummer || '',
                    personnummer: data.personnummer || ''
                  });
                }}
              />
            } />
            <Route path="/riskfragor/steg2/:companyId" element={
              <RiskFragorSteg2Slide 
                onNext={(companyId) => {
                  console.log('Steg 2 complete, company:', companyId);
                  navigate(`/riskfragor/steg3/${companyId}`);
                }}
              />
            } />
            <Route path="/riskfragor/steg3/:companyId" element={
              <RiskFragorSteg3Slide 
                onNext={(companyId) => {
                  console.log('Steg 3 complete, company:', companyId);
                  navigate(`/riskfragor/steg4/${companyId}`);
                }}
              />
            } />
            <Route path="/riskfragor/steg4/:companyId" element={
              <RiskFragorSteg4Slide 
                onNext={(companyId) => {
                  console.log('Steg 4 complete, triggering Roaring.io fetch');
                  // Steg 4 internally calls Roaring.io API
                  navigate(`/identitetskontroll/${companyId}`);
                }}
              />
            } />
            <Route path="/identitetskontroll/:companyId" element={
              <IdentitetskontrollSlide onNext={(companyId) => navigate(`/kontrolltabell/${companyId}`)} />
            } />
            <Route path="/kontrolltabell/:companyId" element={
              <KontrolltabellSlide onNext={(companyId) => navigate(`/verksamhet/${companyId}`)} />
            } />
            
            {/* Border test page (development only) */}
            <Route path="/border-test" element={<BorderTestSlide />} />
            
            {/* Result slides */}
            <Route path="/verksamhet/:companyId" element={<VerksamhetSlide onNext={() => navigate('/agarstruktur')} onBack={() => navigate('/kontrolltabell')} />} />
            <Route path="/agarstruktur/:companyId" element={<AgarstrukturSlide onNext={() => navigate('/styrelse')} onBack={() => navigate('/verksamhet')} />} />
            <Route path="/styrelse/:companyId" element={<StyrelseSlide onNext={() => navigate('/riskindikatorer')} onBack={() => navigate('/agarstruktur')} />} />
            <Route path="/riskindikatorer/:companyId" element={<RiskindikatorerSlide onNext={() => navigate('/ovrigadata')} onBack={() => navigate('/styrelse')} />} />
            <Route path="/ovrigadata/:companyId" element={<OvrigaDataSlide onNext={() => navigate('/dokumentation')} onBack={() => navigate('/riskindikatorer')} />} />
            
            {/* Företagsdokumentation */}
            <Route path="/dokumentation/:companyId" element={<ForetagsdokumentationSlide onNext={() => navigate('/underlag')} onBack={() => navigate('/ovrigadata')} />} />
            
            {/* Bokföringsunderlag */}
            <Route path="/underlag/:companyId" element={<BokforingsunderlagSlide onNext={() => navigate('/bokforing')} onBack={() => navigate('/dokumentation')} />} />
            
            {/* Bokföringsdata (Skattekonto OAuth) */}
            <Route path="/bokforing/:companyId" element={<BokforingDataSlide onNext={() => navigate('/likviditet')} onBack={() => navigate('/underlag')} />} />
            
            {/* Ekonomisk rådgivning (slides 11-14) */}
            <Route path="/likviditet/:companyId" element={<LikviditetsanalysSlide onNext={() => navigate('/omsattning')} onBack={() => navigate('/bokforing')} />} />
            <Route path="/omsattning/:companyId" element={<OmsattningsanalysSlide onNext={() => navigate('/resultat')} onBack={() => navigate('/likviditet')} />} />
            <Route path="/resultat/:companyId" element={<ResultatanalysSlide onNext={() => navigate('/bransch')} onBack={() => navigate('/omsattning')} />} />
            <Route path="/bransch/:companyId" element={<BranschjamforelseSlide onNext={() => navigate('/bokanalys')} onBack={() => navigate('/resultat')} />} />
            
            {/* Djupgranskning och beslut (slides 15-20) */}
            <Route path="/bokanalys/:companyId" element={<AccountingAnalysisWizard />} />
            <Route path="/penningflodes/:companyId" element={<PenningflodesanalysSlide onNext={() => navigate('/riskbedomning')} onBack={() => navigate('/bokanalys')} />} />
            <Route path="/riskbedomning/:companyId" element={<RiskbedomningSlide onNext={() => navigate('/skyldigheter')} onBack={() => navigate('/penningflodes')} />} />
            <Route path="/skyldigheter/:companyId" element={<SkyldigheterSlide onNext={() => navigate('/avtal')} onBack={() => navigate('/riskbedomning')} />} />
            <Route path="/avtal/:companyId" element={<AvtalSlide onNext={() => navigate('/dokument')} onBack={() => navigate('/skyldigheter')} />} />
            <Route path="/dokument/:companyId" element={<DocumentDeliverySlide onNext={() => navigate('/fortnox')} onBack={() => navigate('/avtal')} />} />
            
            {/* Post-kontrakt setup - slides 24-30 */}
            <Route path="/fortnox/:companyId" element={<FortnoxPackageSlide onNext={() => navigate('/bank')} onBack={() => navigate('/dokument')} />} />
            <Route path="/bank/:companyId" element={<BankRattigheterSlide onNext={() => navigate('/ombud')} onBack={() => navigate('/fortnox')} />} />
            <Route path="/ombud/:companyId" element={<DeklarationsombudSlide onNext={() => navigate('/dokument-setup')} onBack={() => navigate('/bank')} />} />
            <Route path="/dokument-setup/:companyId" element={<DocumentSetupSlide onNext={() => navigate('/welcome')} onBack={() => navigate('/ombud')} />} />
            
            {/* Final onboarding slides 28-30 */}
            <Route path="/welcome/:companyId" element={<WelcomeSlide onNext={() => navigate('/rutiner')} onBack={() => navigate('/dokument-setup')} />} />
            <Route path="/rutiner/:companyId" element={<OngoingRoutinesSlide onNext={() => navigate('/support')} onBack={() => navigate('/welcome')} />} />
            <Route path="/support/:companyId" element={<SupportSlide onNext={() => navigate('/')} onBack={() => navigate('/rutiner')} />} />
            
            {/* Settings, Admin & Error pages */}
            {/* OLD: <Route path="/settings" element={<SettingsPage />} /> */}
            <Route path="/settings" element={<SettingsPageV2 />} />
            <Route path="/settings-v2" element={<SettingsPageV2 />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* KOMMENTERAD: Fraud Detection Demo innehåller verklig klientdata som inte får exponeras publikt */}
            {/* <Route path="/demo/fraud-detection" element={<FraudDetectionDemo />} /> */}
            
            {/* Verifikationsvy i separat fönster */}
            <Route path="/voucher/:voucherId" element={<VoucherDetailPage />} />
            
            {/* Bokföringsanalys OLD (Mock Fortnox-stil rapporter) - Bevaras för referens */}
            <Route path="/accounting-review" element={<AccountingReviewPage />} />
            
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/server-error" element={<ServerErrorPage />} />
            
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-brand-50">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-brand-900">Sida: {location.pathname}</h1>
                  <p className="text-brand-700 mt-4">Denna slide är inte implementerad än</p>
                  <button 
                    onClick={() => navigate('/')} 
                    className="mt-4 bg-brand-600 text-white px-6 py-2 rounded-box"
                  >
                    Tillbaka till start
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </MainContent>
      </div>
      {renderPanel()}
    </div>
    </AgreementProvider>
  );
}
