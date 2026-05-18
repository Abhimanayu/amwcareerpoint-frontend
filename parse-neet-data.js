const xlsx = require('xlsx');
const fs = require('fs');
const dir = 'C:/Users/Abhimanyu Singh/Downloads/neet_data';
const results = [];

function clean(s) {
  return (s || '').toString().trim().replace(/\r\n|\n|\r/g, ' ').replace(/\s+/g, ' ');
}
function addEntry(state, college, category, closingRank, quota) {
  college = clean(college);
  category = clean(category).toUpperCase();
  const rank = parseInt(closingRank);
  // Drop corrupt: category is purely numeric, or college too short, or invalid rank
  if (!college || college.length < 3) return;
  if (/^\d+$/.test(category) || !category || category.length < 1) return;
  if (isNaN(rank) || rank <= 0 || rank > 2000000) return;
  results.push({ state, college, category, closingRank: rank, quota: quota || 'State Quota' });
}

// ANDHRA PRADESH
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/Andhra Pradresh Neet ug 2025 Final Cut off.xlsx').Sheets['Sheet1'], {header:1});
  let col = '';
  for (let i=1;i<data.length;i++){
    const r=data[i];
    if(r[0]) col=clean(r[0]);
    if(col&&r[1]&&r[2]) addEntry('Andhra Pradesh',col,r[2],r[1],'State Quota');
  }
}

// BIHAR PRIVATE R3
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/Bihar Private MBBS Round 3 Cutoff 2025.docx N.xlsx').Sheets['Sheet1'],{header:1});
  for(let i=2;i<data.length;i++){
    const r=data[i];
    if(!r[1]) continue;
    [['UR',2],['SM',3],['NRI',4],['MM',5]].forEach(([cat,col])=>{
      if(r[col]) addEntry('Bihar',r[1],cat,r[col],'Private Round-3');
    });
  }
}

// BIHAR STRAY
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/Bihar MBBS Stray Round Cutoff 2025.xlsx').Sheets['Sheet1'],{header:1});
  for(let i=2;i<data.length;i++){
    const r=data[i];
    if(!r[1]) continue;
    [['UR',2],['SM',3],['NRI',4],['MM',5]].forEach(([cat,col])=>{
      if(r[col]) addEntry('Bihar',r[1],cat,r[col],'Stray Round');
    });
  }
}

// CHHATTISGARH - preserve all sub-categories (they are real and valid)
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/CG FINAL NEET UG COUNSELLING CUT OFF LIST 2025.xlsx').Sheets['Sheet1'],{header:1});
  let col='';
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[1]) col=clean(r[1]);
    if(col&&r[3]&&r[4]) addEntry('Chhattisgarh',col,r[3],r[4],r[2]||'State');
  }
}

// GUJARAT - use correct sheet names and correct header row
{
  const wb = xlsx.readFile(dir+'/GUJARAT NEET UG COUNSELLING 2025 FINAL CUT OFF.xlsx');
  // Govt seats (GQ) - title in row0, header in row1
  const gqSheet = wb.Sheets['GOVERNMENT SEAT (GQ)'];
  if(gqSheet){
    const data = xlsx.utils.sheet_to_json(gqSheet,{header:1});
    const hdr=data[1]; // row0=title, row1=header
    for(let i=2;i<data.length;i++){
      const r=data[i];
      if(!r[1]) continue;
      for(let c=2;c<hdr.length;c++){
        if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number')
          addEntry('Gujarat',r[1],hdr[c],r[c],'Govt Quota (GQ)');
      }
    }
  }
  // Local Quota - header in row0
  const lqSheet = wb.Sheets['Local Quota'];
  if(lqSheet){
    const data = xlsx.utils.sheet_to_json(lqSheet,{header:1});
    const hdr=data[0]; // no title row, header is row0
    for(let i=1;i<data.length;i++){
      const r=data[i];
      if(!r[1]) continue;
      for(let c=2;c<hdr.length;c++){
        if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number')
          addEntry('Gujarat',r[1],hdr[c],r[c],'Local Quota');
      }
    }
  }
  // Management Quota
  const mqSheet = wb.Sheets['MANAGEMENT SEAT (MQ)'];
  if(mqSheet){
    const data = xlsx.utils.sheet_to_json(mqSheet,{header:1});
    for(let i=1;i<data.length;i++){
      const r=data[i];
      if(r[1]&&r[2]&&typeof r[2]==='number') addEntry('Gujarat',r[1],'MQ',r[2],'Management Quota');
    }
  }
}

