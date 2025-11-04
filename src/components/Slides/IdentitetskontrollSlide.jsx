import { useState, useRef, useEffect } from 'react';

export default function IdentitetskontrollSlide({ onNext }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Ensure video plays when stream is set
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error('Video play error:', err);
      });
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      console.log('Camera stream received:', mediaStream);
      console.log('Video tracks:', mediaStream.getVideoTracks());
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Kunde inte starta kameran:', err);
      alert('Kunde inte få åtkomst till kameran. Kontrollera att du har gett behörighet i webbläsaren.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track);
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    console.log('Capturing photo...');
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert('Videon har inte laddats ännu. Vänta några sekunder och försök igen.');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Flip horizontally for mirror effect
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      console.log('Image captured, data length:', imageData.length);
      setCapturedImage(imageData);
      stopCamera();
    } else {
      console.error('Video or canvas ref not available');
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-brand-900 mb-6">
          Identitetskontroll och dokumentation
        </h1>

        <div className="text-sm text-brand-800 mb-6 space-y-3">
          <p>
            För att uppfylla penningtvättslagens krav måste identiteten kontrolleras och dokumenteras enligt följande:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Fysisk person:</strong> Pass, körkort eller annan identitetshandling med foto utfärdad av myndighet, 
              tillförlitlig elektronisk legitimation, eller dokument/uppgifter från oberoende och tillförlitliga källor.
            </li>
            <li>
              <strong>Juridisk person:</strong> Registreringsbevis eller motsvarande utdrag (ej äldre än en vecka), 
              samt uppgifter om företrädare.
            </li>
            <li>
              <strong>Ombud/företrädare:</strong> Fullmakt eller motsvarande behörighetshandling.
            </li>
          </ul>

          <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded mt-4">
            <p className="font-semibold text-brand-900 mb-2">📋 Dokumentationskrav:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Anteckna identitetshandlingens nummer och giltighetstid eller bevara kopia.</li>
              <li>Bevara kopia av elektronisk legitimation eller andra dokument som legat till grund för kontrollen.</li>
              <li>Kopia av registreringsbevis, fullmakt och andra relevanta handlingar ska sparas.</li>
              <li>All dokumentation ska sparas minst fem år och vara sökbar.</li>
            </ul>
          </div>
        </div>

        {/* Camera Section */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-brand-900 mb-4">
            Ta foto med webbkamera
          </h2>
          <p className="text-sm text-brand-700 mb-4">
            Håll upp ditt körkort eller ID-handling framför kameran så att både ditt ansikte och handlingen syns tydligt.
          </p>

          {!isCameraActive && !capturedImage && (
            <button
              onClick={startCamera}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              Starta webbkamera
            </button>
          )}

          {isCameraActive && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto max-h-[600px] object-cover"
                  style={{ transform: 'scaleX(-1)', display: 'block' }}
                  onLoadedMetadata={() => {
                    console.log('Video metadata loaded');
                    if (videoRef.current) {
                      console.log('Video ready, dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
                    }
                  }}
                  onCanPlay={() => console.log('Video can play')}
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Kamera aktiv
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={capturePhoto}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
                  >
                    📸 Ta foto
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured ID"
                  className="w-full h-auto"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={retakePhoto}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  🔄 Ta om foto
                </button>
                <button
                  onClick={() => {
                    // I produktion: skicka capturedImage till backend
                    alert('Foto sparat! (I produktion skickas detta till backend)');
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  ✅ Godkänn foto
                </button>
              </div>
            </div>
          )}

          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Legal Reference */}
        <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded mb-6">
          <p className="text-xs text-brand-800">
            <strong>Lagstöd:</strong> Länsstyrelsen Stockholms författningssamling 01FS 2024:20, 3 kap. 4 § och tabell 1 
            samt Lagen (2017:630) om åtgärder mot penningtvätt och finansiering av terrorism.
          </p>
        </div>

        {/* Navigation */}
        <button
          onClick={onNext}
          disabled={!capturedImage}
          className={`w-full px-8 py-3 rounded-lg font-semibold transition-all ${
            capturedImage
              ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Nästa
        </button>
        {!capturedImage && (
          <p className="text-center text-sm text-brand-600 mt-2">
            Du måste ta ett foto för att fortsätta
          </p>
        )}
      </div>
    </div>
  );
}
