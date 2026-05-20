import urllib.request
import urllib.parse
import json
import sys

def get_psi_data(url):
    base_url = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = {
        "url": url,
        "strategy": "mobile",
        "category": "performance"
    }
    query_string = urllib.parse.urlencode(params)
    full_url = f"{base_url}?{query_string}"
    
    try:
        with urllib.request.urlopen(full_url) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

url = "https://amwcareerpoint.com/"
data = get_psi_data(url)
if data:
    print(json.dumps(data.get('lighthouseResult', {}).get('categories', {}).get('performance', {}).get('score')))
else:
    print("FAILED")
