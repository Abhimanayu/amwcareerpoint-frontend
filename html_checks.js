const https = require('https');

const pages = [
  'https://amwcareerpoint.com/',
  'https://amwcareerpoint.com/countries/mbbs-in-russia',
  'https://amwcareerpoint.com/universities/avicenna-international-medical-university',
  'https://amwcareerpoint.com/blogs',
  'https://amwcareerpoint.com/blogs/mbbs-in-russia-for-indian-students-2026'
];

async function checkHtml(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const titleMatch = data.match(/<title>([^<]*)<\/title>/i);
        const canonMatch = data.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i) ||
                           data.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
        const faqMatches = (data.match(/FAQPage/g) || []).length;
        
        resolve({
          url,
          status: res.statusCode,
          title: titleMatch ? titleMatch[1] : null,
          canonical: canonMatch ? canonMatch[1] : null,
          faqCount: faqMatches
        });
      });
    }).on('error', (err) => {
      resolve({ url, status: 'Error', error: err.message });
    });
  });
}

async function run() {
  for (const url of pages) {
    const info = await checkHtml(url);
    if (info.status === 404 && info.url.includes('/universities/')) {
        // We might want to find a valid university link if this fails, 
        // but let's see what the sitemap says first.
    }
    console.log(JSON.stringify(info));
  }
}

run();
