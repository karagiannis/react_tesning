import React from 'react';

export default function ResultsTabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'verksamhet', label: 'Verksamhet', icon: '📊' },
    { id: 'agarstruktur', label: 'Ägarstruktur', icon: '👥' },
    { id: 'styrelse', label: 'Styrelse', icon: '🏛️' },
    { id: 'riskindikatorer', label: 'Risk', icon: '🚦' },
    { id: 'ovrigaData', label: 'Övrigt', icon: '📁' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap
                border-b-2 transition-all duration-200
                ${activeTab === tab.id
                  ? 'border-brand-500 text-brand-600 bg-brand-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-xl mr-2">{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
