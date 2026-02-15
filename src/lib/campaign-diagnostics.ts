import type { Campaign } from '@/types/goal';

// ─── Diagnostic Metrics ──────────────────────────────────────

export interface DiagnosticMetrics {
  mediaWaste: number;
  cpai: number;
  authenticImpressions: number;
}

export function computeDiagnosticMetrics(campaign: Campaign): DiagnosticMetrics {
  const authenticRate = campaign.authenticAdRate / 100;
  const authenticImpressions = campaign.impressions * authenticRate;
  const mediaWaste = campaign.spend * (1 - authenticRate);
  const cpai = authenticImpressions > 0 ? campaign.spend / authenticImpressions : 0;

  return { mediaWaste, cpai, authenticImpressions };
}

// ─── Pillar Scores ───────────────────────────────────────────

export interface PillarScore {
  pillar: 'Fraud-Free' | 'Brand Suitable' | 'Viewable' | 'In-Geo';
  value: number;
  threshold: number;
  passing: boolean;
  delta: number;
}

export function getPillarScores(campaign: Campaign): PillarScore[] {
  const fraudFree = 100 - campaign.fraudScore;
  return [
    { pillar: 'Fraud-Free', value: fraudFree, threshold: 98, passing: fraudFree >= 98, delta: fraudFree - 98 },
    { pillar: 'Brand Suitable', value: campaign.brandSuitabilityRate, threshold: 95, passing: campaign.brandSuitabilityRate >= 95, delta: campaign.brandSuitabilityRate - 95 },
    { pillar: 'Viewable', value: campaign.viewabilityRate, threshold: 70, passing: campaign.viewabilityRate >= 70, delta: campaign.viewabilityRate - 70 },
    { pillar: 'In-Geo', value: campaign.inGeoRate, threshold: 95, passing: campaign.inGeoRate >= 95, delta: campaign.inGeoRate - 95 },
  ];
}

// ─── Diagnostic Insights ─────────────────────────────────────

export type InsightSeverity = 'critical' | 'warning' | 'info';

export interface DiagnosticInsight {
  id: string;
  severity: InsightSeverity;
  title: string;
  description: string;
  pillar?: string;
}

export function generateCampaignInsights(campaign: Campaign, diagnostics: DiagnosticMetrics): DiagnosticInsight[] {
  const insights: DiagnosticInsight[] = [];
  const pillars = getPillarScores(campaign);

  // Find worst ad set for each failing pillar
  const adSets = campaign.adSets;

  for (const p of pillars) {
    if (p.passing) continue;

    if (p.pillar === 'Viewable') {
      const worst = [...adSets].sort((a, b) => a.viewableRate - b.viewableRate)[0];
      const severe = p.value < 60;
      insights.push({
        id: `pillar-viewable`,
        severity: severe ? 'critical' : 'warning',
        title: 'Low Viewability',
        description: `${(70 - p.value).toFixed(1)}% below the 70% benchmark.${worst ? ` "${worst.platformAdSetName}" has the lowest at ${worst.viewableRate.toFixed(1)}%.` : ''}`,
        pillar: 'Viewable',
      });
    }

    if (p.pillar === 'Fraud-Free') {
      const worst = [...adSets].sort((a, b) => b.fraudScore - a.fraudScore)[0];
      const severe = campaign.fraudScore > 4;
      insights.push({
        id: `pillar-fraud`,
        severity: severe ? 'critical' : 'warning',
        title: 'High Fraud Rate',
        description: `${campaign.fraudScore.toFixed(1)}% exceeds the 2% threshold.${worst ? ` "${worst.platformAdSetName}" has the highest at ${worst.fraudScore.toFixed(1)}%.` : ''}`,
        pillar: 'Fraud-Free',
      });
    }

    if (p.pillar === 'In-Geo') {
      const worst = [...adSets].sort((a, b) => a.inGeoRate - b.inGeoRate)[0];
      const severe = p.value < 92;
      insights.push({
        id: `pillar-ingeo`,
        severity: severe ? 'critical' : 'warning',
        title: 'Below Geo Target',
        description: `${p.value.toFixed(1)}% is below the 95% threshold.${worst ? ` "${worst.platformAdSetName}" has the lowest at ${worst.inGeoRate.toFixed(1)}%.` : ''}`,
        pillar: 'In-Geo',
      });
    }

    if (p.pillar === 'Brand Suitable') {
      const worst = [...adSets].sort((a, b) => a.brandSuitabilityRate - b.brandSuitabilityRate)[0];
      insights.push({
        id: `pillar-suitability`,
        severity: 'warning',
        title: 'Brand Suitability Below Target',
        description: `${p.value.toFixed(1)}% is below the 95% threshold.${worst ? ` "${worst.platformAdSetName}" has the lowest at ${worst.brandSuitabilityRate.toFixed(1)}%.` : ''}`,
        pillar: 'Brand Suitable',
      });
    }
  }

  // Media waste insight
  if (diagnostics.mediaWaste > 1000) {
    insights.push({
      id: 'media-waste',
      severity: 'info',
      title: `~${formatWaste(diagnostics.mediaWaste)} Media Waste`,
      description: `Based on a ${campaign.authenticAdRate.toFixed(1)}% Authentic Ad Rate, an estimated ${formatWaste(diagnostics.mediaWaste)} of spend is going to non-authentic impressions.`,
    });
  }

  return insights;
}

