export default function RegisterSlide({ onNext }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-brand-900 mb-6 text-center">
          Skapa konto
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">E-post</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="din.email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">Lösenord</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Minst 12 tecken, en siffra, en versal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">Bekräfta lösenord</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-start gap-2">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
            />
            <label className="text-sm text-brand-700">
              Jag bekräftar att jag är en människa (inte en bot)
            </label>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
        >
          Skapa konto
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-brand-700">eller</p>
          <button className="mt-3 w-full bg-white border border-brand-300 hover:bg-brand-50 text-brand-900 px-8 py-3 rounded-lg font-semibold transition-all">
            Logga in med Google
          </button>
        </div>
      </div>
    </div>
  );
}