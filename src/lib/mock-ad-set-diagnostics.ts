import type { AdSet, AdSetDiagnosticData, BlockedSite } from '@/types/goal';

// ─── Deterministic seeding ──────────────────────────────────

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number, offset: number): number {
  const x = Math.sin(seed + offset) * 10000;
  return x - Math.floor(x);
}

// ─── Region pool ────────────────────────────────────────────

const REGIONS = [
  'Southeast Asia', 'Eastern Europe', 'Sub-Saharan Africa', 'Middle East',
  'South America', 'Central America', 'South Asia', 'Oceania',
  'Northern Africa', 'Central Asia', 'Caribbean', 'Western Africa',
];

// ─── SIVT category pool ─────────────────────────────────────

const SIVT_POOL: Array<{ category: string; description: string }> = [
  { category: 'Bot Traffic', description: 'Automated non-human traffic from known bot networks' },
  { category: 'Data Center Proxy', description: 'Traffic originating from data center IP ranges' },
  { category: 'Ad Stacking', description: 'Multiple ads layered in a single ad slot' },
  { category: 'Cookie Stuffing', description: 'Fraudulent cookie injection on retail and content sites' },
  { category: 'Pixel Stuffing', description: 'Ads rendered in 1x1 pixel iframes' },
  { category: 'Domain Spoofing', description: 'Misrepresented publisher domains in bid requests' },
  { category: 'Click Injection', description: 'Fraudulent click events injected by malware' },
  { category: 'SDK Spoofing', description: 'Fabricated app install and engagement signals' },
];

// ─── Blocked / Authentic domain pools ────────────────────────

const BLOCKED_DOMAINS = [
  'sketchy-news.net', 'clickbait-farm.co', 'pirate-streams.xyz',
  'viral-hoax.info', 'ad-mill.biz', 'popup-central.site',
  'fake-deals.shop', 'torrent-hub.cc', 'spam-wire.org',
  'redirect-loop.io', 'malware-drop.net', 'crypto-scam.club',
];

const DETECTION_METHODS = [
  'Pre-Bid Filter', 'Post-Bid Analysis', 'Real-Time Scanner',
  'Domain Blocklist', 'ML Classifier', 'Manual Review',
];

const SAMPLE_PATHS = [
  '/article/trending-now', '/watch/free-stream', '/deals/flash-sale',
  '/news/breaking', '/viral/top-picks', '/download/free-tool',
];

const BLOCK_REASONS: Array<{ reason: string; details: string[] }> = [
  { reason: 'Brand Safety', details: ['Hate Speech', 'Adult Content', 'Violence', 'Misinformation'] },
  { reason: 'Fraud', details: ['Bot Traffic', 'Click Injection', 'Domain Spoofing'] },
  { reason: 'Viewability', details: ['Below 30% Viewable', 'Hidden Placement', 'Below Fold'] },
  { reason: 'Geo Mismatch', details: ['Off-Target Region', 'VPN/Proxy Detected'] },
];

// ─── Generators ─────────────────────────────────────────────

function generateOffGeoRegions(adSet: AdSet): AdSetDiagnosticData['offGeoRegions'] {
  const seed = hashCode(adSet.id);
  const offGeoTotal = 100 - adSet.inGeoRate;
  if (offGeoTotal <= 0.1) return [{ region: 'None detected', percentage: 0 }];

  // Pick 3 unique regions
  const indices: number[] = [];
  for (let i = 0; indices.length < 3 && i < 20; i++) {
    const idx = Math.floor(seededRandom(seed, i + 10) * REGIONS.length);
    if (!indices.includes(idx)) indices.push(idx);
  }

  // Split offGeoTotal across 3 regions (roughly 50/30/20)
  const splits = [0.50, 0.30, 0.20];
  return indices.map((regionIdx, i) => ({
    region: REGIONS[regionIdx],
    percentage: Math.round(offGeoTotal * splits[i] * 10) / 10,
  }));
}

