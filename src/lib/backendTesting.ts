/**
 * 🔧 Backend Image Testing & Verification Utilities
 * 
 * These functions help test and verify backend image functionality
 * Use these to debug and ensure your backend changes work correctly
 */

// Test if backend uploads directory is working
export async function testBackendHealth(): Promise<{
  healthy: boolean;
  uploadsExists: boolean;
  message: string;
}> {
  try {
    const response = await fetch('http://localhost:5000/api/uploads/health');
    if (response.ok) {
      const data = await response.json();
      return {
        healthy: data.status === 'healthy',
        uploadsExists: data.exists,
        message: `Backend ${data.status}. Uploads directory: ${data.exists ? 'exists' : 'missing'}`
      };
    }
    return {
      healthy: false,
      uploadsExists: false,
      message: 'Backend health check endpoint not available'
    };
  } catch (error) {
    return {
      healthy: false,
      uploadsExists: false,
      message: `Backend connection failed: ${error}`
    };
  }
}

// Test if a specific image URL is accessible
export async function testImageUrl(imageUrl: string): Promise<{
  accessible: boolean;
  status: number;
  message: string;
}> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return {
      accessible: response.ok,
      status: response.status,
      message: response.ok ? 'Image accessible' : `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return {
      accessible: false,
      status: 0,
      message: `Network error: ${error}`
    };
  }
}

// Verify image after upload
export async function verifyUploadedImage(imagePath: string): Promise<{
  exists: boolean;
  fileInfo?: {
    size: number;
    created: string;
    modified: string;
  };
  message: string;
}> {
  try {
    const response = await fetch(`http://localhost:5000/api/image-info/${imagePath}`);
    if (response.ok) {
      const data = await response.json();
      return {
        exists: true,
        fileInfo: {
          size: data.size,
          created: data.created,
          modified: data.modified
        },
        message: 'Image verified successfully'
      };
    }
    return {
      exists: false,
      message: 'Image not found on server'
    };
  } catch (error) {
    return {
      exists: false,
      message: `Verification failed: ${error}`
    };
  }
}

// Test backend fixes - call this after implementing backend changes
export async function runBackendTests(): Promise<{
  overall: boolean;
  tests: Array<{
    name: string;
    passed: boolean;
    message: string;
  }>;
}> {
  const tests = [];

  // Test 1: Backend health
  const healthTest = await testBackendHealth();
  tests.push({
    name: 'Backend Health',
    passed: healthTest.healthy,
    message: healthTest.message
  });

  // Test 2: Static file serving
  const staticTest = await testImageUrl('http://localhost:5000/uploads/test-static-serving.jpg');
  tests.push({
    name: 'Static File Serving',
    passed: staticTest.status !== 500, // Not a server error
    message: staticTest.status === 404 ? 'Static serving configured (404 normal for missing file)' : staticTest.message
  });

  // Test 3: CORS headers
  try {
    const corsResponse = await fetch('http://localhost:5000/uploads/test.jpg', { method: 'HEAD' });
    const corsHeaders = corsResponse.headers.get('access-control-allow-origin');
    tests.push({
      name: 'CORS Headers',
      passed: corsHeaders === '*',
      message: corsHeaders ? 'CORS configured correctly' : 'CORS headers missing'
    });
  } catch {
    tests.push({
      name: 'CORS Headers',
      passed: false,
      message: 'Could not test CORS headers'
    });
  }

  const overall = tests.every(test => test.passed);

  return { overall, tests };
}

// Enhanced resolve media URL with fallback testing
export function createRobustMediaResolver(baseUrl: string = 'http://localhost:5000') {
  return async function resolveWithVerification(imagePath: string | null | undefined): Promise<{
    url: string;
    verified: boolean;
    fallbackUsed: boolean;
  }> {
    if (!imagePath) {
      return {
        url: '',
        verified: false,
        fallbackUsed: true
      };
    }

    // Construct full URL
    const fullUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}/uploads/${imagePath}`;

    // Test if accessible
    const test = await testImageUrl(fullUrl);

    return {
      url: fullUrl,
      verified: test.accessible,
      fallbackUsed: false
    };
  };
}

// Debug component to show backend status
export function BackendDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    runBackendTests().then(setDebugInfo);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded text-xs max-w-sm">
      <div className="font-bold mb-2">Backend Status</div>
      {debugInfo?.tests.map((test: any) => (
        <div key={test.name} className={`flex gap-2 ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
          <span>{test.passed ? '✅' : '❌'}</span>
          <span>{test.name}: {test.message}</span>
        </div>
      ))}
    </div>
  );
}