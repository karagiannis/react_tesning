import { useState } from 'react';

export default function SupportPanel({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isScreenShareActive, setIsScreenShareActive] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: input, timestamp: new Date() }]);
    setInput('');

    // Simulate support response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'support',
          content: 'Tack för ditt meddelande! En supportmedarbetare kommer att svara inom kort.',
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const handleScreenShare = () => {
    setIsScreenShareActive(!isScreenShareActive);
    // I produktion: implementera screen sharing med WebRTC eller liknande
  };

  return (
    <aside className="fixed right-0 top-0 h-full w-96 bg-white border-l border-amber-300 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-orange-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">❓</span>
          <h2 className="text-lg font-bold">Support</h2>
        </div>
        <button
          onClick={onClose}
          className="text-2xl hover:bg-orange-700 rounded px-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Support Actions */}
      <div className="p-4 bg-amber-50 border-b border-amber-300 space-y-3">
        <button
          onClick={handleScreenShare}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            isScreenShareActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
        >
          <span className="text-xl">🖥️</span>
          {isScreenShareActive ? 'Avsluta skärmdelning' : 'Supportinloggning (skärmdelning)'}
        </button>

        {isScreenShareActive && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
            <p className="text-xs text-yellow-800 font-semibold">
              ⚠️ Skärmdelning aktiv - Supportteamet kan se din skärm
            </p>
          </div>
        )}

        <div className="bg-white border border-amber-300 rounded-lg p-3">
          <h3 className="font-semibold text-amber-900 text-sm mb-2">📞 Kontakta oss</h3>
          <p className="text-xs text-amber-700">
            E-post: support@celestial.se<br />
            Telefon: 08-123 45 67<br />
            Öppettider: Mån-Fre 08:00-17:00
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
        {messages.length === 0 ? (
          <div className="text-center text-amber-600 text-sm mt-8">
            <p className="mb-2">👋 Välkommen till support!</p>
            <p>Skriv ditt meddelande nedan eller starta skärmdelning.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-orange-600 text-white'
                    : 'bg-amber-100 border border-amber-300 text-amber-900'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString('sv-SE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-amber-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Skriv ditt meddelande..."
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
          Support svarar vanligtvis inom 5 minuter under kontorstid.
        </p>
      </div>
    </aside>
  );
}
