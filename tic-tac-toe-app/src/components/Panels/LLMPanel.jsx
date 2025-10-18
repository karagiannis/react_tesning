import { useState } from 'react';

export default function LLMPanel({ onClose, appData }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hej! Jag är din AI-assistent. Jag har tillgång till all data som samlats in hittills och kan svara på frågor om onboarding-processen.',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: input }]);

    // Simulate AI response (i produktion: koppla till FastAPI/LLM)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Du frågade: "${input}". I produktion kommer jag att analysera den insamlade datan och ge ett relevant svar baserat på penningtvättslagen och riskbedömningen.`,
        },
      ]);
    }, 1000);

    setInput('');
  };

  return (
    <aside className="fixed right-0 top-0 h-full w-96 bg-white border-l border-amber-300 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-orange-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <h2 className="text-lg font-bold">LLM Assistent</h2>
        </div>
        <button
          onClick={onClose}
          className="text-2xl hover:bg-orange-700 rounded px-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-amber-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-amber-300 text-amber-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-amber-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ställ en fråga om onboarding-processen..."
            className="flex-1 px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Skicka
          </button>
        </div>
        <p className="text-xs text-amber-600 mt-2">
          LLM får all insamlad data via JSON-paket för att ge relevanta svar.
        </p>
      </div>
    </aside>
  );
}
