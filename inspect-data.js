const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/lib/data/neet-cutoff.json','utf8'));
const byState = {};
for (const e of data) {
  if (!byState[e.state]) byState[e.state] = { cats: [], quotas: [] };
  if (!byState[e.state].cats.includes(e.category)) byState[e.state].cats.push(e.category);
  if (!byState[e.state].quotas.includes(e.quota)) byState[e.state].quotas.push(e.quota);
}
for (const [state, info] of Object.entries(byState).sort()) {
  console.log('\n' + state);
  console.log('  Cats:', info.cats.sort().join(' | '));
  console.log('  Quotas:', info.quotas.sort().join(' | '));
}