// HARYANA
{
  const wb = xlsx.readFile(dir+'/Harayana state quota counselling round 3 cut off.xlsx');
  ['Haryana state Quota R-3 Cut off','Haryana Pvt college R-3 Cut off'].forEach(sName => {
    const ws = wb.Sheets[sName];
    if(!ws) return;
    const data = xlsx.utils.sheet_to_json(ws,{header:1});
    const hdr=data[1];
    if(!hdr) return;
    for(let i=2;i<data.length;i++){
      const r=data[i];
      if(!r[1]) continue;
      for(let c=2;c<hdr.length;c++){
        if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number')
          addEntry('Haryana',r[1],hdr[c],r[c],'State Quota');
      }
    }
  });
}

// JHARKHAND - preserve PH/Blind/Deaf sub-categories
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/Jharkhand Neet Ug 2025 Cut Off.xlsx').Sheets['Sheet1'],{header:1});
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[0]&&r[1]&&r[3]) addEntry('Jharkhand',r[1],r[3],r[0],'State Quota');
  }
}

// KARNATAKA
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/KARNATAKA NEET COUNSELLING 2025 ALL ROUND.xlsx').Sheets['Sheet1'],{header:1});
  const hdr=data[1];
  for(let i=2;i<data.length;i++){
    const r=data[i];
    if(!r[1]) continue;
    for(let c=2;c<hdr.length;c++){
      if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number')
        addEntry('Karnataka',r[1],hdr[c],r[c],'State Quota');
    }
  }
}

// KERALA
{
  const wb = xlsx.readFile(dir+'/KERALA mbbs FINAL LIST.xlsx');
  const ws = wb.Sheets['MBBS R-3'] || wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws,{header:1});
  const hdr=data[1];
  for(let i=2;i<data.length;i++){
    const r=data[i];
    if(!r[0]||r[0].toString().length<3) continue;
    for(let c=3;c<hdr.length;c++){
      if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number')
        addEntry('Kerala',r[0],hdr[c],r[c],'State Quota');
    }
  }
}

// MAHARASHTRA
{
  const wb = xlsx.readFile(dir+'/M.H NEET COUNSELLING GOVT & SEMI COLLEGE ROUND-3 DATA 2025.xlsx');
  ['MH GOVT COOLEGE','MH SEMI COLLEGE'].forEach(sName => {
    const ws = wb.Sheets[sName];
    if(!ws) return;
    const data = xlsx.utils.sheet_to_json(ws,{header:1});
    const hdr=data[0];
    if(!hdr) return;
    for(let i=1;i<data.length;i++){
      const r=data[i];
      if(!r[1]) continue;
      for(let c=3;c<hdr.length;c++){
        if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number')
          addEntry('Maharashtra',r[1],hdr[c],r[c],r[2]||'State');
      }
    }
  });
}

// MANIPUR
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/MANIPUR NEET UG 2025 FINAL CUT OFF.xlsx').Sheets['Sheet1'],{header:1});
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[0]&&r[1]&&r[2]) addEntry('Manipur',r[0],r[2],r[1],'State Quota');
  }
}

// MADHYA PRADESH - preserve all sub-categories (UR/GS/OP, OBC/FF/OP etc.)
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/MP NEET UG COUSELLING 2025 CUT OFF.xlsx').Sheets['Sheet1'],{header:1});
  let col='';
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[1]) col=clean(r[1]);
    if(col&&r[2]&&r[3]) addEntry('Madhya Pradesh',col,r[2],r[3],'State Quota');
  }
}

