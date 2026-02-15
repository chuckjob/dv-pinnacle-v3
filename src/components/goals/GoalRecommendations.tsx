import { useState } from 'react';
import { Sparkles, Check, X, AlertTriangle, TrendingUp, Shield, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Goal } from '@/types/goal';

interface Recommendation {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  impact: string;
  type: 'optimization' | 'warning' | 'safety';
}

function getRecommendations(goal: Goal): Recommendation[] {
  const recs: Recommendation[] = [];

  if (goal.authenticAdRate < 65) {
    recs.push({
      id: 'authentic-rate',
      icon: Shield,
      title: 'Low Authentic Ad Rate',
      description: `Your DV Authentic Ad Rate is ${goal.authenticAdRate.toFixed(1)}%, below the 65% threshold. Multiple pillars may be underperforming. Review fraud, viewability, suitability, and geo compliance to identify the weakest areas.`,
      impact: 'Could improve authentic rate by 10-15%',
      type: 'warning',
    });
  }

  if (goal.viewabilityRate < 70) {
    recs.push({
      id: 'viewability',
      icon: TrendingUp,
      title: 'Improve Viewability Rate',
      description: `Current viewability is ${goal.viewabilityRate.toFixed(1)}%, below the ${goal.kpis.find(k => k.type === 'viewability')?.target ?? 70}% target. Consider shifting budget to higher-performing placements.`,
      impact: 'Could improve viewability by 8-12%',
      type: 'optimization',
    });
  }

  if (goal.fraudRate > 2) {
    recs.push({
      id: 'fraud',
      icon: AlertTriangle,
      title: 'High Fraud Rate Detected',
      description: `Fraud rate is ${goal.fraudRate.toFixed(1)}% across ${goal.campaigns.length} campaigns. Open web campaigns show higher fraud signals. Consider enabling stricter pre-bid fraud filtering.`,
      impact: 'Could reduce fraud exposure by ~60%',
      type: 'warning',
    });
  }

  if (goal.inGeoRate < 95) {
    recs.push({
      id: 'in-geo',
      icon: MapPin,
      title: 'Geo-Compliance Below Threshold',
      description: `In-Geo rate is ${goal.inGeoRate.toFixed(1)}%, below the 95% target. Some impressions are being served outside the target geography. Review geo-targeting settings and consider adding geo-verification pre-bid filters.`,
      impact: 'Could improve geo-compliance by 3-5%',
      type: 'optimization',
    });
  }

  recs.push({
    id: 'safety',
    icon: Shield,
    title: 'Brand Suitability Optimization Available',
    description: `Your brand suitability rate is ${goal.brandSuitabilityRate.toFixed(1)}%. Based on your industry benchmarks, relaxing "election" keyword blocking for educational content could recover additional safe inventory.`,
    impact: 'Could increase reach by ~3%',
    type: 'safety',
  });

  if (goal.attentionIndex < 65) {
    recs.push({
      id: 'attention',
      icon: TrendingUp,
      title: 'Boost Attention Index',
      description: `Your attention index is ${goal.attentionIndex}, below the industry average of 65. Consider testing video formats or larger creative units for higher engagement.`,
      impact: 'Could improve attention by 15-20%',
      type: 'optimization',
    });
  }

  return recs;
}

const typeStyles = {
  optimization: { bg: 'bg-turquoise-25', border: 'border-turquoise-300', icon: 'text-turquoise-700' },
  warning: { bg: 'bg-orange-25', border: 'border-orange-500', icon: 'text-orange-700' },
  safety: { bg: 'bg-plum-25', border: 'border-plum-300', icon: 'text-plum-600' },
};

export function GoalRecommendations({ goal }: { goal: Goal }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const recommendations = getRecommendations(goal).filter(r => !dismissed.has(r.id));

  return (
    <div className="space-y-3">
      {recommendations.map(rec => {
        const styles = typeStyles[rec.type];
        const isApplied = applied.has(rec.id);
        return (
          <div
            key={rec.id}
            className={cn(
              'rounded-xl border p-4 transition-all',
              isApplied ? 'border-grass-200 bg-grass-25' : styles.border, !isApplied && styles.bg
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', isApplied ? 'bg-grass-100' : styles.bg)}>
                {isApplied ? (
                  <Check className="h-4 w-4 text-grass-600" />
                ) : (
                  <rec.icon className={cn('h-4 w-4', styles.icon)} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={cn('text-body3 font-semibold', isApplied ? 'text-grass-700' : 'text-cool-900')}>
                    {isApplied ? `${rec.title} — Applied` : rec.title}
                  </h4>
                </div>
                <p className="text-body3 text-cool-600 mt-0.5">{rec.description}</p>
                <p className={cn('text-label font-medium mt-1', isApplied ? 'text-grass-600' : 'text-turquoise-700')}>
                  {rec.impact}
                </p>
                {!isApplied && (
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setApplied(prev => new Set([...prev, rec.id]))}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-plum-600 text-white text-label font-medium hover:bg-plum-700 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Apply
                    </button>
                    <button
                      onClick={() => setDismissed(prev => new Set([...prev, rec.id]))}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-cool-600 text-label font-medium hover:bg-neutral-50 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {recommendations.length === 0 && (
        <div className="rounded-xl border border-grass-200 bg-grass-25 p-8 text-center">
          <Sparkles className="h-8 w-8 text-grass-500 mx-auto mb-2" />
          <h3 className="text-body2 font-semibold text-grass-700">All caught up!</h3>
          <p className="text-body3 text-cool-500 mt-1">No pending recommendations for this goal.</p>
        </div>
      )}
    </div>
  );
}
