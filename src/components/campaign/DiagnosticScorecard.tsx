import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/formatters';
import { getAuthenticRateColor } from '@/lib/authentic-ad-utils';
import { getPillarScores } from '@/lib/campaign-diagnostics';
import type { Campaign } from '@/types/goal';

export function DiagnosticScorecard({ campaign }: { campaign: Campaign }) {
  const pillars = getPillarScores(campaign);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-4">
        <span className="text-label font-medium text-cool-500 uppercase tracking-wide">DV Authentic Ad Rate</span>
        <div className={cn('text-h2 font-bold mt-1', getAuthenticRateColor(campaign.authenticAdRate))}>
          {formatPercent(campaign.authenticAdRate)}
        </div>
        <p className="text-label text-cool-400 mt-0.5">
          Percentage of impressions passing all quality pillars
        </p>
      </div>

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        {pillars.map(p => (
          <div key={p.pillar} className="flex items-center justify-between">
            <span className="text-body3 text-cool-600">{p.pillar}</span>
            <div className="flex items-center gap-2">
              <span className={cn('text-body3 font-semibold', p.passing ? 'text-cool-700' : 'text-cool-700')}>
                {formatPercent(p.value)}
              </span>
              {p.passing ? (
                <div className="flex items-center gap-1 text-grass-600">
                  <Check className="h-3.5 w-3.5" />
                  <span className="text-label font-medium">Pass</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-tomato-500">
                  <X className="h-3.5 w-3.5" />
                  <span className="text-label font-medium">&lt; {p.threshold}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
