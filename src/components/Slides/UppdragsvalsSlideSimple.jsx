import { useState } from 'react';

export default function UppdragsvalsSlideSimple({ onNext }) {
  const [test, setTest] = useState('Hello from Simple Slide!');
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Uppdragsval (Simple Version)</h1>
        <p className="text-lg mb-4">{test}</p>
        <button 
          onClick={() => setTest('Button clicked!')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Button
        </button>
        <button 
          onClick={onNext}
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
