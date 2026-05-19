#!/bin/bash

set -u

BASE_URL="${1:-http://localhost:3000/api/college-predictor}"
TMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t predictor-qa)"

pass_count=0
fail_count=0

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

run_request() {
  local name="$1"
  local query="$2"
  local out="$TMP_DIR/${name}.json"
  local code

  code=$(curl -sS -o "$out" -w "%{http_code}" "$BASE_URL$query")
  echo "$code"
}

report_pass() {
  pass_count=$((pass_count + 1))
  echo "PASS: $1"
}

report_fail() {
  fail_count=$((fail_count + 1))
  echo "FAIL: $1"
}

assert_node() {
  local file="$1"
  local code="$2"
  local expr="$3"
  local result

  result=$(node -e "const fs=require('fs');const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));const code=Number(process.argv[2]);const ok=(function(){${expr}})();if(ok){process.exit(0)};process.exit(1)" "$file" "$code")
  return $?
}

echo "College Predictor QA"
echo "Base URL: $BASE_URL"

meta_code=$(run_request "meta_boot" "?meta=1")
if [ "$meta_code" != "200" ]; then
  echo "Cannot reach API meta endpoint (HTTP $meta_code)."
  echo "Start app first: npm.cmd run dev"
  exit 1
fi

# T1 Missing rank -> 400
code=$(run_request "t1" "")
if [ "$code" = "400" ] && assert_node "$TMP_DIR/t1.json" "$code" "return typeof data.error==='string' && data.error.includes('Invalid rank');"; then
  report_pass "T1 missing rank returns 400"
else
  report_fail "T1 missing rank returns 400"
fi

# T2 rank=0 -> 400
code=$(run_request "t2" "?rank=0")
if [ "$code" = "400" ]; then
  report_pass "T2 rank=0 returns 400"
else
  report_fail "T2 rank=0 returns 400"
fi

# T3 rank upper bound -> 400
code=$(run_request "t3" "?rank=2000001")
if [ "$code" = "400" ]; then
  report_pass "T3 rank>2000000 returns 400"
else
  report_fail "T3 rank>2000000 returns 400"
fi

# T4 rank=1 boundary -> 200 and numeric total
code=$(run_request "t4" "?rank=1")
if [ "$code" = "200" ] && assert_node "$TMP_DIR/t4.json" "$code" "return data.rank===1 && Number.isInteger(data.totalMatches) && data.totalMatches>=0;"; then
  report_pass "T4 rank=1 boundary works"
else
  report_fail "T4 rank=1 boundary works"
fi

# T5 baseline scoped filter
code=$(run_request "t5" "?rank=200000&state=Rajasthan&category=ST&quota=State%20Quota")
if [ "$code" = "200" ] && assert_node "$TMP_DIR/t5.json" "$code" "return Array.isArray(data.results) && data.results.every(r=>r.state==='Rajasthan' && r.category==='ST' && r.quota==='State Quota');"; then
  report_pass "T5 scoped state/category/quota filter"
else
  report_fail "T5 scoped state/category/quota filter"
fi

# T6 known sub-category exact
code=$(run_request "t6" "?rank=200000&state=Uttarakhand&category=UR&subCategory=WOMEN")
if [ "$code" = "200" ] && assert_node "$TMP_DIR/t6.json" "$code" "return Array.isArray(data.results) && data.results.every(r=>r.subCategory==='WOMEN');"; then
  report_pass "T6 UR+WOMEN sub-category filter"
else
  report_fail "T6 UR+WOMEN sub-category filter"
fi

# T7 case-insensitive sub-category
code=$(run_request "t7" "?rank=200000&state=Uttarakhand&category=UR&subCategory=women")
if [ "$code" = "200" ] && assert_node "$TMP_DIR/t7.json" "$code" "return Array.isArray(data.results) && data.results.every(r=>r.subCategory==='WOMEN');"; then
  report_pass "T7 sub-category case-insensitive"
else
  report_fail "T7 sub-category case-insensitive"
fi

# T8 category with no sub-category data
code=$(run_request "t8" "?rank=200000&state=Punjab&category=SC")
if [ "$code" = "200" ] && assert_node "$TMP_DIR/t8.json" "$code" "return Array.isArray(data.results) && data.results.every(r=>r.subCategory===null);"; then
  report_pass "T8 Punjab SC has null subCategory rows"
else
  report_fail "T8 Punjab SC has null subCategory rows"
fi

# T9 sub-category only global filter
code=$(run_request "t9" "?rank=200000&subCategory=WOMEN")
if [ "$code" = "200" ] && assert_node "$TMP_DIR/t9.json" "$code" "return Array.isArray(data.results) && data.results.every(r=>r.subCategory==='WOMEN');"; then
  report_pass "T9 subCategory-only filter works"
else
  report_fail "T9 subCategory-only filter works"
fi

# T10 quota normalization (double spaces)
code_a=$(run_request "t10a" "?rank=200000&state=Uttarakhand&quota=STATE%20QUOTA%20SEATS")
code_b=$(run_request "t10b" "?rank=200000&state=Uttarakhand&quota=STATE%20%20QUOTA%20%20SEATS")
if [ "$code_a" = "200" ] && [ "$code_b" = "200" ] && node -e "const fs=require('fs');const a=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));const b=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));process.exit(a.totalMatches===b.totalMatches?0:1)" "$TMP_DIR/t10a.json" "$TMP_DIR/t10b.json"; then
  report_pass "T10 quota whitespace normalization"
else
  report_fail "T10 quota whitespace normalization"
fi

# T11 meta quota dedupe
code=$(run_request "t11" "?meta=1")
if [ "$code" = "200" ] && assert_node "$TMP_DIR/t11.json" "$code" "const q=(data.stateMeta?.Uttarakhand?.quotas)||[];const norm=[...new Set(q.map(x=>String(x).trim().replace(/\\s+/g,' ').toUpperCase()))];return q.length===norm.length;"; then
  report_pass "T11 meta quotas deduped"
else
  report_fail "T11 meta quotas deduped"
fi

# T12 impossible combo returns 0 not crash
code=$(run_request "t12" "?rank=200000&state=Punjab&category=SC&subCategory=WOMEN")
if [ "$code" = "200" ] && assert_node "$TMP_DIR/t12.json" "$code" "return data.totalMatches===0;"; then
  report_pass "T12 impossible combination returns 0"
else
  report_fail "T12 impossible combination returns 0"
fi

# T13 ensure results sorted by closingRank ascending
code=$(run_request "t13" "?rank=200000&state=Rajasthan&category=ST")
if [ "$code" = "200" ] && assert_node "$TMP_DIR/t13.json" "$code" "const arr=(data.results||[]).map(r=>r.closingRank);for(let i=1;i<arr.length;i++){if(arr[i]<arr[i-1])return false;}return true;"; then
  report_pass "T13 results sorted by closingRank"
else
  report_fail "T13 results sorted by closingRank"
fi

echo ""
echo "Summary: PASS=$pass_count FAIL=$fail_count"

if [ "$fail_count" -gt 0 ]; then
  exit 1
fi

exit 0
