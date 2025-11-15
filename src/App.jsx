import { useState, useEffect } from 'react';
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

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePanel, setActivePanel] = useState(null);
  
  // Persistent login state via localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  // Demo mode - doesn't require real login
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('isDemoMode') === 'true';
  });
  
  const [isPEP, setIsPEP] = useState(false);
  const [roaringData, setRoaringData] = useState(null);
  const [formData, setFormData] = useState({
    organisationsnummer: '',
    personnummer: ''
  });

  // 🔧 DEV MODE: Auto-login för utveckling
  useEffect(() => {
    const autoLogin = async () => {
      // Kontrollera om vi redan har en token
      const existingToken = localStorage.getItem('jwt_token');
      if (existingToken) {
        console.log('🔧 DEV: JWT token finns redan');
        return;
      }

      try {
        // Anropa dev-login endpoint
        const response = await fetch('http://localhost:8000/api/dev-login', {
          method: 'POST'
        });
        
        if (response.ok) {
          const result = await response.json();
          localStorage.setItem('jwt_token', result.token);
          localStorage.setItem('temp_orgnr', result.user.client_orgnr);
          console.log('🔧 DEV MODE: Auto-login lyckades!', result.message);
          console.log('   User:', result.user.user_id);
          console.log('   Orgnr:', result.user.client_orgnr);
        }
      } catch (error) {
        console.warn('⚠ Dev-login misslyckades:', error.message);
      }
    };

    // Kör endast i development
    if (import.meta.env.DEV) {
      autoLogin();
    }
  }, []);

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
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/uppdragsval');  // Start directly with service selection
  };

  const handleDemo = () => {
    setIsDemoMode(true);
    localStorage.setItem('isDemoMode', 'true');
    navigate('/uppdragsval');  // Start directly with service selection
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
      <div className="flex h-screen overflow-hidden">
        {!isSettingsPage && !isVoucherPage && (
          <Sidebar 
            currentPath={location.pathname}
            onNavigate={(path) => navigate(path)}
            hasRoaringData={roaringData !== null}
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
                  console.log('📋 onboardingId:', data.onboardingId);
                  navigate('/riskfragor');
                }} 
              />
            } />
            <Route path="/riskfragor" element={
              <RiskFragorSlide 
                onNext={() => {
                  // Navigate to steg 2 instead of skipping directly to identitetskontroll
                  navigate('/riskfragor/steg2');
                }}
                onSkipPEP={() => {
                  setIsPEP(false);
                  navigate('/riskfragor/steg2');
                }}
                onFormDataChange={(data) => {
                  setFormData({
                    organisationsnummer: data.organisationsnummer || '',
                    personnummer: data.personnummer || ''
                  });
                }}
              />
            } />
            <Route path="/riskfragor/steg2" element={
              <RiskFragorSteg2Slide 
                onNext={(data) => {
                  // Save steg2 data
                  console.log('Steg 2 data:', data);
                }}
              />
            } />
            <Route path="/riskfragor/steg3" element={
              <RiskFragorSteg3Slide 
                onNext={(data) => {
                  // Save steg3 data
                  console.log('Steg 3 data:', data);
                }}
              />
            } />
            <Route path="/riskfragor/steg4" element={
              <RiskFragorSteg4Slide 
                onNext={(data) => {
                  // Save steg4 data
                  console.log('Steg 4 data:', data);
                  setIsPEP(true); // Could be based on data from steg1
                }}
              />
            } />
            <Route path="/identitetskontroll" element={<IdentitetskontrollSlide onNext={() => navigate('/kontrolltabell')} />} />
            <Route path="/kontrolltabell" element={<KontrolltabellSlide onNext={() => navigate('/verksamhet')} />} />
            
            {/* Border test page (development only) */}
            <Route path="/border-test" element={<BorderTestSlide />} />
            
            {/* Result slides */}
            <Route path="/verksamhet" element={<VerksamhetSlide onNext={() => navigate('/agarstruktur')} onBack={() => navigate('/kontrolltabell')} />} />
            <Route path="/agarstruktur" element={<AgarstrukturSlide onNext={() => navigate('/styrelse')} onBack={() => navigate('/verksamhet')} />} />
            <Route path="/styrelse" element={<StyrelseSlide onNext={() => navigate('/riskindikatorer')} onBack={() => navigate('/agarstruktur')} />} />
            <Route path="/riskindikatorer" element={<RiskindikatorerSlide onNext={() => navigate('/ovrigadata')} onBack={() => navigate('/styrelse')} />} />
            <Route path="/ovrigadata" element={<OvrigaDataSlide onNext={() => navigate('/dokumentation')} onBack={() => navigate('/riskindikatorer')} />} />
            
            {/* Företagsdokumentation */}
            <Route path="/dokumentation" element={<ForetagsdokumentationSlide onNext={() => navigate('/underlag')} onBack={() => navigate('/ovrigadata')} />} />
            
            {/* Bokföringsunderlag */}
            <Route path="/underlag" element={<BokforingsunderlagSlide onNext={() => navigate('/bokforing')} onBack={() => navigate('/dokumentation')} />} />
            
            {/* Bokföringsdata (Skattekonto OAuth) */}
            <Route path="/bokforing" element={<BokforingDataSlide onNext={() => navigate('/likviditet')} onBack={() => navigate('/underlag')} />} />
            
            {/* Ekonomisk rådgivning (slides 11-14) */}
            <Route path="/likviditet" element={<LikviditetsanalysSlide onNext={() => navigate('/omsattning')} onBack={() => navigate('/bokforing')} />} />
            <Route path="/omsattning" element={<OmsattningsanalysSlide onNext={() => navigate('/resultat')} onBack={() => navigate('/likviditet')} />} />
            <Route path="/resultat" element={<ResultatanalysSlide onNext={() => navigate('/bransch')} onBack={() => navigate('/omsattning')} />} />
            <Route path="/bransch" element={<BranschjamforelseSlide onNext={() => navigate('/bokanalys')} onBack={() => navigate('/resultat')} />} />
            
            {/* Djupgranskning och beslut (slides 15-20) */}
            <Route path="/bokanalys" element={<AccountingAnalysisWizard />} />
            <Route path="/penningflodes" element={<PenningflodesanalysSlide onNext={() => navigate('/riskbedomning')} onBack={() => navigate('/bokanalys')} />} />
            <Route path="/riskbedomning" element={<RiskbedomningSlide onNext={() => navigate('/skyldigheter')} onBack={() => navigate('/penningflodes')} />} />
            <Route path="/skyldigheter" element={<SkyldigheterSlide onNext={() => navigate('/avtal')} onBack={() => navigate('/riskbedomning')} />} />
            <Route path="/avtal" element={<AvtalSlide onNext={() => navigate('/dokument')} onBack={() => navigate('/skyldigheter')} />} />
            <Route path="/dokument" element={<DocumentDeliverySlide onNext={() => navigate('/fortnox')} onBack={() => navigate('/avtal')} />} />
            
            {/* Post-kontrakt setup - slides 24-30 */}
            <Route path="/fortnox" element={<FortnoxPackageSlide onNext={() => navigate('/bank')} onBack={() => navigate('/dokument')} />} />
            <Route path="/bank" element={<BankRattigheterSlide onNext={() => navigate('/ombud')} onBack={() => navigate('/fortnox')} />} />
            <Route path="/ombud" element={<DeklarationsombudSlide onNext={() => navigate('/dokument-setup')} onBack={() => navigate('/bank')} />} />
            <Route path="/dokument-setup" element={<DocumentSetupSlide onNext={() => navigate('/welcome')} onBack={() => navigate('/ombud')} />} />
            
            {/* Final onboarding slides 28-30 */}
            <Route path="/welcome" element={<WelcomeSlide onNext={() => navigate('/rutiner')} onBack={() => navigate('/dokument-setup')} />} />
            <Route path="/rutiner" element={<OngoingRoutinesSlide onNext={() => navigate('/support')} onBack={() => navigate('/welcome')} />} />
            <Route path="/support" element={<SupportSlide onNext={() => navigate('/')} onBack={() => navigate('/rutiner')} />} />
            
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
