import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icon colors för olika transaktionstyper
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Mock data för penningflödesanalys
const mockMoneyFlowData = [
  {
    id: 1,
    type: 'client_address',
    name: 'Klientens Folkbokföringsadress',
    address: 'Storgatan 12, Stockholm',
    latLng: [59.3293, 18.0686], // Stockholm
    color: '#10b981', // green
    isClientHome: true,
    details: {
      orgNr: '556123-4567',
      verksamhet: 'Byggföretag AB'
    }
  },
  {
    id: 2,
    type: 'rent_residential',
    name: 'Hyresbetalning - MISSTÄNKT',
    address: 'Fastighets AB Bostäder, Göteborg',
    latLng: [57.7089, 11.9746], // Göteborg
    color: '#ef4444', // red - misstänkt privat bostad
    amount: 15000,
    frequency: 'Månatlig',
    bankgiro: '5402-1234',
    details: {
      orgNr: '556234-5678',
      verksamhet: 'Bostadsfastigheter - Enbart bostadsuthyrning',
      flagReason: 'Hyresbetalning till bostadsfastighet kan vara privat levnadskostnad',
      riskScore: 85
    }
  },
  {
    id: 3,
    type: 'rent_industrial',
    name: 'Hyresbetalning - OK',
    address: 'Industrifastigheter AB, Malmö',
    latLng: [55.6050, 13.0038], // Malmö
    color: '#10b981', // green - OK industrifastighet
    amount: 25000,
    frequency: 'Månatlig',
    bankgiro: '5402-5678',
    details: {
      orgNr: '556345-6789',
      verksamhet: 'Industrifastigheter och lokaler',
      flagReason: null,
      riskScore: 10
    }
  },
  {
    id: 4,
    type: 'supplier',
    name: 'Leverantör - Material',
    address: 'Byggematerial Nordic AB, Uppsala',
    latLng: [59.8586, 17.6389], // Uppsala
    color: '#3b82f6', // blue
    amount: 85000,
    frequency: 'Återkommande',
    bankgiro: '5402-9876',
    details: {
      orgNr: '556456-7890',
      verksamhet: 'Byggmaterial grossist',
      totalTransactions: 24,
      riskScore: 5
    }
  },
  {
    id: 5,
    type: 'supplier',
    name: 'Leverantör - Utrustning',
    address: 'Verktyg & Maskiner AB, Linköping',
    latLng: [58.4108, 15.6214], // Linköping
    color: '#3b82f6', // blue
    amount: 120000,
    frequency: 'Oregelbunden',
    bankgiro: '5402-5432',
    details: {
      orgNr: '556567-8901',
      verksamhet: 'Byggverktyg och maskiner',
      totalTransactions: 8,
      riskScore: 8
    }
  },
  {
    id: 6,
    type: 'customer',
    name: 'Kund - Projekt A',
    address: 'Fastighetsägaren AB, Örebro',
    latLng: [59.2753, 15.2134], // Örebro
    color: '#8b5cf6', // purple
    amount: 450000,
    frequency: 'Projektbaserad',
    bankgiro: '5402-1111',
    details: {
      orgNr: '556678-9012',
      verksamhet: 'Fastighetsförvaltning',
      totalTransactions: 3,
      riskScore: 3
    }
  },
  {
    id: 7,
    type: 'rent_residential',
    name: 'Hyresbetalning - MISSTÄNKT',
    address: 'Bostadsrättsförening Solhem, Västerås',
    latLng: [59.6099, 16.5448], // Västerås
    color: '#ef4444', // red
    amount: 8500,
    frequency: 'Månatlig',
    bankgiro: '5402-2222',
    details: {
      orgNr: '556789-0123',
      verksamhet: 'Bostadsrättsförening',
      flagReason: 'Bostadsrättsavgift - troligen privat bostad',
      riskScore: 92
    }
  },
  {
    id: 8,
    type: 'supplier',
    name: 'Leverantör - Transport',
    address: 'Frakt Express AB, Norrköping',
    latLng: [58.5877, 16.1924], // Norrköping
    color: '#3b82f6', // blue
    amount: 45000,
    frequency: 'Återkommande',
    bankgiro: '5402-3333',
    details: {
      orgNr: '556890-1234',
      verksamhet: 'Transport och logistik',
      totalTransactions: 36,
      riskScore: 6
    }
  },
  {
    id: 9,
    type: 'customer',
    name: 'Kund - Projekt B',
    address: 'Kommun Fastigheter, Helsingborg',
    latLng: [56.0465, 12.6945], // Helsingborg
    color: '#8b5cf6', // purple
    amount: 680000,
    frequency: 'Projektbaserad',
    bankgiro: '5402-4444',
    details: {
      orgNr: '556901-2345',
      verksamhet: 'Offentlig förvaltning',
      totalTransactions: 2,
      riskScore: 2
    }
  }
];