// NAGALAND
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/NAGALAND NEET UG FINAL CUT OFF.xlsx').Sheets['Sheet1'],{header:1});
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(!r[1]||!r[2]) continue;
    const rank = r[4] ? r[4].toString().replace(/rank-/i,'').trim() : r[3];
    addEntry('Nagaland',r[1],r[2],rank,'State Quota');
  }
}

// ODISHA
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/Odisha NEET Counselling 2025 - Odisha MBBS Round 3 Cutoff 2025.xlsx').Sheets['Sheet1'],{header:1});
  let col='';
  for(let i=0;i<data.length;i++){
    const r=data[i];
    if(r[1]&&typeof r[1]==='string'&&!r[0]&&!r[2]){
      const v=r[1].toString().trim();
      if(v&&!v.includes('Odisha NEET')&&v.length>5) col=v;
    } else if(r[0]&&r[2]&&typeof r[2]==='number'&&col){
      addEntry('Odisha',col,r[0],r[2],r[1]||'State');
    }
  }
}

// PUNJAB
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/Punjab MBBS Round 3 NEET UG COUNSELLING 2025.xlsx').Sheets['Sheet1'],{header:1});
  let col='';
  for(let i=0;i<data.length;i++){
    const r=data[i];
    if(!r[0]&&r[1]&&typeof r[1]==='string'&&r[1].length>5&&!r[2]){
      col=r[1].toString().trim();
    } else if(r[0]&&typeof r[0]==='string'&&r[0]!=='Category'&&col){
      const rank = r[3]||r[2]||r[1];
      if(rank&&rank!=='-') addEntry('Punjab',col,r[0],rank,'State Quota');
    }
  }
}

// RAJASTHAN - take R-3 rows as final
{
  const wb = xlsx.readFile(dir+'/Rajasthan neet counselling 2025 ALL ROUND cut off ( govt. seat and mgmt. seat.pd.xlsx');
  const catMap = [
    ['GEN',2],['GEN',3],['OBC',4],['OBC',5],['EWS',6],['EWS',7],
    ['SC',8],['SC',9],['ST',10],['ST',11],['MBC',12],['MBC',13],['SA',14],['SA',15]
  ];
  ['RAJ. NEET COUN. 2025 R-1 GOVT S','RAJ 2025 R-1 CUTT OFF MGMT SEAT'].forEach(sName => {
    const ws = wb.Sheets[sName];
    if(!ws) return;
    const data = xlsx.utils.sheet_to_json(ws,{header:1});
    let col='';
    for(let i=2;i<data.length;i++){
      const r=data[i];
      if(!r[0]&&!r[1]) continue;
      const round = r[0]?r[0].toString().trim():'';
      const collegePart = r[1]?r[1].toString().trim():'';
      if(collegePart) col=collegePart;
      if(round==='R-3'&&col){
        catMap.forEach(([cat,colIdx])=>{
          if(r[colIdx]&&typeof r[colIdx]==='number') addEntry('Rajasthan',col,cat,r[colIdx],'State Quota');
        });
      }
    }
  });
}

// TAMIL NADU GQ
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/GQ TAMIL NADU NEET UG 2025 COUNSELLING.xlsx').Sheets['Sheet1'],{header:1});
  const hdr=data[0];
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(!r[1]) continue;
    const college = r[1].toString().replace(/^(GQ|MQ)_MBBS\s*\([^)]*\)\s*/i,'').trim();
    for(let c=2;c<hdr.length;c++){
      if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number')
        addEntry('Tamil Nadu',college,hdr[c],r[c],'GQ Quota');
    }
  }
}

