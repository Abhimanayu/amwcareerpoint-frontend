'use client';

import { useState, useEffect } from 'react';

interface BackendTest {
  name: string;
  passed: boolean;
  message: string;
  critical?: boolean;
}

interface TestResults {
  overall: boolean;
  tests: BackendTest[];
}

export function BackendTestPanel() {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [testing, setTesting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const runTests = async () => {
    setTesting(true);
    const tests: BackendTest[] = [];

    // Test 1: Backend health endpoint
    try {
      const healthResponse = await fetch('http://localhost:5000/api/uploads/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        tests.push({
          name: 'Backend Health',
          passed: healthData.status === 'healthy',
          message: `Status: ${healthData.status}, Uploads directory: ${healthData.exists ? 'exists' : 'missing'}`,
          critical: false
        });
      } else {
        tests.push({
          name: 'Backend Health',
          passed: false,
          message: '❌ Health endpoint missing - ADD HEALTH CHECK to backend',
          critical: true
        });
      }
    } catch {
      tests.push({
        name: 'Backend Health',
        passed: false,
        message: '❌ Backend connection failed - CHECK if backend is running on port 5000',
        critical: true
      });
    }

    // Test 2: Static file serving (MOST CRITICAL)
    try {
      const staticResponse = await fetch('http://localhost:5000/uploads/test-static.jpg', { method: 'HEAD' });
      const isConfigured = staticResponse.status !== 500; // 404 is fine, 500 means not configured
      tests.push({
        name: 'Static File Serving',
        passed: isConfigured,
        message: isConfigured ? '✅ Static serving configured' : '❌ ADD express.static to backend - CRITICAL FIX NEEDED',
        critical: !isConfigured
      });
    } catch {
      tests.push({
        name: 'Static File Serving',
        passed: false,
        message: '❌ Static file serving NOT CONFIGURED - ADD express.static middleware to backend',
        critical: true
      });
    }

    // Test 3: Test actual uploaded image
    try {
      const testImageResponse = await fetch('http://localhost:5000/uploads/countries/1776321431530-293098.jpg', { method: 'HEAD' });
      tests.push({
        name: 'Uploaded Image Access',
        passed: testImageResponse.ok,
        message: testImageResponse.ok ? '✅ Uploaded images accessible' : `❌ Uploaded image returns ${testImageResponse.status} - FILES NOT PERSISTING`,
        critical: !testImageResponse.ok
      });
    } catch {
      tests.push({
        name: 'Uploaded Image Access',
        passed: false,
        message: '❌ Cannot access uploaded images - BACKEND STATIC SERVING BROKEN',
        critical: true
      });
    }

    // Test 4: CORS headers
    try {
      const corsResponse = await fetch('http://localhost:5000/uploads/test.jpg', { method: 'HEAD' });
      const corsHeaders = corsResponse.headers.get('access-control-allow-origin');
      tests.push({
        name: 'CORS Headers',
        passed: corsHeaders === '*',
        message: corsHeaders ? `✅ CORS: ${corsHeaders}` : '⚠️ CORS headers missing - may cause issues',
        critical: false
      });
    } catch {
      tests.push({
        name: 'CORS Headers',
        passed: false,
        message: '⚠️ Could not check CORS headers',
        critical: false
      });
    }

    const overall = tests.filter(t => t.critical).every(test => test.passed);
    setTestResults({ overall, tests });
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  if (!testResults) return null;

  const criticalIssues = testResults.tests.filter(t => t.critical && !t.passed);

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-md z-50">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer border-b"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className={`font-bold ${criticalIssues.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
          🔧 Backend Status {criticalIssues.length > 0 && `(${criticalIssues.length} issues)`}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); runTests(); }}
            disabled={testing}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Re-test'}
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
          {criticalIssues.length > 0 && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <div className="font-bold text-red-800 mb-1">🚨 CRITICAL FIXES NEEDED:</div>
              <div className="text-red-700">
                Images won't work until you add these to your backend:
                <br />• <code>app.use('/uploads', express.static('uploads'))</code>
                <br />• Health check endpoint
              </div>
            </div>
          )}
          
          {testResults.tests.map((test, index) => (
            <div key={index} className="text-xs border-l-2 pl-2 py-1" style={{ borderColor: test.passed ? '#10B981' : test.critical ? '#EF4444' : '#F59E0B' }}>
              <div className={`font-medium ${test.passed ? 'text-green-700' : test.critical ? 'text-red-700' : 'text-yellow-700'}`}>
                {test.passed ? '✅' : test.critical ? '🚨' : '⚠️'} {test.name}
              </div>
              <div className="text-gray-600 mt-0.5 font-mono text-[10px]">{test.message}</div>
            </div>
          ))}

          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
            <div className="font-medium text-blue-800 mb-1">📋 Quick Fix Instructions:</div>
            <div className="text-blue-700">
              1. Open your backend <code>app.js</code> or <code>server.js</code>
              <br />2. Add: <code>app.use('/uploads', express.static('uploads'))</code>
              <br />3. Restart backend server
              <br />4. Test again - images should work!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}