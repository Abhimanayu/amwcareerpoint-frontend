/**
 * Backend image testing and verification utilities.
 */

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
        uploadsExists: Boolean(data.exists),
        message: `Backend ${data.status}. Uploads directory: ${data.exists ? 'exists' : 'missing'}`,
      };
    }

    return {
      healthy: false,
      uploadsExists: false,
      message: 'Backend health check endpoint not available',
    };
  } catch (error) {
    return {
      healthy: false,
      uploadsExists: false,
      message: `Backend connection failed: ${String(error)}`,
    };
  }
}

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
      message: response.ok ? 'Image accessible' : `HTTP ${response.status}: ${response.statusText}`,
    };
  } catch (error) {
    return {
      accessible: false,
      status: 0,
      message: `Network error: ${String(error)}`,
    };
  }
}

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
          modified: data.modified,
        },
        message: 'Image verified successfully',
      };
    }

    return {
      exists: false,
      message: 'Image not found on server',
    };
  } catch (error) {
    return {
      exists: false,
      message: `Verification failed: ${String(error)}`,
    };
  }
}

export async function runBackendTests(): Promise<{
  overall: boolean;
  tests: Array<{
    name: string;
    passed: boolean;
    message: string;
  }>;
}> {
  const tests: Array<{ name: string; passed: boolean; message: string }> = [];

  const healthTest = await testBackendHealth();
  tests.push({
    name: 'Backend Health',
    passed: healthTest.healthy,
    message: healthTest.message,
  });

  const staticTest = await testImageUrl('http://localhost:5000/uploads/test-static-serving.jpg');
  tests.push({
    name: 'Static File Serving',
    passed: staticTest.status !== 500,
    message:
      staticTest.status === 404
        ? 'Static serving configured (404 is normal for a missing file).'
        : staticTest.message,
  });

  try {
    const corsResponse = await fetch('http://localhost:5000/uploads/test.jpg', { method: 'HEAD' });
    const corsHeader = corsResponse.headers.get('access-control-allow-origin');
    tests.push({
      name: 'CORS Headers',
      passed: corsHeader === '*',
      message: corsHeader ? 'CORS configured correctly' : 'CORS headers missing',
    });
  } catch {
    tests.push({
      name: 'CORS Headers',
      passed: false,
      message: 'Could not test CORS headers',
    });
  }

  return {
    overall: tests.every((test) => test.passed),
    tests,
  };
}

export function createRobustMediaResolver(baseUrl = 'http://localhost:5000') {
  return async function resolveWithVerification(
    imagePath: string | null | undefined
  ): Promise<{
    url: string;
    verified: boolean;
    fallbackUsed: boolean;
  }> {
    if (!imagePath) {
      return {
        url: '',
        verified: false,
        fallbackUsed: true,
      };
    }

    const fullUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}/uploads/${imagePath}`;
    const test = await testImageUrl(fullUrl);

    return {
      url: fullUrl,
      verified: test.accessible,
      fallbackUsed: false,
    };
  };
}
