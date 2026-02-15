import { Sparkles, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { computeDiagnosticMetrics, generateCampaignInsights } from '@/lib/campaign-diagnostics';
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

export function CampaignActionCenter({ campaign }: { campaign: Campaign }) {
  const diagnostics = computeDiagnosticMetrics(campaign);
  const insights = generateCampaignInsights(campaign, diagnostics);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-plum-600" />
        <h3 className="text-body3 font-semibold text-cool-700">Action Center</h3>
      </div>

      {insights.length === 0 ? (
        <div className="rounded-xl border border-grass-200 bg-grass-25 p-6 text-center">
          <Sparkles className="h-6 w-6 text-grass-500 mx-auto mb-2" />
          <h4 className="text-body3 font-semibold text-grass-700">All Clear</h4>
          <p className="text-label text-cool-500 mt-0.5">All quality pillars are passing for this campaign.</p>
        </div>
      ) : (
        <div className="space-y-3">
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
                  <div className="min-w-0">
                    <h4 className="text-body3 font-semibold text-cool-900">{insight.title}</h4>
                    <p className="text-body3 text-cool-600 mt-0.5">{insight.description}</p>
                    {insight.pillar && (
                      <span className="inline-block mt-1.5 px-1.5 py-px rounded text-label font-medium bg-white/60 text-cool-500">
                        {insight.pillar}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
