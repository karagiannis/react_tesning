import { useState } from 'react';
import Icon from '../Shared/Icon';
import FileDropZone from '../Shared/FileDropZone';

// Inline SVG icons
const CloudIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AlertCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export default function BokforingsunderlagSlide({ onNext, onBack }) {
  const [uploadMode, setUploadMode] = useState(null); // 'cloud' | 'local'
  const [cloudProvider, setCloudProvider] = useState(null); // 'google' | 'dropbox' | 'onedrive'
  
  const [formData, setFormData] = useState({
    // Bank information (endast för kontoutdrag-matchning)
    bankInfo: '', // Kombinerat fält för bankgiro/plusgiro
    
    // Files (5 categories - underlag for löpande bokföring)
    kontoutdrag: [],
    leverantorsfakturor: [],
    kundfakturor: [],
    kvitton: [],
    momsrapporter: [],
    arsredovisningar: [], // För manuell uppladdning av saknade (endast juridiska personer)
    
    // Cloud link
    cloudLink: '',
  });

  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Mock fraud detection results (för demo)
  const [fraudAlerts, setFraudAlerts] = useState([]);

  const handleFileSelect = (category, e) => {
    const files = Array.from(e.target.files);
    handleFiles(category, files);
  };

  const handleFiles = (category, files) => {
    // Validera filtyper
    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.sie', '.xml'];
    const invalidFiles = files.filter(file => {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      return !validExtensions.includes(ext);
    });

    if (invalidFiles.length > 0) {
      setUploadStatus(`❌ Ogiltiga filtyper: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // Validera total storlek (max 500 MB för lokal upload)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxSize = 500 * 1024 * 1024; // 500 MB
    
    if (totalSize > maxSize) {
      setUploadStatus(`❌ Totalt ${(totalSize / 1024 / 1024).toFixed(0)} MB. Max 500 MB. Använd molnlänk istället.`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [category]: [...prev[category], ...files]
    }));

    setUploadStatus(`✅ ${files.length} filer uppladdade till ${getCategoryName(category)}`);

    // Simulera fraud detection för leverantörsfakturor
    if (category === 'leverantorsfakturor') {
      simulateFraudDetection(files);
    }
  };

  const simulateFraudDetection = (files) => {
    // Mock: Hitta motorcykeldäck-fakturor för demo
    const mockAlerts = files
      .filter(f => f.name.toLowerCase().includes('adtyres') || f.name.toLowerCase().includes('dack'))
      .map(file => ({
        file: file.name,
        riskScore: 85,
        flags: [
          'Inkongruent leverantör (motorcykeldäck till blästringsföretag)',
          'Utländsk leverantör (Andorra med omvänd moms)',
          'Leverans till privatadress (VD:s hemadress)',
          'Personlig mottagare (Rafal Szalasny)',
        ]
      }));

    if (mockAlerts.length > 0) {
      setFraudAlerts(prev => [...prev, ...mockAlerts]);
    }
  };

  const handleRemoveFile = (category, index) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (category, e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(category, files);
  };

  const handleCloudProviderClick = (provider) => {
    setCloudProvider(provider);
    setUploadStatus(`🔗 Ansluter till ${provider === 'google' ? 'Google Drive' : provider === 'dropbox' ? 'Dropbox' : 'OneDrive'}...`);
    
    // Mock OAuth flow
    setTimeout(() => {
      setUploadStatus(`✅ Ansluten till ${provider === 'google' ? 'Google Drive' : provider === 'dropbox' ? 'Dropbox' : 'OneDrive'}. Ange mapp-länk nedan.`);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validera att minst något är uppladdat
    const hasFiles = Object.keys(formData)
      .filter(key => Array.isArray(formData[key]))
      .some(key => formData[key].length > 0);
    
    const hasCloudLink = formData.cloudLink.trim() !== '';

    if (!hasFiles && !hasCloudLink) {
      setUploadStatus('❌ Ladda upp filer eller ange molnlänk.');
      return;
    }

    // Validera bankinformation (frivilligt här - IBAN hanteras på nästa slide)
    // Om bankInfo finns, kontrollera format
    if (formData.bankInfo && !/^\d{3,4}-\d{4,7}$/.test(formData.bankInfo)) {
      setUploadStatus('❌ Ogiltigt format för bankgiro/plusgiro. Exempel: 123-4567 eller 12345-6');
      return;
    }

    onNext({
      ...formData,
      fraudAlerts,
      uploadMode,
      cloudProvider,
    });
  };

  const getCategoryName = (category) => {
    const names = {
      kontoutdrag: 'Kontoutdrag',
      leverantorsfakturor: 'Leverantörsfakturor',
      kundfakturor: 'Kundfakturor',
      kvitton: 'Kvitton',
      momsrapporter: 'Momsrapporter',
      arsredovisningar: 'Årsredovisningar (saknade år, endast juridiska personer)',
    };
    return names[category] || category;
  };

  const getTotalFileCount = () => {
    return Object.keys(formData)
      .filter(key => Array.isArray(formData[key]))
      .reduce((sum, key) => sum + formData[key].length, 0);
  };

  const getTotalFileSize = () => {
    const totalBytes = Object.keys(formData)
      .filter(key => Array.isArray(formData[key]))
      .reduce((sum, key) => {
        return sum + formData[key].reduce((s, file) => s + file.size, 0);
      }, 0);
    
    return (totalBytes / 1024 / 1024).toFixed(1); // MB
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-page-title text-brand-900 mb-3">
            Bokföringsunderlag
          </h2>
          <p className="text-lg text-gray-600">
            För att genomföra fraud detection och PTL-analys behöver vi tillgång till ditt fullständiga bokföringsunderlag från 2018-01-01 till idag.
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-box">
          <div className="flex items-start gap-3">
            <AlertCircleIcon className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Vilka dokument behövs?</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  <li>• <strong>Kontoutdrag</strong> (obligatoriskt)</li>
                  <li>• <strong>Leverantörsfakturor</strong> (obligatoriskt)</li>
                  <li>• <strong>Kundfakturor</strong> (obligatoriskt)</li>
                </ul>
                <ul className="space-y-1">
                  <li>• <strong>Kvitton</strong> (kontantkostnader)</li>
                  <li>• <strong>Momsrapporter</strong> (XML eller PDF från Skatteverket)</li>
                  <li>• <strong>Årsredovisningar (saknade)</strong> (PDF - vi hämtar digitalt insända från 2021 via Bolagsverket API, endast juridiska personer)</li>
                </ul>
              </div>
              <p className="mt-3 text-xs text-gray-600 italic">
                OBS: SIE-filer, IBAN-nummer och inkomstdeklarationer (K10/INK2) hämtas programvarumässigt via Skatteverket på nästa slide (Bokföringsdata).
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Upload Mode Selection */}
          {!uploadMode && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Välj uppladdningsmetod</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Cloud Option */}
                <button
                  type="button"
                  onClick={() => setUploadMode('cloud')}
                  className="p-6 border-2 border-gray-300 rounded-box hover:border-brand-500 hover:bg-brand-50 transition-all text-left group"
                >
                  <CloudIcon className="w-12 h-12 text-brand-600 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-900">
                    Molnmapp (rekommenderas)
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Dela din Google Drive-, Dropbox- eller OneDrive-mapp med oss. Bäst för stora datamängder (&gt;500 MB).
                  </p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Rekommenderat för 7 års data
                  </span>
                </button>

                {/* Local Upload Option */}
                <button
                  type="button"
                  onClick={() => setUploadMode('local')}
                  className="p-6 border-2 border-gray-300 rounded-box hover:border-brand-500 hover:bg-brand-50 transition-all text-left group"
                >
                  <UploadIcon className="w-12 h-12 text-gray-600 mb-4 group-hover:text-brand-600" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-900">
                    Ladda upp filer
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Välj filer från din dator. Fungerar bra för mindre datamängder (max 500 MB totalt).
                  </p>
                  <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 text-xs font-medium rounded-full">
                    Bra för demo & mindre mängder
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Cloud Upload Mode */}
          {uploadMode === 'cloud' && (
            <div className="mb-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Anslut till molntjänst</h3>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode(null);
                    setCloudProvider(null);
                    setFormData(prev => ({ ...prev, cloudLink: '' }));
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Byt metod
                </button>
              </div>

              {/* Cloud Provider Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handleCloudProviderClick('google')}
                  className={`p-4 border-2 rounded-box transition-all ${
                    cloudProvider === 'google'
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-300 hover:border-brand-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CloudIcon className="w-8 h-8 text-brand-600" />
                    <span className="font-medium text-gray-900">Google Drive</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCloudProviderClick('dropbox')}
                  className={`p-4 border-2 rounded-box transition-all ${
                    cloudProvider === 'dropbox'
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-300 hover:border-brand-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CloudIcon className="w-8 h-8 text-brand-600" />
                    <span className="font-medium text-gray-900">Dropbox</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCloudProviderClick('onedrive')}
                  className={`p-4 border-2 rounded-box transition-all ${
                    cloudProvider === 'onedrive'
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-300 hover:border-brand-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CloudIcon className="w-8 h-8 text-brand-500" />
                    <span className="font-medium text-gray-900">OneDrive</span>
                  </div>
                </button>
              </div>

              {/* Cloud Link Input */}
              {cloudProvider && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Dela mapp-länk från {cloudProvider === 'google' ? 'Google Drive' : cloudProvider === 'dropbox' ? 'Dropbox' : 'OneDrive'}
                  </label>
                  <input
                    type="url"
                    value={formData.cloudLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, cloudLink: e.target.value }))}
                    placeholder={`https://${cloudProvider === 'google' ? 'drive.google.com' : cloudProvider === 'dropbox' ? 'dropbox.com' : 'onedrive.live.com'}/...`}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-box focus:border-brand-500 focus:outline-none"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Högerklicka på mappen → Dela → Kopiera länk → Klistra in här
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Local Upload Mode */}
          {uploadMode === 'local' && (
            <div className="mb-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Ladda upp filer</h3>
                <button
                  type="button"
                  onClick={() => setUploadMode(null)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Byt metod
                </button>
              </div>

              {/* File Upload Categories - 5 categories (underlag för löpande bokföring) */}
              {['kontoutdrag', 'leverantorsfakturor', 'kundfakturor', 'kvitton', 'momsrapporter', 'arsredovisningar'].map(category => (
                <div key={category} className="border-2 border-gray-200 rounded-box p-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    {getCategoryName(category)}
                    {['kontoutdrag', 'leverantorsfakturor', 'kundfakturor'].includes(category) && (
                      <span className="text-red-600 ml-1">*</span>
                    )}
                  </label>

                  {/* Drag & Drop Zone */}
                  <FileDropZone
                    accept=".pdf,.png,.jpg,.jpeg,.sie,.xml"
                    maxSize="20 MB"
                    isDragging={isDragging}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(category, e)}
                    onChange={(e) => handleFileSelect(category, e)}
                    inputId={`${category}-upload`}
                    variant="compact"
                  />

                  {/* Uploaded Files List */}
                  {formData[category].length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData[category].map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-box">
                          <div className="flex items-center gap-3">
                            <FileIcon className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(category, idx)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Upload Summary */}
              {getTotalFileCount() > 0 && (
                <div className="p-4 bg-brand-50 border border-brand-200 rounded-box">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brand-900">
                        Totalt: {getTotalFileCount()} filer
                      </p>
                      <p className="text-xs text-brand-700">
                        {getTotalFileSize()} MB av 500 MB
                      </p>
                    </div>
                    {parseFloat(getTotalFileSize()) > 500 && (
                      <span className="text-xs text-red-600 font-medium">
                        ⚠️ För stor, använd molnlänk
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bank Information (Optional - IBAN hanteras på nästa slide) */}
          {uploadMode && (
            <div className="mb-8 p-6 bg-white border-2 border-gray-200 rounded-box">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bankinformation (valfritt)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Om du har bankgiro eller plusgiro, ange det här. Används för att matcha kontoutdrag mot transaktioner. 
                <strong className="text-brand-700"> IBAN-nummer anges på nästa slide (Bokföringsdata).</strong>
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bankgiro / Plusgiro
                </label>
                <input
                  type="text"
                  value={formData.bankInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankInfo: e.target.value }))}
                  placeholder="123-4567 eller 12345-6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-box focus:border-brand-500 focus:outline-none"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Format: 123-4567 (bankgiro) eller 12345-6 (plusgiro)
                </p>
              </div>
            </div>
          )}

          {/* Fraud Alerts (Demo) */}
          {fraudAlerts.length > 0 && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-box">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    ⚠️ Fraud Detection: {fraudAlerts.length} varning(ar) hittade
                  </h3>
                  <p className="text-sm text-red-800">
                    Följande transaktioner flaggades för manuell granskning:
                  </p>
                </div>
              </div>

              {fraudAlerts.map((alert, idx) => (
                <div key={idx} className="mt-4 p-4 bg-white border border-red-300 rounded-box">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{alert.file}</p>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                      Risk: {alert.riskScore}/100
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {alert.flags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Status Message */}
          {uploadStatus && (
            <div className={`mb-6 p-4 rounded-box ${
              uploadStatus.startsWith('✅') || uploadStatus.startsWith('🔗')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}>
              <p className="text-sm font-medium">{uploadStatus}</p>
            </div>
          )}

          {/* What happens next */}
          {uploadMode && (
            <div className="mb-8 p-6 bg-brand-50 border border-brand-200 rounded-box">
              <h3 className="font-semibold text-brand-900 mb-2">
                Vad händer härnäst?
              </h3>
              <p className="text-sm text-brand-800 mb-3">
                Efter uppladdning kör vi automatisk analys:
              </p>
              <ul className="space-y-1 text-sm text-brand-800">
                <li>• <strong>OCR/Parsing:</strong> Extraherar fakturadata från PDF/PNG/JPG</li>
                <li>• <strong>Verksamhetskongruens:</strong> Matchar leverantörer mot SNI-kod</li>
                <li>• <strong>Privatkonsumtion:</strong> Flaggar ICA/H&M/Willys-kvitton</li>
                <li>• <strong>Konkurskontroll:</strong> Verifierar leverantörer mot Bolagsverket</li>
                <li>• <strong>Cirkulära betalningar:</strong> Upptäcker misstänkta mönster</li>
                <li>• <strong>Leveransadress:</strong> Jämför mot registrerad företagsadress</li>
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-box hover:bg-gray-50 transition-colors font-medium"
            >
              ← Tillbaka
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-brand-600 text-white rounded-box hover:bg-brand-700 transition-colors font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!uploadMode}
            >
              Fortsätt till ekonomisk analys →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
