import { useMemo } from 'react';
import { MapPin, ShieldAlert, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatNumber, formatPercent, formatCompactCurrency } from '@/lib/formatters';
import { getAuthenticRateColor, getAdHealth } from '@/lib/authentic-ad-utils';
import { getAdSetDiagnosticData } from '@/lib/mock-ad-set-diagnostics';
import { MediaContext } from '@/components/campaign/MediaContext';
import type { AdSet, Ad } from '@/types/goal';

interface AdSetDiagnosticProps {
  adSet: AdSet;
  campaignAvgs: { avgAttention: number; avgViewability: number };
}

export function AdSetDiagnostic({ adSet, campaignAvgs }: AdSetDiagnosticProps) {
  const diagnostic = getAdSetDiagnosticData(adSet);

  const adColumns = useMemo<ColumnDef<Ad>[]>(() => [
    { id: 'name', header: 'Creative', accessor: 'platformAdName', sortable: true, render: (val) => <span className="font-medium text-cool-900 text-label">{val}</span> },
    {
      id: 'format', header: 'Format', accessor: 'format',
      render: (val) => <span className="px-1.5 py-px rounded-full text-label font-medium bg-neutral-100 text-cool-600 capitalize">{val}</span>,
    },
    {
      id: 'authenticAdRate', header: 'AAR', accessor: 'authenticAdRate', sortable: true, align: 'right',
      render: (val) => <span className={cn('font-semibold text-label', getAuthenticRateColor(val))}>{formatPercent(val)}</span>,
    },
    {
      id: 'health', header: 'Health', accessor: (row: Ad) => getAdHealth(row, campaignAvgs.avgAttention, campaignAvgs.avgViewability),
      render: (val) => <StatusBadge healthStatus={val} />,
    },
    { id: 'spend', header: 'Spend', accessor: 'spend', sortable: true, align: 'right', render: (val) => formatCompactCurrency(val) },
    { id: 'impressions', header: 'Impressions', accessor: 'impressions', sortable: true, align: 'right', render: (val) => formatNumber(val) },
    { id: 'viewable', header: 'Viewable', accessor: 'viewableRate', sortable: true, align: 'right', render: (val) => formatPercent(val) },
  ], [campaignAvgs]);

  const gapIsPositive = diagnostic.cpaiEfficiencyGap.gapDollars > 0;

  return (
    <div className="p-5 space-y-5 overflow-y-auto">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* In-Geo Variance */}
        <div className="rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-cool-500" />
            <h4 className="text-label font-semibold text-cool-700">In-Geo Variance</h4>
            <span className={cn('ml-auto text-label font-semibold', adSet.inGeoRate >= 95 ? 'text-grass-600' : 'text-tomato-500')}>
              {formatPercent(adSet.inGeoRate)}
            </span>
          </div>
          <p className="text-label text-cool-400 mb-2">Top Off-Geo Regions</p>
          <div className="space-y-1">
            {diagnostic.offGeoRegions.map(r => (
              <div key={r.region} className="flex items-center justify-between">
                <span className="text-body3 text-cool-700">{r.region}</span>
                <span className="text-label font-semibold text-tomato-500">{r.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* SIVT by Category */}
        <div className="rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-4 w-4 text-cool-500" />
            <h4 className="text-label font-semibold text-cool-700">SIVT Breakdown</h4>
            <span className={cn('ml-auto text-label font-semibold', adSet.fraudScore <= 2 ? 'text-grass-600' : 'text-orange-600')}>
              {formatPercent(adSet.fraudScore)}
            </span>
          </div>
          <div className="space-y-2">
            {diagnostic.sivtCategories.map(c => (
              <div key={c.category}>
                <div className="flex items-center justify-between">
                  <span className="text-body3 font-medium text-cool-800">{c.category}</span>
                  <span className="text-label font-semibold text-orange-600">{c.percentage.toFixed(1)}%</span>
                </div>
                <p className="text-label text-cool-400">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CPAI Efficiency Gap */}
        <div className="rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-cool-500" />
            <h4 className="text-label font-semibold text-cool-700">CPAI Efficiency</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body3 text-cool-600">Target CPM</span>
              <span className="text-body3 font-semibold text-cool-800">${diagnostic.cpaiEfficiencyGap.targetCpm.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body3 text-cool-600">Actual CPAI</span>
              <span className="text-body3 font-semibold text-cool-800">${diagnostic.cpaiEfficiencyGap.actualCpai.toFixed(2)}</span>
            </div>
            <div className="border-t border-neutral-100 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-body3 font-medium text-cool-700">Gap</span>
                <span className={cn('text-body3 font-bold', gapIsPositive ? 'text-tomato-500' : 'text-grass-600')}>
                  {gapIsPositive ? '+' : ''}${diagnostic.cpaiEfficiencyGap.gapDollars.toFixed(2)}/1K
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Context */}
      <MediaContext blockedSites={diagnostic.blockedSites} />

      {/* Creative Table */}
      <div>
        <h4 className="text-body3 font-semibold text-cool-700 mb-2">Creatives ({adSet.ads.length})</h4>
        <DataTable
          data={adSet.ads}
          columns={adColumns}
          keyAccessor="id"
          pageSize={5}
          className="border-0 shadow-none"
        />
      </div>
    </div>
  );
}
