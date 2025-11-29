import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/auth';
import { useParams } from 'react-router-dom';
import Icon from '../Shared/Icon';
import FileDropZone from '../Shared/FileDropZone';
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';

// Simple inline SVG icons for missing icons
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

const AlertCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FileText = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Upload = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export default function ForetagsdokumentationSlide({ onNext, onBack }) {
  const { companyId } = useParams();
  
  const QUESTIONS_CONFIG = {
    entireForm: { type: 'object', required: false }
  };

  const { formData: savedFormData, updateQuestion, pushToServer } = useQuestionnaireForm(
    'foretagsdokumentation',
    QUESTIONS_CONFIG
  );

  const [formData, setFormData] = useState(savedFormData?.entireForm?.formData || {
    registreringsbevis: null,
    arsredovisning: null
  });

  const [uploadStatus, setUploadStatus] = useState(savedFormData?.entireForm?.uploadStatus || {
    registreringsbevis: '',
    arsredovisning: ''
  });

  const [isDragging, setIsDragging] = useState({
    registreringsbevis: false,
    arsredovisning: false
  });

  const [parsedData, setParsedData] = useState(savedFormData?.entireForm?.parsedData || {
    registreringsbevis: null
  });
  
  const [uploadedFiles, setUploadedFiles] = useState(savedFormData?.entireForm?.uploadedFiles || {
    registreringsbevis: null,
    arsredovisning: null
  });
  
  const [isUploading, setIsUploading] = useState({
    registreringsbevis: false,
    arsredovisning: false
  });

  // Sync to questionnaire hook
  useEffect(() => {
    updateQuestion('entireForm', { formData, uploadStatus, parsedData, uploadedFiles });
  }, [formData, uploadStatus, parsedData, uploadedFiles]);

  // Fetch existing uploads from metadata.json
  useEffect(() => {
    const fetchExistingUploads = async () => {
      if (!orgnr) return;
      
      try {
        const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;
const response = await fetchWithAuth(
          `${API_BASE}/onboarding/${orgnr}/roaring-data`,
          {
            headers: {}
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          // Check if metadata has uploaded_documents section
          if (data.uploaded_documents) {
            setUploadedFiles({
              registreringsbevis: data.uploaded_documents.registreringsbevis || null,
              arsredovisning: data.uploaded_documents.arsredovisning || null
            });
          }
        }
      } catch (err) {
        console.warn('⚠️ Failed to fetch existing uploads:', err);
      }
    };
    
    fetchExistingUploads();
  }, [orgnr]);

  const handleFileSelect = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(field, file);
    }
  };

  const handleFile = async (field, file) => {
    // Validera filtyp (endast PDF)
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (fileExtension !== '.pdf') {
      setUploadStatus(prev => ({
        ...prev,
        [field]: '❌ Fel filtyp. Endast PDF-filer accepteras.'
      }));
      return;
    }

    // Validera filstorlek (max 10 MB)
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      setUploadStatus(prev => ({
        ...prev,
        [field]: '❌ Filen är för stor. Max 10 MB tillåts.'
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: file }));
    setUploadStatus(prev => ({
      ...prev,
      [field]: '🔄 Laddar upp...'
    }));
    setIsUploading(prev => ({ ...prev, [field]: true }));

    // Upload to backend
    try {
const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('document_type', field);
      
      const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;
      const response = await fetchWithAuth(
        `${API_BASE}/onboarding/${orgnr}/upload-document`,
        {
          method: 'POST',
          headers: {},
          body: formDataUpload
        }
      );
      
      if (!response.ok) {
        throw new Error('Uppladdning misslyckades');
      }
      
      const result = await response.json();
      
      setUploadedFiles(prev => ({
        ...prev,
        [field]: {
          filename: result.filename,
          size: result.file_size,
          uploaded_at: result.uploaded_at
        }
      }));
      
      setUploadStatus(prev => ({
        ...prev,
        [field]: `✅ Fil uppladdad: ${result.filename}`
      }));
      
      // Om det är registreringsbevis, simulera parsing (i produktion: OCR/PDF-parsing)
      if (field === 'registreringsbevis') {
        simulateParsing();
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      setUploadStatus(prev => ({
        ...prev,
        [field]: '❌ Uppladdning misslyckades: ' + err.message
      }));
    } finally {
      setIsUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const simulateParsing = () => {
    // Simulera parsing av registreringsbevis
    // I produktion: Skicka fil till backend för OCR/PDF-parsing
    setTimeout(() => {
      setParsedData(prev => ({
        ...prev,
        registreringsbevis: {
          orgNr: '559170-7772',
          foretagsnamn: 'RS MekService AB',
          adress: 'Bangårdsgatan 26 lgh 1102, 831 57 ÖSTERSUND',
          styrelse: [
            { namn: 'Rafal Andrzej Szalasny', personnummer: '841103-4112', roll: 'VD' },
            { namn: 'Jarmila Anna Szalasny', personnummer: '791210-3988', roll: 'Suppleant' }
          ],
          registreringsdatum: '2018-09-10'
        }
      }));
    }, 1500);
  };

  const handleDragOver = (field, e) => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (field) => {
    setIsDragging(prev => ({ ...prev, [field]: false }));
  };

  const handleDrop = (field, e) => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, [field]: false }));

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(field, file);
    }
  };

  const handleRemoveFile = (field) => {
    setFormData(prev => ({ ...prev, [field]: null }));
    setUploadStatus(prev => ({ ...prev, [field]: '' }));
    if (field === 'registreringsbevis') {
      setParsedData(prev => ({ ...prev, registreringsbevis: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.registreringsbevis) {
      setUploadStatus(prev => ({
        ...prev,
        registreringsbevis: '❌ Registreringsbevis är obligatoriskt.'
      }));
      return;
    }

    await pushToServer();
    onNext({
      ...formData,
      parsedData: parsedData.registreringsbevis
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-page-title text-brand-900 mb-3">
            Företagsdokumentation
          </h2>
          <p className="text-lg text-gray-600">
            För att verifiera företagets existens och styrelsemedlemmar behöver vi grundläggande företagsdokumentation.
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-box">
          <div className="flex items-start gap-3">
            <AlertCircleIcon className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Varför behövs detta?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Registreringsbevis</strong> verifierar företagets existens hos Bolagsverket</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Ger oss <strong>styrelsemedlemmar</strong> och <strong>VD</strong> med personnummer (för närstående-kontroll)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Bekräftar företagets <strong>registrerade adress</strong> (för leveransadress-validering)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Standard vid onboarding</strong> enligt PTL 2 kap. 7 § (kundkännedom)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Registreringsbevis Upload */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
              <Icon name="document" className="w-5 h-5 text-brand-600" />
              Registreringsbevis från Bolagsverket
              <span className="text-red-600">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Ladda upp aktuellt registreringsbevis (max 3 månader gammalt). Detta verifierar företagets existens och ger oss styrelseuppgifter.
            </p>

            {!formData.registreringsbevis && !uploadedFiles.registreringsbevis ? (
              <FileDropZone
                accept=".pdf"
                maxSize="10 MB"
                isDragging={isDragging.registreringsbevis}
                onDragOver={(e) => handleDragOver('registreringsbevis', e)}
                onDragLeave={() => handleDragLeave('registreringsbevis')}
                onDrop={(e) => handleDrop('registreringsbevis', e)}
                onChange={(e) => handleFileSelect('registreringsbevis', e)}
                inputId="registreringsbevis-upload"
                variant="compact"
              />
            ) : uploadedFiles.registreringsbevis ? (
              <div className="border-2 border-green-200 bg-green-50 rounded-box p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{uploadedFiles.registreringsbevis.filename}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFiles.registreringsbevis.size / 1024).toFixed(0)} KB • Uppladdad {new Date(uploadedFiles.registreringsbevis.uploaded_at).toLocaleString('sv-SE')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : formData.registreringsbevis ? (
              <div className="border-2 border-green-200 bg-green-50 rounded-box p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-brand-600" />
                    <div>
                      <p className="font-medium text-gray-900">{formData.registreringsbevis.name}</p>
                      <p className="text-sm text-gray-500">
                        {(formData.registreringsbevis.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('registreringsbevis')}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Parsed Data Display */}
                {parsedData.registreringsbevis && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Extraherad information:
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Organisationsnummer:</span>
                        <p className="font-medium text-gray-900">{parsedData.registreringsbevis.orgNr}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Företagsnamn:</span>
                        <p className="font-medium text-gray-900">{parsedData.registreringsbevis.foretagsnamn}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Adress:</span>
                        <p className="font-medium text-gray-900">{parsedData.registreringsbevis.adress}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Styrelse:</span>
                        <ul className="mt-2 space-y-1">
                          {parsedData.registreringsbevis.styrelse.map((medlem, idx) => (
                            <li key={idx} className="font-medium text-gray-900">
                              {medlem.namn} ({medlem.personnummer}) - {medlem.roll}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {uploadStatus.registreringsbevis && !formData.registreringsbevis && (
              <p className="mt-2 text-sm text-red-600">{uploadStatus.registreringsbevis}</p>
            )}
          </div>

          {/* Årsredovisning Upload (Optional) */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              Senaste årsredovisning
              <span className="text-sm text-gray-500 font-normal">(valfritt)</span>
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Om tillgänglig, hjälper detta oss bedöma företagets ekonomiska hälsa.
            </p>

            {!formData.arsredovisning && !uploadedFiles.arsredovisning ? (
              <FileDropZone
                accept=".pdf"
                maxSize="10 MB"
                isDragging={isDragging.arsredovisning}
                onDragOver={(e) => handleDragOver('arsredovisning', e)}
                onDragLeave={() => handleDragLeave('arsredovisning')}
                onDrop={(e) => handleDrop('arsredovisning', e)}
                onChange={(e) => handleFileSelect('arsredovisning', e)}
                inputId="arsredovisning-upload"
                variant="compact"
              />
            ) : uploadedFiles.arsredovisning ? (
              <div className="border-2 border-green-200 bg-green-50 rounded-box p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{uploadedFiles.arsredovisning.filename}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFiles.arsredovisning.size / 1024).toFixed(0)} KB • Uppladdad {new Date(uploadedFiles.arsredovisning.uploaded_at).toLocaleString('sv-SE')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : formData.arsredovisning ? (
              <div className="border-2 border-gray-200 bg-gray-50 rounded-box p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{formData.arsredovisning.name}</p>
                      <p className="text-sm text-gray-500">
                        {(formData.arsredovisning.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('arsredovisning')}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : null}

            {uploadStatus.arsredovisning && !formData.arsredovisning && (
              <p className="mt-2 text-sm text-gray-600">{uploadStatus.arsredovisning}</p>
            )}
          </div>

          {/* What happens with the documents */}
          <div className="mb-8 p-6 bg-brand-50 border border-brand-200 rounded-box">
            <h3 className="font-semibold text-brand-900 mb-2">
              Vad händer med dokumenten?
            </h3>
            <p className="text-sm text-brand-800 mb-3">
              Vi <strong>parsar automatiskt</strong> registreringsbeviset med OCR/PDF-parsing för att extrahera:
            </p>
            <ul className="space-y-1 text-sm text-brand-800">
              <li>• Organisationsnummer → Verifieras mot Bolagsverket GRATIS API</li>
              <li>• Företagsnamn → Verifieras mot angivna uppgifter</li>
              <li>• Styrelseledamöter + personnummer → Används för närstående-kontroll (SPAR/Roaring.io)</li>
              <li>• Registrerad adress → Används för leveransadress-validering i bokföringsanalysen</li>
            </ul>
          </div>

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
              disabled={!formData.registreringsbevis}
            >
              Nästa →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
