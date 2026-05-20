import urllib.request
import urllib.parse
import json
import time
import sys

urls = [
    "https://amwcareerpoint.com/",
    "https://amwcareerpoint.com/countries/mbbs-in-russia",
    "https://amwcareerpoint.com/college/avicenna-international-medical-university",
    "https://amwcareerpoint.com/blogs/mbbs-in-abroad-2026"
]

def get_psi_data(url):
    base_url = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = {
        "url": url,
        "strategy": "mobile",
        "category": "performance"
    }
    query_string = urllib.parse.urlencode(params)
    full_url = f"{base_url}?{query_string}"
    
    print(f"Checking URL: {url}...", file=sys.stderr)
    try:
        with urllib.request.urlopen(full_url) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching {url}: {e}", file=sys.stderr)
        return None

def parse_data(data):
    if not data or "lighthouseResult" not in data:
        return "Failed to retrieve or parse data."
    
    lr = data["lighthouseResult"]
    score = lr["categories"]["performance"]["score"] * 100
    
    audits = lr.get("audits", {})
    lcp = audits.get("largest-contentful-paint", {}).get("displayValue", "N/A")
    cls = audits.get("cumulative-layout-shift", {}).get("displayValue", "N/A")
    tbt = audits.get("total-blocking-time", {}).get("displayValue", "N/A")
    
    # INP is often in field data or experimental. Let's look for it specifically.
    inp = audits.get("interactive-to-next-paint", {}).get("displayValue", "N/A")
    
    # Top 3 opportunities
    # Sort audits by potential savings if possible, or just look at performance category auditRefs
    opportunities = []
    audit_refs = lr["categories"]["performance"].get("auditRefs", [])
    
    # Filter for audits that are opportunities and have savings
    opp_list = []
    for ref in audit_refs:
        audit_id = ref.get("id")
        audit = audits.get(audit_id, {})
        if audit.get("details", {}).get("type") == "opportunity":
            savings = audit.get("details", {}).get("overallSavingsMs", 0)
            if savings > 0:
                opp_list.append((audit.get("title"), savings))
    
    # Sort by savings descending
    opp_list.sort(key=lambda x: x[1], reverse=True)
    top_opps = [item[0] for item in opp_list[:3]]

    result = {
        "Score": f"{score:.0f}",
        "LCP": lcp,
        "CLS": cls,
        "TBT": tbt,
        "INP": inp,
        "Opportunities": top_opps
    }
    return result

for url in urls:
    data = get_psi_data(url)
    parsed = parse_data(data)
    print(f"\nURL: {url}")
    if isinstance(parsed, dict):
        for k, v in parsed.items():
            print(f"  {k}: {v}")
    else:
        print(f"  {parsed}")
    # Small delay to avoid aggressive rate limiting if any
    time.sleep(2)
