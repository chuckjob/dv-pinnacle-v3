import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { mockGoals } from '@/data/mock-goals';
import { HeroMetricCard } from '@/components/shared/HeroMetricCard';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { IssueBadgeList } from '@/components/shared/IssueBadge';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { formatNumber, formatCompactCurrency, formatPercent } from '@/lib/formatters';
import { getIssues, getAuthenticRateColor } from '@/lib/authentic-ad-utils';
import { cn } from '@/lib/utils';
import type { Goal } from '@/types/goal';

const goalColumns: ColumnDef<Goal>[] = [
  {
    id: 'name',
    header: 'Goal Name',
    accessor: 'name',
    sortable: true,
    render: (val) => <span className="font-medium text-cool-900">{val}</span>,
  },
  {
    id: 'totalSpend',
    header: 'Total Spend',
    accessor: 'totalSpend',
    sortable: true,
    align: 'right',
    render: (val) => <span className="font-medium text-cool-900">{formatCompactCurrency(val)}</span>,
  },
  {
    id: 'authenticAdRate',
    header: 'Authentic Ad Rate',
    accessor: 'authenticAdRate',
    sortable: true,
    align: 'right',
    render: (val) => (
      <span className={cn('font-semibold', getAuthenticRateColor(val))}>
        {formatPercent(val)}
      </span>
    ),
  },
  {
    id: 'issue',
    header: 'Issue',
    accessor: (row: Goal) => getIssues(row).length,
    render: (_val, row) => <IssueBadgeList issues={getIssues(row)} />,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'healthStatus',
    render: (val) => <StatusBadge healthStatus={val} />,
  },
];

export default function Overview() {
  const navigate = useNavigate();

  const totalImpressions = mockGoals.reduce((sum, g) => sum + g.totalImpressions, 0);
  const totalSpend = mockGoals.reduce((sum, g) => sum + g.totalSpend, 0);

  // Weighted average Authentic Ad Rate (by impressions)
  const weightedAuthenticRate = mockGoals.reduce((sum, g) => sum + g.authenticAdRate * g.totalImpressions, 0) / totalImpressions;

  // Pillar averages (weighted by impressions)
  const weightedFraudFree = 100 - (mockGoals.reduce((sum, g) => sum + g.fraudRate * g.totalImpressions, 0) / totalImpressions);
  const weightedSuitability = mockGoals.reduce((sum, g) => sum + g.brandSuitabilityRate * g.totalImpressions, 0) / totalImpressions;
  const weightedViewability = mockGoals.reduce((sum, g) => sum + g.viewabilityRate * g.totalImpressions, 0) / totalImpressions;
  const weightedInGeo = mockGoals.reduce((sum, g) => sum + g.inGeoRate * g.totalImpressions, 0) / totalImpressions;

  const needsAttention = mockGoals.filter(g => g.healthStatus === 'needs-attention');
  const atRisk = mockGoals.filter(g => g.healthStatus === 'at-risk');
  const activeGoals = mockGoals.filter(g => g.status === 'active');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h4 text-cool-900">Overview</h1>
        <p className="text-body3 text-cool-500 mt-0.5">Cross-goal performance at a glance</p>
      </div>

      {/* Vera Insights */}
      <div className="rounded-xl border border-plum-200 bg-plum-25 p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-plum-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-plum-600" />
          </div>
          <div>
            <h3 className="text-body3 font-semibold text-plum-800">Vera Insights</h3>
            <p className="text-body3 text-cool-600 mt-0.5">
              {needsAttention.length > 0 && (
                <span className="text-tomato-600 font-medium">{needsAttention.length} goal{needsAttention.length > 1 ? 's' : ''} need{needsAttention.length === 1 ? 's' : ''} attention. </span>
              )}
              {atRisk.length > 0 && (
                <span className="text-orange-600 font-medium">{atRisk.length} goal{atRisk.length > 1 ? 's are' : ' is'} at risk. </span>
              )}
              {activeGoals.length > 0 && (
                <span>You have {activeGoals.length} active goal{activeGoals.length > 1 ? 's' : ''} running across {new Set(mockGoals.flatMap(g => g.platforms)).size} platforms.</span>
              )}
              {needsAttention.length === 0 && atRisk.length === 0 && (
                <span className="text-grass-600 font-medium">All goals on track.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Authentic Ad Rate (hero) + Total Spend + Impressions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="col-span-2">
          <HeroMetricCard
            label="Authentic Ad Rate"
            value={formatPercent(weightedAuthenticRate)}
            description="Percentage of impressions passing all quality pillars"
            valueColorClass={getAuthenticRateColor(weightedAuthenticRate)}
            trend={2.1}
            trendDirection="up"
            isPositive
            className="h-full"
          />
        </div>
        <MetricCard
          label="Total Spend"
          value={formatCompactCurrency(totalSpend)}
          valueClassName="text-h3"
          className="p-6"
          trend={2.3}
          trendDirection="up"
          isPositive={false}
        />
        <MetricCard
          label="Impressions"
          value={formatNumber(totalImpressions)}
          valueClassName="text-h3"
          className="p-6"
          trend={4.8}
          trendDirection="up"
          isPositive
        />
      </div>

      {/* Quality Pillars: 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="Fraud-Free"
          value={formatPercent(weightedFraudFree)}
          trend={0.3}
          trendDirection="up"
          isPositive
          variant={(100 - weightedFraudFree) > 2 ? 'warning' : 'default'}
        />
        <MetricCard
          label="Brand Suitable"
          value={formatPercent(weightedSuitability)}
          trend={0.4}
          trendDirection="up"
          isPositive
          variant={weightedSuitability < 95 ? 'warning' : 'default'}
        />
        <MetricCard
          label="Viewable"
          value={formatPercent(weightedViewability)}
          trend={1.5}
          trendDirection="up"
          isPositive
          variant={weightedViewability < 70 ? 'warning' : 'default'}
        />
        <MetricCard
          label="In-Geo"
          value={formatPercent(weightedInGeo)}
          trend={0.2}
          trendDirection="up"
          isPositive
          variant={weightedInGeo < 95 ? 'warning' : 'default'}
        />
      </div>

      {/* Goals Table */}
      <div className="border-t border-neutral-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-body2 font-semibold text-cool-900">All Goals</h3>
          <button
            onClick={() => navigate('/goals')}
            className="inline-flex items-center gap-1 text-body3 font-medium text-plum-600 hover:text-plum-700 transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <DataTable
          data={mockGoals}
          columns={goalColumns}
          keyAccessor="id"
          onRowClick={(g) => navigate(`/goals/${g.id}`)}
          pageSize={10}
          className="border-0 shadow-none"
        />
      </div>
    </div>
  );
}
