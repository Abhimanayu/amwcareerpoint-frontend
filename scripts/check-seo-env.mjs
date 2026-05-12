const isEnabled = (value) => String(value || '').toLowerCase() === 'true';

const seoHold = isEnabled(process.env.SEO_HOLD);
const seoRobotsBlock = isEnabled(process.env.SEO_ROBOTS_BLOCK);
const allowSeoHold = isEnabled(process.env.ALLOW_SEO_HOLD_IN_PROD);

if ((seoHold || seoRobotsBlock) && !allowSeoHold) {
  console.error('SEO safety check failed. SEO_HOLD or SEO_ROBOTS_BLOCK is true.');
  console.error('Set ALLOW_SEO_HOLD_IN_PROD=true only for intentional maintenance windows.');
  process.exit(1);
}

console.log('SEO safety check passed.');