const MoneyFlowMapWidget = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const filteredData = filterType === 'all'
    ? mockMoneyFlowData
    : mockMoneyFlowData.filter(item => item.type === filterType);

  const getTypeLabel = (type) => {
    const labels = {
      client_address: 'Klientadress',
      rent_residential: 'Hyra - Bostad (RISK)',
      rent_industrial: 'Hyra - Industri',
      supplier: 'Leverantör',
      customer: 'Kund'
    };
    return labels[type] || type;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Penningflödesanalys - Geografisk karta</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Filtrera:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Alla transaktioner</option>
              <option value="client_address">Klientadress</option>
              <option value="rent_residential">Hyror - Bostad (RISK)</option>
              <option value="rent_industrial">Hyror - Industri</option>
              <option value="supplier">Leverantörer</option>
              <option value="customer">Kunder</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="text-gray-700">Klientadress / OK Hyra</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-gray-700">RISK - Privat hyra</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-brand-500 border-2 border-white"></div>
            <span className="text-gray-700">Leverantörer</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white"></div>
            <span className="text-gray-700">Kunder</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={[59.3293, 18.0686]} // Center on Stockholm
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {filteredData.map((item) => (
            <React.Fragment key={item.id}>
              {/* Marker */}
              <Marker
                position={item.latLng}
                icon={createCustomIcon(item.color)}
                eventHandlers={{
                  click: () => setSelectedMarker(item),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    <div className="font-bold text-gray-900 mb-2">{item.name}</div>
                    <div className="text-sm text-gray-600 mb-3">{item.address}</div>

                    {item.amount && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Belopp: </span>
                        <span className="text-sm text-gray-900 font-semibold">{formatAmount(item.amount)}</span>
                      </div>
                    )}

                    {item.frequency && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">Frekvens: {item.frequency}</span>
                      </div>
                    )}

                    {item.bankgiro && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">Bankgiro: {item.bankgiro}</span>
                      </div>
                    )}

                    {item.details && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs font-medium text-gray-700 mb-1">Mottagaruppgifter:</div>
                        <div className="text-xs text-gray-600">Org.nr: {item.details.orgNr}</div>
                        <div className="text-xs text-gray-600 mb-2">
                          Verksamhet: {item.details.verksamhet}
                        </div>

                        {item.details.flagReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <div className="text-xs font-bold text-red-800 mb-1">⚠️ VARNING</div>
                            <div className="text-xs text-red-700">{item.details.flagReason}</div>
                            <div className="text-xs text-red-800 font-semibold mt-1">
                              Risk: {item.details.riskScore}%
                            </div>
                          </div>
                        )}

                        {item.details.totalTransactions && (
                          <div className="text-xs text-gray-600 mt-2">
                            Antal transaktioner: {item.details.totalTransactions}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* Circle för visuell effekt på klientadressen */}
              {item.isClientHome && (
                <Circle
                  center={item.latLng}
                  radius={50000}
                  pathOptions={{
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {/* Selected Marker Details */}
      {selectedMarker && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">{selectedMarker.name}</h4>
              <p className="text-sm text-gray-600">{getTypeLabel(selectedMarker.type)}</p>
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Adress</div>
              <div className="text-sm text-gray-900">{selectedMarker.address}</div>
            </div>

            {selectedMarker.amount && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Belopp</div>
                <div className="text-lg font-bold text-gray-900">{formatAmount(selectedMarker.amount)}</div>
              </div>
            )}

            {selectedMarker.bankgiro && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Bankgiro</div>
                <div className="text-sm text-gray-900">{selectedMarker.bankgiro}</div>
              </div>
            )}

            {selectedMarker.frequency && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Frekvens</div>
                <div className="text-sm text-gray-900">{selectedMarker.frequency}</div>
              </div>
            )}
          </div>

          {selectedMarker.details && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-semibold text-gray-900 mb-3">Mottagaranalys</h5>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Organisationsnummer:</span>
                  <span className="text-gray-900 font-medium">{selectedMarker.details.orgNr}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verksamhetsbeskrivning:</span>
                  <span className="text-gray-900 font-medium">{selectedMarker.details.verksamhet}</span>
                </div>
                {selectedMarker.details.riskScore !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Riskpoäng:</span>
                    <span className={`font-bold ${
                      selectedMarker.details.riskScore >= 80 ? 'text-red-600' :
                      selectedMarker.details.riskScore >= 50 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {selectedMarker.details.riskScore}%
                    </span>
                  </div>
                )}
              </div>

              {selectedMarker.details.flagReason && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h6 className="text-sm font-bold text-red-800">Fraud Detection Varning</h6>
                      <p className="text-sm text-red-700 mt-1">{selectedMarker.details.flagReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Totalt analyserade platser</div>
          <div className="text-2xl font-bold text-gray-900">{filteredData.length}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg shadow p-4">
          <div className="text-sm text-red-700 mb-1">Misstänkta hyresbetalningar</div>
          <div className="text-2xl font-bold text-red-600">
            {filteredData.filter(d => d.type === 'rent_residential').length}
          </div>
        </div>
        <div className="bg-brand-50 border border-brand-200 rounded-lg shadow p-4">
          <div className="text-sm text-brand-700 mb-1">Leverantörer</div>
          <div className="text-2xl font-bold text-brand-600">
            {filteredData.filter(d => d.type === 'supplier').length}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg shadow p-4">
          <div className="text-sm text-purple-700 mb-1">Kunder</div>
          <div className="text-2xl font-bold text-purple-600">
            {filteredData.filter(d => d.type === 'customer').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyFlowMapWidget;
