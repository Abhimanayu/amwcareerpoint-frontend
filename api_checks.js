const https = require('https');

const urls = [
  'https://gray-alligator-918491.hostingersite.com/api/v1/countries?limit=500',
  'https://gray-alligator-918491.hostingersite.com/api/v1/universities?limit=500',
  'https://gray-alligator-918491.hostingersite.com/api/v1/blogs?limit=50',
  'https://gray-alligator-918491.hostingersite.com/api/v1/home-settings',
  'https://gray-alligator-918491.hostingersite.com/api/v1/about-settings',
  'https://gray-alligator-918491.hostingersite.com/api/v1/countries/mbbs-in-russia',
  'https://gray-alligator-918491.hostingersite.com/api/v1/countries/mbbs-in-kyrgyzstan',
  'https://gray-alligator-918491.hostingersite.com/api/v1/universities?country=kyrgyzstan&sort=sortOrder',
  'https://gray-alligator-918491.hostingersite.com/api/v1/universities?search=Avicenna&limit=10&sort=sortOrder'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        
        const info = {
          url,
          status: res.statusCode,
          keys: json ? Object.keys(json) : [],
          listLength: null,
          total: null
        };

        if (json) {
          const listKeys = ['data', 'items', 'results', 'countries', 'universities', 'blogs'];
          for (const key of listKeys) {
            if (Array.isArray(json[key])) {
              info.listLength = json[key].length;
              break;
            }
          }
          if (info.listLength === null && Array.isArray(json)) {
            info.listLength = json.length;
          }

          const countKeys = ['total', 'count', 'totalCount', 'pagination'];
          for (const key of countKeys) {
            if (json[key] !== undefined) {
              info.total = typeof json[key] === 'object' ? JSON.stringify(json[key]) : json[key];
              break;
            }
          }
        }
        resolve(info);
      });
    }).on('error', (err) => {
      resolve({ url, status: 'Error', error: err.message });
    });
  });
}

async function run() {
  for (const url of urls) {
    const info = await checkUrl(url);
    console.log(JSON.stringify(info));
  }
}

run();
