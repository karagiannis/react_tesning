import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HeroSlide from './components/Slides/HeroSlide';
import LoginSlide from './components/Slides/LoginSlide';
import RegisterSlide from './components/Slides/RegisterSlide';
import VerifySlide from './components/Slides/VerifySlide';
import RiskFragorSlide from './components/Slides/RiskFragorSlide';
import IdentitetskontrollSlide from './components/Slides/IdentitetskontrollSlide';
import KontrolltabellSlide from './components/Slides/KontrolltabellSlide';
import PEPSlide from './components/Slides/PEPSlide';
import VerksamhetSlide from './components/Slides/ResultSlides/VerksamhetSlide';
import AgarstrukturSlide from './components/Slides/ResultSlides/AgarstrukturSlide';
import StyrelseSlide from './components/Slides/ResultSlides/StyrelseSlide';
import RiskindikatorerSlide from './components/Slides/ResultSlides/RiskindikatorerSlide';
import OvrigaDataSlide from './components/Slides/ResultSlides/OvrigaDataSlide';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import MainContent from './components/Layout/MainContent';
import LLMPanel from './components/Panels/LLMPanel';
import DocumentationPanel from './components/Panels/DocumentationPanel';
import SupportPanel from './components/Panels/SupportPanel';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePanel, setActivePanel] = useState(null);
  
  // Persistent login state via localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
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
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/inledning');
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
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-10">
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
          className="w-full mt-8 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-all"
        >
          Nästa
        </button>
      </div>
    </div>
  );

  // Auth pages that should NEVER show sidebar/header (even when logged in)
  const authPages = ['/', '/login', '/register', '/verify'];
  const isAuthPage = authPages.includes(location.pathname);

  // Show auth layout (no sidebar) for auth pages OR when not logged in
  if (isAuthPage || !isLoggedIn) {
    return (
      <Routes>
        <Route path="/" element={<HeroSlide onNext={() => navigate('/login')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />} />
        <Route path="/login" element={<LoginSlide onNext={handleLogin} onRegister={() => navigate('/register')} />} />
        <Route path="/register" element={<RegisterSlide onNext={() => navigate('/verify')} />} />
        <Route path="/verify" element={<VerifySlide onNext={handleLogin} />} />
        {/* Redirect any other route to home if not logged in */}
        {!isLoggedIn && <Route path="*" element={<HeroSlide onNext={() => navigate('/login')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />} />}
      </Routes>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
        hasRoaringData={roaringData !== null}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onPanelToggle={setActivePanel} />
        <MainContent hasPanel={activePanel !== null}>
          <Routes>
            <Route path="/" element={<HeroSlide onNext={() => navigate('/login')} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />} />
            <Route path="/login" element={<LoginSlide onNext={handleLogin} onRegister={() => navigate('/register')} />} />
            <Route path="/register" element={<RegisterSlide onNext={() => navigate('/verify')} />} />
            <Route path="/verify" element={<VerifySlide onNext={handleLogin} />} />
            <Route path="/inledning" element={<IntroSlide />} />
            <Route path="/riskfragor" element={
              <RiskFragorSlide 
                onNext={() => {
                  setIsPEP(true);
                  navigate('/identitetskontroll');
                }}
                onSkipPEP={() => {
                  setIsPEP(false);
                  navigate('/identitetskontroll');
                }}
                onFormDataChange={(data) => {
                  setFormData({
                    organisationsnummer: data.organisationsnummer || '',
                    personnummer: data.personnummer || ''
                  });
                }}
              />
            } />
            <Route path="/identitetskontroll" element={<IdentitetskontrollSlide onNext={() => navigate('/kontrolltabell')} />} />
            <Route path="/kontrolltabell" element={<KontrolltabellSlide onNext={() => navigate(isPEP ? '/pepfordjupning' : '/verksamhet')} />} />
            <Route path="/pepfordjupning" element={<PEPSlide onNext={() => navigate('/verksamhet')} onBack={() => navigate('/kontrolltabell')} />} />
            
            {/* Result slides */}
            <Route path="/verksamhet" element={<VerksamhetSlide onNext={() => navigate('/agarstruktur')} onBack={() => navigate(isPEP ? '/pepfordjupning' : '/kontrolltabell')} />} />
            <Route path="/agarstruktur" element={<AgarstrukturSlide onNext={() => navigate('/styrelse')} onBack={() => navigate('/verksamhet')} />} />
            <Route path="/styrelse" element={<StyrelseSlide onNext={() => navigate('/riskindikatorer')} onBack={() => navigate('/agarstruktur')} />} />
            <Route path="/riskindikatorer" element={<RiskindikatorerSlide onNext={() => navigate('/ovrigadata')} onBack={() => navigate('/styrelse')} />} />
            <Route path="/ovrigadata" element={<OvrigaDataSlide onNext={() => navigate('/ekonomiskrad')} onBack={() => navigate('/riskindikatorer')} />} />
            
            {/* Not implemented yet */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-brand-50">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-brand-900">Sida: {location.pathname}</h1>
                  <p className="text-brand-700 mt-4">Denna slide är inte implementerad än</p>
                  <button 
                    onClick={() => navigate('/')} 
                    className="mt-4 bg-brand-600 text-white px-6 py-2 rounded-lg"
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
  );
}
