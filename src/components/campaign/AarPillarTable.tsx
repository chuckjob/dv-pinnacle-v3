import { Check, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/formatters';
import { getAuthenticRateColor } from '@/lib/authentic-ad-utils';
import { getPillarScores, computeDiagnosticMetrics, generateInitiativeRecommendations } from '@/lib/campaign-diagnostics';
import type { Campaign } from '@/types/goal';
import type { InitiativeInsight } from '@/lib/campaign-diagnostics';

const PILLAR_TO_INSIGHT_ID: Record<string, string> = {
  'Fraud-Free': 'pillar-fraud',
  'Brand Suitable': 'pillar-suitability',
  'Viewable': 'pillar-viewable',
  'In-Geo': 'pillar-ingeo',
};

const BASENAME = '/dv-pinnacle-v3';

export function AarPillarTable({ campaign }: { campaign: Campaign }) {
  const pillars = getPillarScores(campaign);
  const diagnostics = computeDiagnosticMetrics(campaign);
  const insights = generateInitiativeRecommendations(campaign, diagnostics);

  const insightMap = new Map<string, InitiativeInsight>();
  for (const insight of insights) {
    insightMap.set(insight.id, insight);
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <div>
          <span className="text-label font-medium text-cool-500 uppercase tracking-wide">DV Authentic Ad Rate</span>
          <div className={cn('text-h3 font-bold mt-0.5', getAuthenticRateColor(campaign.authenticAdRate))}>
            {formatPercent(campaign.authenticAdRate)}
          </div>
        </div>
        <p className="text-label text-cool-400 max-w-[240px] text-right">
          Percentage of impressions passing all quality pillars
        </p>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-25">
            <th className="text-left text-label font-semibold text-cool-600 uppercase tracking-wide px-5 py-2.5 w-[120px]">Pillar</th>
            <th className="text-right text-label font-semibold text-cool-600 uppercase tracking-wide px-4 py-2.5 w-[80px]">Rate</th>
            <th className="text-center text-label font-semibold text-cool-600 uppercase tracking-wide px-4 py-2.5 w-[70px]">Status</th>
            <th className="text-left text-label font-semibold text-cool-600 uppercase tracking-wide px-5 py-2.5">Details</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map(p => {
            const insightId = PILLAR_TO_INSIGHT_ID[p.pillar];
            const insight = insightId ? insightMap.get(insightId) : undefined;

            return (
              <tr key={p.pillar} className="border-b border-neutral-100 last:border-b-0 align-top">
                <td className="px-5 py-3">
                  <span className="text-body3 font-medium text-cool-900">{p.pillar}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-body3 font-semibold text-cool-800">
                    {formatPercent(p.value)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {p.passing ? (
                    <span className="inline-flex items-center gap-1 text-grass-600">
                      <Check className="h-3.5 w-3.5" />
                      <span className="text-label font-medium">Pass</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-tomato-500">
                      <X className="h-3.5 w-3.5" />
                      <span className="text-label font-medium">Fail</span>
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {insight ? (
                    <div className="space-y-2">
                      <p className="text-label text-cool-600">{insight.description}</p>
                      {insight.product && (
                        <a
                          href={`${BASENAME}/marketplace?insight=${insight.id}&products=${insight.product.productIds.join(',')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group mt-0.5 flex items-start gap-2 text-left rounded-md border border-plum-100 bg-plum-25 px-3 py-2 transition-colors hover:bg-plum-50 hover:border-plum-200"
                        >
                          <div className="text-label">
                            <span className="font-semibold text-plum-700">Recommendation:</span>{' '}
                            <span className="text-cool-600">{insight.product.productName} — {insight.product.productDescription}</span>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-plum-400 flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5 group-hover:text-plum-600" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-label text-cool-400">Meets the {p.threshold}% threshold.</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
