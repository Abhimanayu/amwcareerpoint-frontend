'use client';

import { useState } from 'react';
import { resolveMediaUrl } from '@/lib/utils';

// Debug component to test image URL resolution and backend connectivity
export function ImageDebugPanel() {
  const [testUrl, setTestUrl] = useState('/uploads/countries/russia-flag.png');
  const [testResult, setTestResult] = useState('');
  const [backendTest, setBackendTest] = useState('');

  const testImageUrl = () => {
    console.log('Testing URL resolution:');
    console.log('Input:', testUrl);
    const resolved = resolveMediaUrl(testUrl);
    console.log('Resolved:', resolved);
    setTestResult(resolved);
  };

  const testBackendConnection = async () => {
    const urls = [
      'http://localhost:5000',
      'http://localhost:5002', 
      'http://localhost:5002/uploads/countries/russia-flag.png'
    ];

    let results = '';
    for (const url of urls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        results += `${url}: ${response.status} ${response.statusText}\n`;
      } catch (error) {
        results += `${url}: Error - ${error}\n`;
      }
    }
    setBackendTest(results);
  };

  const checkEnvironmentVars = () => {
    console.log('Environment variables:');
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('Current origin:', window.location.origin);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[600px] overflow-auto bg-white border-2 border-red-500 rounded-lg p-4 z-50 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-red-600">🔍 Image Debug Panel</h3>
        <button 
          onClick={() => document.getElementById('debug-panel')?.remove()}
          className="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Test URL:</label>
          <input 
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
            placeholder="/uploads/..."
          />
          <button 
            onClick={testImageUrl}
            className="mt-1 bg-blue-500 text-white px-3 py-1 rounded text-xs"
          >
            Test URL Resolution
          </button>
          {testResult && (
            <div className="mt-1 p-2 bg-gray-100 rounded">
              <strong>Resolved:</strong> {testResult}
            </div>
          )}
        </div>
        
        <div>
          <button 
            onClick={testBackendConnection}
            className="bg-green-500 text-white px-3 py-1 rounded text-xs"
          >
            Test Backend Connection
          </button>
          {backendTest && (
            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              {backendTest}
            </pre>
          )}
        </div>
        
        <div className="bg-yellow-100 p-2 rounded text-xs">
          <strong>🚨 Common Issues:</strong>
          <ul className="mt-1 space-y-1 text-xs">
            <li>• Backend not serving static files from /uploads</li>
            <li>• Missing CORS headers for images</li> 
            <li>• Incorrect file paths in database</li>
            <li>• Port mismatch (5000 vs 5002)</li>
          </ul>
        </div>
        
        <div className="bg-yellow-100 p-2 rounded text-xs">
          <strong>🚨 Common Issues:</strong>
          <ul className="mt-1 space-y-1 text-xs">
            <li>• Backend not serving static files from /uploads</li>
            <li>• Missing CORS headers for images</li> 
            <li>• Incorrect file paths in database</li>
            <li>• Port mismatch (5000 vs 5002)</li>
          </ul>
        </div>
        
        <div>
          <button 
            onClick={checkEnvironmentVars}
            className="bg-purple-500 text-white px-3 py-1 rounded text-xs"
          >
            Check Environment (Console)
          </button>
        </div>
        
        <div className="border-t pt-2">
          <strong>Current URLs being tested:</strong>
          <div className="mt-1 space-y-1">
            <div>API: {process.env.NEXT_PUBLIC_API_URL}</div>
            <div>Fallback: http://localhost:5000/api/v1</div>
          </div>
        </div>
      </div>
    </div>
  );
}