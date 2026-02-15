import { useEffect, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatNumber, formatPercent } from '@/lib/formatters';
import { getAdSetHealth, getAuthenticRateColor, getCampaignCreativeAverages } from '@/lib/authentic-ad-utils';
import { getAdSetDiagnosticData } from '@/lib/mock-ad-set-diagnostics';
import { AdSetDiagnostic } from '@/components/campaign/AdSetDiagnostic';
import { colors } from '@/tokens/foundry';
import type { Campaign, AdSet, HealthStatus } from '@/types/goal';

const BASENAME = '/dv-pinnacle-v3';

interface AdSetExplorerProps {
  campaign: Campaign;
  selectedAdSetId: string | null;
  onAdSetSelect: (adSetId: string) => void;
}

const HEALTH_SPARKLINE_COLORS: Record<HealthStatus, string> = {
  'on-track': colors.grass[500],
  'at-risk': colors.orange[500],
  'needs-attention': colors.tomato[500],
};

function MiniSparkline({ data, health }: { data: number[]; health: HealthStatus }) {
  const chartData = data.map((v, i) => ({ idx: i, val: v }));
  const color = HEALTH_SPARKLINE_COLORS[health];
  return (
    <ResponsiveContainer width={60} height={20}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line type="monotone" dataKey="val" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function AdSetListItem({
  adSet,
  isSelected,
  onSelect,
  itemRef,
}: {
  adSet: AdSet;
  isSelected: boolean;
  onSelect: () => void;
  itemRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const health = getAdSetHealth(adSet);
  const diagnostic = getAdSetDiagnosticData(adSet);

  return (
    <button
      ref={itemRef}
      onClick={onSelect}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-neutral-100 transition-colors',
        isSelected
          ? 'bg-plum-25 border-l-2 border-l-plum-600'
          : 'border-l-2 border-l-transparent hover:bg-neutral-25'
      )}
    >
      <p className="text-body3 font-medium text-cool-900 truncate">{adSet.platformAdSetName}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <StatusBadge healthStatus={health} />
        <span className="text-label text-cool-500">{formatNumber(adSet.impressions)} impr</span>
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <MiniSparkline data={diagnostic.aarTrend} health={health} />
        <span className={cn('text-label font-semibold', getAuthenticRateColor(adSet.authenticAdRate))}>
          {formatPercent(adSet.authenticAdRate)}
        </span>
      </div>
      {health !== 'on-track' && (
        <a
          href={`${BASENAME}/site-list?adSet=${adSet.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 mt-2 text-label font-medium text-plum-600 hover:text-plum-800 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View Site List
        </a>
      )}
    </button>
  );
}

export function AdSetExplorer({ campaign, selectedAdSetId, onAdSetSelect }: AdSetExplorerProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const campaignAvgs = getCampaignCreativeAverages(campaign);

  const selectedAdSet = campaign.adSets.find(as => as.id === selectedAdSetId) ?? campaign.adSets[0];

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedAdSetId]);

  if (campaign.adSets.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <p className="text-body3 text-cool-500">No ad sets in this campaign.</p>
      </div>
    );
  }

  return (
    <div className="flex rounded-xl border border-neutral-200 bg-white overflow-hidden min-h-[500px]">
      {/* Left Pane: Ad Set List */}
      <div className="w-80 flex-shrink-0 border-r border-neutral-200 overflow-y-auto">
        <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-25">
          <h3 className="text-label font-semibold text-cool-600 uppercase tracking-wide">
            Ad Sets ({campaign.adSets.length})
          </h3>
        </div>
        {campaign.adSets.map(adSet => (
          <AdSetListItem
            key={adSet.id}
            adSet={adSet}
            isSelected={adSet.id === selectedAdSetId}
            onSelect={() => onAdSetSelect(adSet.id)}
            itemRef={adSet.id === selectedAdSetId ? selectedRef : undefined}
          />
        ))}
      </div>

      {/* Right Pane: Ad Set Diagnostic */}
      <div className="flex-1 overflow-hidden">
        {selectedAdSet && (
          <AdSetDiagnostic adSet={selectedAdSet} campaignAvgs={campaignAvgs} />
        )}
      </div>
    </div>
  );
}