function formatWaste(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

// ─── Product Recommendations ────────────────────────────────

export interface ProductRecommendation {
  productIds: string[];
  productName: string;
  productDescription: string;
}

export interface InitiativeInsight extends DiagnosticInsight {
  product: ProductRecommendation | null;
}

const PRODUCT_MAP: Record<string, ProductRecommendation> = {
  'pillar-fraud': {
    productIds: ['fraud-lab'],
    productName: 'DV Fraud Lab',
    productDescription: 'Pre-bid IVT segments to block fraudulent inventory before it enters your supply path.',
  },
  'pillar-viewable': {
    productIds: ['scibids-ai', 'viewability'],
    productName: 'DV Performance + Pre-Bid Viewability',
    productDescription: 'AI-optimized bidding toward viewable impressions, combined with pre-bid viewability segments.',
  },
  'pillar-suitability': {
    productIds: ['brand-suitability'],
    productName: 'Authentic Brand Suitability (ABS)',
    productDescription: 'Content-level suitability controls that go beyond category blocks to protect brand context.',
  },
  'pillar-ingeo': {
    productIds: ['geo-verification'],
    productName: 'In-Geo Verification',
    productDescription: 'Pre-bid geo avoidance segments that block impressions served outside your target regions.',
  },
  'low-attention': {
    productIds: ['authentic-attention'],
    productName: 'DV Authentic Attention',
    productDescription: 'Pre-bid attention segments targeting inventory proven to drive higher engagement.',
  },
  'media-waste': {
    productIds: ['scibids-ai'],
    productName: 'DV Performance (AAR Optimization)',
    productDescription: 'Optimize bidding toward Authentic Ad Rate to reduce spend on non-authentic impressions.',
  },
};

// ─── Goal-Level Strategic Recommendations ───────────────────

export interface GoalPillarRecommendation {
  insightId: string;
  productIds: string[];
  productName: string;
  recommendation: string;
}

/** Strategic, goal-level recommendations for each pillar. These are broader than campaign-level recs. */
export const GOAL_PILLAR_RECOMMENDATIONS: Record<string, GoalPillarRecommendation> = {
  fraud: {
    insightId: 'pillar-fraud',
    productIds: ['fraud-lab'],
    productName: 'DV Fraud Lab',
    recommendation: 'Move from post-bid monitoring to pre-bid avoidance to block fraudulent inventory before it enters your supply path.',
  },
  suitability: {
    insightId: 'pillar-suitability',
    productIds: ['brand-suitability'],
    productName: 'Authentic Brand Suitability (ABS)',
    recommendation: 'Automate brand protection across your entire programmatic buy with centralized suitability controls and a unified blocklist.',
  },
  viewability: {
    insightId: 'pillar-viewable',
    productIds: ['scibids-ai', 'viewability'],
    productName: 'DV Performance + Pre-Bid Viewability',
    recommendation: 'Shift budget toward higher-viewability placements using AI-optimized bidding combined with pre-bid viewability segments.',
  },
  inGeo: {
    insightId: 'pillar-ingeo',
    productIds: ['geo-verification'],
    productName: 'In-Geo Verification',
    recommendation: 'Enable pre-bid geo avoidance segments to stop off-geography impressions before they waste budget.',
  },
};

/** Static reason context for each insight — used on the Marketplace when arriving from a recommendation link */
export const INSIGHT_REASONS: Record<string, { issue: string; howItHelps: string }> = {
  'pillar-fraud': {
    issue: 'High fraud rate detected',
    howItHelps: 'Blocks fraudulent inventory before it enters your supply path using pre-bid IVT segments and real-time detection.',
  },
  'pillar-viewable': {
    issue: 'Viewability below benchmark',
    howItHelps: 'Targets inventory with proven viewability rates and optimizes bidding toward impressions that are actually seen.',
  },
  'pillar-suitability': {
    issue: 'Brand suitability below target',
    howItHelps: 'Deploys content-level suitability controls across platforms to ensure ads appear alongside brand-appropriate content.',
  },
  'pillar-ingeo': {
    issue: 'Off-geography impressions detected',
    howItHelps: 'Blocks impressions served outside your target regions with pre-bid geo avoidance segments.',
  },
  'low-attention': {
    issue: 'Low attention index',
    howItHelps: 'Targets inventory proven to drive higher engagement using attention-based pre-bid segments.',
  },
  'media-waste': {
    issue: 'Significant media waste',
    howItHelps: 'Optimizes bidding toward Authentic Ad Rate to reduce spend on non-authentic impressions.',
  },
};

export function generateInitiativeRecommendations(campaign: Campaign, diagnostics: DiagnosticMetrics): InitiativeInsight[] {
  const baseInsights = generateCampaignInsights(campaign, diagnostics);

  const initiatives: InitiativeInsight[] = baseInsights.map(insight => ({
    ...insight,
    product: PRODUCT_MAP[insight.id] ?? null,
  }));

  // Add low-attention insight if applicable
  if (campaign.attentionIndex < 60) {
    initiatives.push({
      id: 'low-attention',
      severity: 'warning',
      title: 'Low Attention Index',
      description: `Attention index of ${campaign.attentionIndex} is below the 60 benchmark. Creatives may not be engaging users effectively.`,
      product: PRODUCT_MAP['low-attention'],
    });
  }

  return initiatives;
}