// TAMIL NADU MQ/NRI
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/MQ and NRI Quota Tamil Nadu UG 2025 Counselling.xlsx').Sheets['Sheet1'],{header:1});
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(!r[1]) continue;
    const college = r[1].toString().replace(/^(GQ|MQ)_MBBS\s*\([^)]*\)\s*/i,'').trim();
    if(r[2]&&typeof r[2]==='number') addEntry('Tamil Nadu',college,'GEN',r[2],'Management Quota');
    if(r[4]&&typeof r[4]==='number') addEntry('Tamil Nadu',college,'NRI',r[4],'NRI Quota');
  }
}

// TELANGANA CA QUOTA
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/Telangana Neet ug 2025 final Cut off COMPETENT AUTHORITY QUOTA.xlsx').Sheets['Sheet1'],{header:1});
  const hdr=data[0];
  let col='';
  for(let i=0;i<data.length;i++){
    const r=data[i];
    if(r[0]&&typeof r[0]==='number'&&r[1]){
      col=r[1].toString().trim();
      for(let c=2;c<hdr.length;c++){
        if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number') addEntry('Telangana',col,hdr[c],r[c],'CA Quota');
      }
    } else if(!r[0]&&r[1]&&typeof r[1]==='string'&&r[1].includes('ROUND')){
      for(let c=2;c<hdr.length;c++){
        if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number') addEntry('Telangana',col,hdr[c],r[c],'CA Quota');
      }
    }
  }
}

// TELANGANA CTB
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/Telangana Neet ug 2025 final Cut off CTB QUOTA.xlsx').Sheets['Sheet1'],{header:1});
  const hdr=data[0];
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[1]&&typeof r[1]==='string'){
      for(let c=3;c<hdr.length;c++){
        if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number') addEntry('Telangana',r[1],hdr[c],r[c],'CTB Quota');
      }
    }
  }
}

// TELANGANA NRI
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/Telangana Neet ug 2025 final Cut off NRI QUOTA.xlsx').Sheets['Sheet1'],{header:1});
  const hdr=data[0];
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[1]&&typeof r[1]==='string'){
      for(let c=2;c<hdr.length;c++){
        if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number') addEntry('Telangana',r[1],hdr[c],r[c],'NRI Quota');
      }
    }
  }
}

// TRIPURA
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/TRIPURA NEET UG 2025 FINAL CUT OFF.xlsx').Sheets['Sheet1'],{header:1});
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[1]&&r[3]&&r[4]) addEntry('Tripura',r[1],r[3],r[4],'State Quota');
  }
}

// UTTAR PRADESH - proper 3-section parse
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/UTTAR PRADESH neet counselling 2025 ALL ROUND cut off ( govt. seat and pvt. seat..xlsx').Sheets['Sheet1'],{header:1});
  let section = '';
  for(let i=0;i<data.length;i++){
    const r=data[i];
    // Detect section headers
    if(!r[0]&&r[1]&&typeof r[1]==='string'){
      const v=r[1].toString().trim();
      if(v.includes('GOVT. COLLEGE')) section='GOV_AGGREGATE';
      if(v.includes('GOVT COLLEGE ROUND')) section='GOV_PER_COLLEGE';
      if(v.includes('PVT COLLEGE')) section='PVT';
      if(v.includes('MINORITY')) section='MINORITY';
      continue;
    }
    if(section==='GOV_PER_COLLEGE'){
      // Header: S.N, COLLEGE NAME, GEN, EWS, OBC, SC, ST
      if(r[0]==='S.N') continue;
      if(r[1]&&typeof r[1]==='string'&&r[1].length>3){
        const college=r[1].toString().trim();
        [['GEN',2],['EWS',3],['OBC',4],['SC',5],['ST',6]].forEach(([cat,col])=>{
          if(r[col]&&typeof r[col]==='number') addEntry('Uttar Pradesh',college,cat,r[col],'State Quota (Govt)');
        });
      }
    }
    if(section==='PVT'){
      // Header: S.N, COLLEGE NAME, R-1, R-2, R-3, R-4  — use R-3 (col4) as final
      if(r[0]==='S.N') continue;
      if(r[1]&&typeof r[1]==='string'&&r[1].length>3){
        const college=r[1].toString().trim();
        const rank=r[4]||r[3]||r[2]; // prefer R-3, fallback to R-2, R-1
        if(rank&&typeof rank==='number') addEntry('Uttar Pradesh',college,'GEN',rank,'Private Quota');
      }
    }
    if(section==='MINORITY'){
      if(r[0]==='S.N') continue;
      if(r[1]&&typeof r[1]==='string'&&r[1].length>3){
        const college=r[1].toString().trim();
        const rank=r[4]||r[3]||r[2];
        if(rank&&typeof rank==='number') addEntry('Uttar Pradesh',college,'GEN',rank,'Minority Quota');
      }
    }
  }
}

