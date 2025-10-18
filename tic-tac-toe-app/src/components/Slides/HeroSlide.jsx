export default function HeroSlide({ onNext, onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-8">
      {/* Knappar uppe till höger */}
      <div className="absolute top-8 right-8 flex gap-3">
        <button 
          onClick={onLogin}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
        >
          Logga in
        </button>
        <button 
          onClick={onRegister}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
        >
          Registrera
        </button>
      </div>

      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-amber-900 mb-6 text-center">
          Onboardingstöd för redovisnings- och revisionsbyråer
        </h1>
        <div className="space-y-4 text-amber-800">
          <div className="bg-amber-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Snabb översikt</h2>
            <p className="text-sm">Automatisera riskbedömningen och säkerställ att onboarding sker enligt penningtvättslagen.</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">AI-stöd och kontroll</h2>
            <p className="text-sm">Vår AI samlar automatiskt information och upptäcker layering.</p>
          </div>
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <button 
            onClick={onNext}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Börja onboarding nu
          </button>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
            Se demo
          </button>
        </div>
      </div>
    </div>
  );
}