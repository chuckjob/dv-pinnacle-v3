import { Sparkles, AlertTriangle, AlertCircle, Info, Check, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/formatters';
import { getAuthenticRateColor } from '@/lib/authentic-ad-utils';
import { getPillarScores, computeDiagnosticMetrics, generateInitiativeRecommendations } from '@/lib/campaign-diagnostics';
import type { Campaign } from '@/types/goal';
import type { InsightSeverity } from '@/lib/campaign-diagnostics';

const severityStyles: Record<InsightSeverity, { bg: string; border: string; icon: string }> = {
  critical: { bg: 'bg-tomato-25', border: 'border-tomato-300', icon: 'text-tomato-600' },
  warning: { bg: 'bg-orange-25', border: 'border-orange-500', icon: 'text-orange-600' },
  info: { bg: 'bg-turquoise-25', border: 'border-turquoise-300', icon: 'text-turquoise-700' },
};

const severityIcons: Record<InsightSeverity, React.ElementType> = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

export function InitiativeRecommendations({ campaign }: { campaign: Campaign }) {
  const pillars = getPillarScores(campaign);
  const diagnostics = computeDiagnosticMetrics(campaign);
  const insights = generateInitiativeRecommendations(campaign, diagnostics);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Compact Horizontal Scorecard Bar */}
      <div className="flex items-center gap-6 px-5 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="text-label font-medium text-cool-500 uppercase tracking-wide">AAR</span>
          <span className={cn('text-h5 font-bold', getAuthenticRateColor(campaign.authenticAdRate))}>
            {formatPercent(campaign.authenticAdRate)}
          </span>
        </div>
        <div className="h-5 w-px bg-neutral-200" />
        <div className="flex items-center gap-4 flex-wrap">
          {pillars.map(p => (
            <div key={p.pillar} className="flex items-center gap-1.5">
              <span className="text-label text-cool-600">{p.pillar}</span>
              <span className="text-label font-semibold text-cool-700">{formatPercent(p.value)}</span>
              {p.passing ? (
                <Check className="h-3 w-3 text-grass-600" />
              ) : (
                <X className="h-3 w-3 text-tomato-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Initiative Recommendations */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-plum-600" />
          <h3 className="text-body3 font-semibold text-cool-700">Initiative Recommendations</h3>
        </div>

        {insights.length === 0 ? (
          <div className="rounded-xl border border-grass-200 bg-grass-25 p-6 text-center">
            <Sparkles className="h-6 w-6 text-grass-500 mx-auto mb-2" />
            <h4 className="text-body3 font-semibold text-grass-700">All Clear</h4>
            <p className="text-label text-cool-500 mt-0.5">All quality pillars are passing for this campaign.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {insights.map(insight => {
              const styles = severityStyles[insight.severity];
              const Icon = severityIcons[insight.severity];
              return (
                <div
                  key={insight.id}
                  className={cn('rounded-lg border p-3', styles.border, styles.bg)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={cn('mt-0.5 flex-shrink-0', styles.icon)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-body3 font-semibold text-cool-900">{insight.title}</h4>
                      <p className="text-body3 text-cool-600 mt-0.5">{insight.description}</p>
                      {insight.pillar && (
                        <span className="inline-block mt-1 px-1.5 py-px rounded text-label font-medium bg-white/60 text-cool-500">
                          {insight.pillar}
                        </span>
                      )}
                      {insight.product && (
                        <div className="mt-2 flex items-start gap-2 rounded-md bg-white/80 px-2.5 py-2">
                          <Zap className="h-3.5 w-3.5 text-plum-600 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-label font-semibold text-plum-700">{insight.product.productName}</span>
                            <span className="text-label text-cool-500"> — {insight.product.productDescription}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