function generateSivtCategories(adSet: AdSet): AdSetDiagnosticData['sivtCategories'] {
  const seed = hashCode(adSet.id);
  const total = adSet.fraudScore;
  if (total <= 0.1) return [{ category: 'None detected', percentage: 0, description: 'No significant SIVT found' }];

  const count = total > 3 ? 3 : 2;
  const indices: number[] = [];
  for (let i = 0; indices.length < count && i < 20; i++) {
    const idx = Math.floor(seededRandom(seed, i + 30) * SIVT_POOL.length);
    if (!indices.includes(idx)) indices.push(idx);
  }

  const splits = count === 3 ? [0.45, 0.35, 0.20] : [0.60, 0.40];
  return indices.map((sivtIdx, i) => ({
    category: SIVT_POOL[sivtIdx].category,
    percentage: Math.round(total * splits[i] * 10) / 10,
    description: SIVT_POOL[sivtIdx].description,
  }));
}

function generateCpaiGap(adSet: AdSet): AdSetDiagnosticData['cpaiEfficiencyGap'] {
  const seed = hashCode(adSet.id);
  const targetCpm = 4 + seededRandom(seed, 50) * 4; // $4–$8
  const authenticImpressions = adSet.impressions * (adSet.authenticAdRate / 100);
  const actualCpai = authenticImpressions > 0 ? (adSet.spend / authenticImpressions) * 1000 : 0;
  return {
    targetCpm: Math.round(targetCpm * 100) / 100,
    actualCpai: Math.round(actualCpai * 100) / 100,
    gapDollars: Math.round((actualCpai - targetCpm) * 100) / 100,
  };
}

function generateAarTrend(adSet: AdSet): number[] {
  const seed = hashCode(adSet.id);
  return Array.from({ length: 7 }, (_, i) => {
    const jitter = (seededRandom(seed, i + 70) - 0.5) * 6; // ±3 points
    return Math.round(Math.max(20, Math.min(100, adSet.authenticAdRate + jitter)) * 10) / 10;
  });
}

function generateBlockedSites(adSet: AdSet): BlockedSite[] {
  const seed = hashCode(adSet.id);
  const indices: number[] = [];
  for (let i = 0; indices.length < 5 && i < 30; i++) {
    const idx = Math.floor(seededRandom(seed, i + 90) * BLOCKED_DOMAINS.length);
    if (!indices.includes(idx)) indices.push(idx);
  }
  return indices.map((domIdx, i) => {
    const reasonGroup = BLOCK_REASONS[Math.floor(seededRandom(seed, i + 110) * BLOCK_REASONS.length)];
    const detail = reasonGroup.details[Math.floor(seededRandom(seed, i + 120) * reasonGroup.details.length)];
    const impressionsBlocked = Math.round(5000 + seededRandom(seed, i + 130) * 95000);
    const detectionMethod = DETECTION_METHODS[Math.floor(seededRandom(seed, i + 140) * DETECTION_METHODS.length)];
    const samplePath = SAMPLE_PATHS[Math.floor(seededRandom(seed, i + 150) * SAMPLE_PATHS.length)];
    const riskScore = Math.round(55 + seededRandom(seed, i + 160) * 45);
    const domain = BLOCKED_DOMAINS[domIdx];
    return {
      domain,
      blockReason: reasonGroup.reason,
      blockDetail: detail,
      impressionsBlocked,
      detectionMethod,
      sampleUrl: `${domain}${samplePath}`,
      riskScore,
    };
  });
}

// ─── Main export ────────────────────────────────────────────

export function getAdSetDiagnosticData(adSet: AdSet): AdSetDiagnosticData {
  return {
    offGeoRegions: generateOffGeoRegions(adSet),
    sivtCategories: generateSivtCategories(adSet),
    cpaiEfficiencyGap: generateCpaiGap(adSet),
    aarTrend: generateAarTrend(adSet),
    blockedSites: generateBlockedSites(adSet),
  };
}
