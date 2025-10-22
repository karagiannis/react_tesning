export default function HeroSlide({ onNext, onLogin, onRegister, onDemo }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
      {/* Knappar uppe till höger - responsiva */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 flex flex-col sm:flex-row gap-2 sm:gap-3 z-50">
        <button 
          onClick={onLogin}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all shadow-lg text-sm sm:text-base whitespace-nowrap"
        >
          Logga in
        </button>
        <button 
          onClick={onRegister}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all shadow-lg text-sm sm:text-base whitespace-nowrap"
        >
          Registrera
        </button>
      </div>

      <div className="max-w-4xl w-full bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 mt-20 sm:mt-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-900 mb-4 sm:mb-6 text-center leading-tight">
          Onboardingstöd för redovisnings- och revisionsbyråer
        </h1>
        <div className="space-y-3 sm:space-y-4 text-brand-800">
          <div className="bg-brand-50 p-3 sm:p-4 rounded-lg">
            <h2 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Snabb översikt</h2>
            <p className="text-xs sm:text-sm leading-relaxed">Automatisera riskbedömningen och säkerställ att onboarding sker enligt penningtvättslagen.</p>
          </div>
          <div className="bg-brand-50 p-3 sm:p-4 rounded-lg">
            <h2 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Automatisk datahämtning</h2>
            <p className="text-xs sm:text-sm leading-relaxed">Systemet samlar automatiskt företagsinformation och identifierar riskindikatorer.</p>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button 
            onClick={onNext}
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base w-full sm:w-auto"
          >
            Börja onboarding nu
          </button>
          <button 
            onClick={onDemo}
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all border-2 border-brand-600 text-sm sm:text-base w-full sm:w-auto"
          >
            Se demo
          </button>
        </div>
      </div>
    </div>
  );
}