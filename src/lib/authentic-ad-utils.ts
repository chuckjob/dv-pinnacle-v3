import type { Goal, AdSet, Ad, HealthStatus, Campaign } from '@/types/goal';

export type PillarIssue = 'Viewability' | 'Suitability' | 'Fraud-Free' | 'In-Geo';

/**
 * Returns an array of pillar issues for a given goal based on threshold checks.
 * An empty array means "All Clear" — all 4 pillars are passing.
 */
export function getIssues(goal: Goal): PillarIssue[] {
  const issues: PillarIssue[] = [];

  if (goal.viewabilityRate < 70) issues.push('Viewability');
  if (goal.brandSuitabilityRate < 95) issues.push('Suitability');
  if (goal.fraudRate > 2) issues.push('Fraud-Free');
  if (goal.inGeoRate < 95) issues.push('In-Geo');

  return issues;
}

/** Color mapping for each pillar issue type */
export const pillarColors: Record<PillarIssue, { bg: string; text: string; dot: string }> = {
  'Viewability': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Suitability': { bg: 'bg-plum-50', text: 'text-plum-700', dot: 'bg-plum-500' },
  'Fraud-Free': { bg: 'bg-tomato-50', text: 'text-tomato-700', dot: 'bg-tomato-500' },
  'In-Geo': { bg: 'bg-turquoise-50', text: 'text-turquoise-700', dot: 'bg-turquoise-500' },
};

/**
 * Returns a color class for the Authentic Ad Rate value.
 * >=75% green, >=60% orange, <60% red
 */
export function getAuthenticRateColor(rate: number): string {
  if (rate >= 75) return 'text-grass-600';
  if (rate >= 60) return 'text-orange-600';
  return 'text-tomato-500';
}

// ─── Level-Specific Health Derivation ──────────────────────────

/**
 * Ad Set — Targeting Health
 * Primary drivers: Fraud-Free and In-Geo.
 * High fraud or out-of-geo means the targeting parameters are
 * reaching the wrong "who" or "where".
 */
export function getAdSetHealth(adSet: AdSet): HealthStatus {
  const fraudFree = 100 - adSet.fraudScore;
  // needs-attention: severe targeting failure
  if (adSet.fraudScore > 4 || adSet.inGeoRate < 92) return 'needs-attention';
  // at-risk: targeting is drifting
  if (adSet.fraudScore > 2 || adSet.inGeoRate < 95) return 'at-risk';
  return 'on-track';
}

/**
 * Creative (Ad) — Engagement Health
 * Primary drivers: Attention Index and Viewability.
 * Evaluated relative to the campaign average — a creative that
 * underperforms its siblings is the problem, not inherited fraud.
 */
export function getAdHealth(ad: Ad, campaignAvgAttention: number, campaignAvgViewability: number): HealthStatus {
  const attentionDelta = ad.attentionIndex - campaignAvgAttention;
  const viewabilityDelta = ad.viewableRate - campaignAvgViewability;

  // needs-attention: significantly below campaign average on both
  if (attentionDelta < -8 && viewabilityDelta < -5) return 'needs-attention';
  // at-risk: below average on either metric
  if (attentionDelta < -5 || viewabilityDelta < -4) return 'at-risk';
  return 'on-track';
}

/**
 * Compute campaign-level averages for creative health comparison.
 * Returns weighted averages across all ads in the campaign.
 */
export function getCampaignCreativeAverages(campaign: Campaign): { avgAttention: number; avgViewability: number } {
  const allAds = campaign.adSets.flatMap(as => as.ads);
  if (allAds.length === 0) return { avgAttention: 0, avgViewability: 0 };

  const totalImpressions = allAds.reduce((sum, ad) => sum + ad.impressions, 0);
  if (totalImpressions === 0) return { avgAttention: 0, avgViewability: 0 };

  const avgAttention = allAds.reduce((sum, ad) => sum + ad.attentionIndex * ad.impressions, 0) / totalImpressions;
  const avgViewability = allAds.reduce((sum, ad) => sum + ad.viewableRate * ad.impressions, 0) / totalImpressions;

  return { avgAttention, avgViewability };
}
