import { useState } from 'react';
import HeroSlide from './components/Slides/HeroSlide';
import LoginSlide from './components/Slides/LoginSlide';
import RegisterSlide from './components/Slides/RegisterSlide';
import VerifySlide from './components/Slides/VerifySlide';
import RiskFragorSlide from './components/Slides/RiskFragorSlide';
import IdentitetskontrollSlide from './components/Slides/IdentitetskontrollSlide';
import KontrolltabellSlide from './components/Slides/KontrolltabellSlide';
import PEPSlide from './components/Slides/PEPSlide';
import ResultSlidesContainer from './components/Slides/ResultSlides/ResultSlidesContainer';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import MainContent from './components/Layout/MainContent';
import LLMPanel from './components/Panels/LLMPanel';
import DocumentationPanel from './components/Panels/DocumentationPanel';
import SupportPanel from './components/Panels/SupportPanel';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState('hero');
  const [activePanel, setActivePanel] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPEP, setIsPEP] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentSlide('intro');
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 'hero':
        return <HeroSlide 
          onNext={() => setCurrentSlide('login')} 
          onLogin={() => setCurrentSlide('login')}
          onRegister={() => setCurrentSlide('register')}
        />;
      case 'login':
        return <LoginSlide onNext={handleLogin} onRegister={() => setCurrentSlide('register')} />;
      case 'register':
        return <RegisterSlide onNext={() => setCurrentSlide('verify')} />;
      case 'verify':
        return <VerifySlide onNext={handleLogin} />;
      case 'intro':
        return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-8">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-10">
              <h1 className="text-3xl font-bold text-amber-900 mb-6">Inledning och bakgrund</h1>
              <div className="text-amber-800 space-y-4">
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
                onClick={() => setCurrentSlide('riskFragor')}
                className="w-full mt-8 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all"
              >
                Nästa
              </button>
            </div>
          </div>
        );
      case 'riskFragor':
        return <RiskFragorSlide 
          onNext={() => {
            setIsPEP(true);
            setCurrentSlide('identitetskontroll');
          }}
          onSkipPEP={() => {
            setIsPEP(false);
            setCurrentSlide('identitetskontroll');
          }}
        />;
      case 'identitetskontroll':
        return <IdentitetskontrollSlide onNext={() => setCurrentSlide('kontrolltabell')} />;
      case 'kontrolltabell':
        return <KontrolltabellSlide onNext={() => setCurrentSlide(isPEP ? 'pepFordjupning' : 'resultat')} />;
      case 'pepFordjupning':
        return <PEPSlide onNext={() => setCurrentSlide('resultat')} onBack={() => setCurrentSlide('kontrolltabell')} />;
      case 'resultat':
        return <ResultSlidesContainer 
          onNext={() => setCurrentSlide('ekonomiskRad')} 
          onBack={() => setCurrentSlide(isPEP ? 'pepFordjupning' : 'kontrolltabell')} 
        />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-amber-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-amber-900">State: {currentSlide}</h1>
              <p className="text-amber-700 mt-4">Denna slide är inte implementerad än</p>
              <button 
                onClick={() => setCurrentSlide('hero')} 
                className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg"
              >
                Tillbaka till start
              </button>
            </div>
          </div>
        );
    }
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

  // Show layout with sidebar and header only when logged in
  if (!isLoggedIn) {
    return <div className="app">{renderSlide()}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentSlide={currentSlide} onSlideChange={setCurrentSlide} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onPanelToggle={setActivePanel} />
        <MainContent hasPanel={activePanel !== null}>
          {renderSlide()}
        </MainContent>
      </div>
      {renderPanel()}
    </div>
  );
}