// UTTARAKHAND
{
  const data = xlsx.utils.sheet_to_json(xlsx.readFile(dir+'/UTTARAKHAND NEET UG 2025 ALL ROUND CUT OFF.xlsx').Sheets['Sheet1'],{header:1});
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[3]&&r[2]&&r[5]&&typeof r[5]==='number') addEntry('Uttarakhand',r[3],r[2],r[5],r[1]||'State');
  }
}

// WEST BENGAL - only process rows where category header is a string
{
  const wb_file = xlsx.readFile(dir+'/West Bengal Private MBBS  All Round  Cutoff 2025.docx N.xlsx');
  const ws = wb_file.Sheets[wb_file.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws,{header:1});
  const hdr=data[1]; // ["S.N","COLLEGE","UR","EWS","OBC-A","OBC-B","SC","ST","UR PWD"]
  let col='';
  for(let i=2;i<data.length;i++){
    const r=data[i];
    if(r[1]&&typeof r[1]==='string'&&r[1].length>5) col=r[1].toString().trim();
    const round=r[0]?r[0].toString().trim():'';
    if(round==='R-3'&&col){
      for(let c=2;c<hdr.length;c++){
        // Only add if header is a string (not a number)
        if(hdr[c]&&typeof hdr[c]==='string'&&r[c]&&typeof r[c]==='number')
          addEntry('West Bengal',col,hdr[c],r[c],'State Quota');
      }
    }
  }
}

console.log('Total entries:', results.length);

// Dedup: same state+college+category → keep highest rank (final/most permissive)
const dedupMap = new Map();
results.forEach(e => {
  const key = e.state+'|'+e.college+'|'+e.category+'|'+e.quota;
  const existing = dedupMap.get(key);
  if (!existing || e.closingRank > existing.closingRank) {
    dedupMap.set(key, e);
  }
});
const deduped = Array.from(dedupMap.values());
console.log('After dedup:', deduped.length);

// Build per-state metadata: state → { categories[], quotas[] }
const stateMeta = {};
deduped.forEach(e => {
  if (!stateMeta[e.state]) stateMeta[e.state] = { categories: [], quotas: [] };
  if (!stateMeta[e.state].categories.includes(e.category)) stateMeta[e.state].categories.push(e.category);
  if (!stateMeta[e.state].quotas.includes(e.quota)) stateMeta[e.state].quotas.push(e.quota);
});
// Sort categories and quotas alphabetically per state
Object.values(stateMeta).forEach(meta => {
  meta.categories.sort();
  meta.quotas.sort();
});

const states = Object.keys(stateMeta).sort();
console.log('States:', states.join(', '));
states.forEach(s => {
  console.log(`  ${s}: ${stateMeta[s].categories.length} cats, ${stateMeta[s].quotas.length} quotas`);
});

fs.writeFileSync('src/lib/data/neet-cutoff.json', JSON.stringify(deduped));
fs.writeFileSync('src/lib/data/neet-state-meta.json', JSON.stringify(stateMeta));
console.log('Written neet-cutoff.json:', JSON.stringify(deduped).length, 'bytes');
console.log('Written neet-state-meta.json:', JSON.stringify(stateMeta).length, 'bytes');
