/**
 * LLMPanel.jsx - DUMB COMPONENT (Tic-Tac-Toe Pattern)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARKITEKTUR: Ren presentation - får all kontext via props från AuthenticatedApp
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * PROPS:
 *   - current_slide: string        - Vilken slide användaren är på ('riskfragor', etc.)
 *   - formData: object            - All insamlad data { riskfragor: {...}, ... }
 *   - companyInfo: object         - { company_name, orgnr }
 *   - onClose: () => void         - Stäng panelen
 *   - onSendMessage: (msg) => Promise<response>  - För framtida backend-LLM
 * 
 * POSITIONERING:
 *   - top-16 = börjar under header (64px)
 *   - h-[calc(100vh-4rem)] = fyller resten av höjden
 *   - z-40 = under dropdown-menyer (z-50) men över innehåll
 */

import { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

// Slide-specifika hjälptexter för kontextmedvetna svar
const SLIDE_CONTEXT = {
  uppdragsval: {
    name: 'Uppdragsval',
    description: 'Välj vilket företag du ska onboarda',
    ptlTips: 'Kontrollera alltid att företaget finns registrerat hos Bolagsverket innan du påbörjar onboarding.',
  },
  riskfragor: {
    name: 'Riskfrågor (Steg 1)',
    description: 'Samla in grundläggande risk- och kundkännedomsinformation',
    ptlTips: 'Enligt PTL 2 kap. ska du alltid utreda om kunden har kopplingar till högriskländer eller PEP.',
  },
  'riskfragor-steg2': {
    name: 'Riskfrågor (Steg 2)',
    description: 'Fördjupad riskbedömning efter externa API-anrop',
    ptlTips: 'Granska resultaten från Skatteverket och Bolagsverket noggrant för att identifiera avvikelser.',
  },
  // Lägg till fler slides här...
};

export default function LLMPanel({ 
  current_slide = 'unknown',
  formData = {},
  companyInfo = {},
  onClose,
  onSendMessage // Framtida: för backend-LLM anrop
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Bygg kontextmedvetet välkomstmeddelande
  useEffect(() => {
    const slideInfo = SLIDE_CONTEXT[current_slide] || { name: current_slide, description: '', ptlTips: '' };
    const company_name = companyInfo?.company_name || 'valt företag';
    
    const welcomeMessage = {
      role: 'assistant',
      content: `Hej! Jag är din PTL-assistent. 🏛️

Du arbetar just nu med **${company_name}** på steget **${slideInfo.name}**.

${slideInfo.ptlTips ? `💡 **Tips:** ${slideInfo.ptlTips}` : ''}

Jag har tillgång till all data du samlat in hittills och kan hjälpa dig med:
• Tolkning av penningtvättslagen (PTL)
• Riskbedömning av kunden
• Förklaring av fälten på detta steg

Ställ gärna en fråga!`,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
  }, [current_slide, companyInfo?.company_name]);

  // Auto-scroll till senaste meddelande
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generera kontextmedvetet mocksvar
  const generateMockResponse = (userQuestion) => {
    const slideData = formData[current_slide] || {};
    const slideInfo = SLIDE_CONTEXT[current_slide] || {};
    
    // Kolla om användaren frågar om specifika fält
    if (userQuestion.toLowerCase().includes('utländska') || userQuestion.toLowerCase().includes('leverantör')) {
      const hasUtlandska = slideData.utlandskaPartners;
      if (hasUtlandska === 'ja') {
        return `Jag ser att kunden har utländska leverantörer. Enligt PTL 2:3 ska du:

1. **Identifiera länderna** - Vilka länder är leverantörerna från?
2. **Kontrollera mot högriskländer** - EU:s lista över högriskländer för penningtvätt
3. **Dokumentera** - Spara information om affärsrelationens syfte

Behöver du hjälp med att bedöma risknivån?`;
      } else if (hasUtlandska === 'nej') {
        return `Bra, kunden har inga utländska leverantörer. Detta sänker generellt risknivån.

Dock bör du fortfarande verifiera att:
• Kunden inte har planer på utlandsexpansion
• Inga utländska betalningar förekommer

Vill du veta mer om andra riskfaktorer?`;
      }
    }
    
    if (userQuestion.toLowerCase().includes('pep')) {
      const isPEP = slideData.isPEP;
      return `**PEP (Politiskt Exponerad Person)**

${isPEP ? '⚠️ Kunden har angett PEP-koppling!' : 'Kunden har inte angett PEP-koppling.'}

Enligt PTL 3 kap. 10-14 §§ ska du vid PEP:
1. Inhämta godkännande från behörig beslutsfattare
2. Vidta skärpta åtgärder för kundkännedom
3. Genomföra skärpt fortlöpande uppföljning

Vill du ha en checklista för PEP-hantering?`;
    }

    // Generiskt svar med kontext
    return `Tack för din fråga om "${userQuestion}".

**Nuvarande steg:** ${slideInfo.name || current_slide}
**Företag:** ${companyInfo?.company_name || 'Ej valt'}

Jag analyserar den data du samlat in hittills. I produktion kommer jag kunna ge mer specifika svar baserat på:
• Bolagsverkets data
• Skatteverkets uppgifter
• Riskberäkningar

Finns det något specifikt om PTL eller riskbedömning du undrar över?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulera "typing" delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // I framtiden: använd onSendMessage för backend-anrop
    // const response = await onSendMessage?.(input);
    
    const response = generateMockResponse(input);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }]);
    
    setIsTyping(false);
  };

  return (
    <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white border-l border-gray-200 shadow-2xl flex flex-col z-40">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm">PTL Assistent</h2>
            <p className="text-xs text-brand-200">AI-driven rådgivning</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          title="Stäng panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Context bar - visar nuvarande slide */}
      <div className="px-4 py-2 bg-brand-50 border-b border-brand-100 text-xs">
        <span className="text-brand-600 font-medium">Kontext:</span>{' '}
        <span className="text-brand-800">{SLIDE_CONTEXT[current_slide]?.name || current_slide}</span>
        {companyInfo?.company_name && (
          <span className="text-brand-600"> • {companyInfo.company_name}</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-brand-200' : 'text-gray-400'}`}>
                {msg.timestamp?.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Fråga om PTL, risk, eller detta steg..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 Prova: "Vad innebär PEP?" eller "Utländska leverantörer?"
        </p>
      </div>
    </aside>
  );
}
