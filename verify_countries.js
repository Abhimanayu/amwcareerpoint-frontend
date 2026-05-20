const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse JSON: ' + e.message));
        }
      });
    }).on('error', reject);
  });
}

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', () => {
      https.get(url, (res) => {
        res.resume();
        resolve({ url, status: res.statusCode });
      }).on('error', (err) => {
        resolve({ url, status: 'error', error: err.message });
      });
    });
    req.end();
  });
}

async function run() {
  try {
    const response = await get('https://gray-alligator-918491.hostingersite.com/api/v1/countries?limit=500');
    let countries = [];
    if (response && response.data && Array.isArray(response.data)) {
        countries = response.data;
    } else if (Array.isArray(response)) {
        countries = response;
    }
    
    if (countries.length === 0) {
      console.log('No countries found');
      return;
    }

    // Process in batches to avoid overwhelming or being blocked
    const results = [];
    for (const c of countries) {
      const slug = c.slug || 'mbbs-in-' + c.name.toLowerCase().trim().replace(/\s+/g, '-');
      const url = 'https://amwcareerpoint.com/countries/' + slug;
      results.push(await checkUrl(url));
    }

    const failures = results.filter(r => r.status < 200 || r.status >= 400);
    
    console.log('Total countries checked:', results.length);
    console.log('Failures:', failures.length);
    
    failures.slice(0, 15).forEach(f => {
      console.log(f.url + ' -> ' + f.status + (f.error ? ' (' + f.error + ')' : ''));
    });
  } catch (err) {
    console.error('Script failed:', err.message);
  }
}
run();
