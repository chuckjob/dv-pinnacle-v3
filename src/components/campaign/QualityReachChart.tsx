import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { formatNumber, formatPercent } from '@/lib/formatters';
import { getAdSetHealth } from '@/lib/authentic-ad-utils';
import { colors } from '@/tokens/foundry';
import type { AdSet, HealthStatus } from '@/types/goal';

interface QualityReachChartProps {
  adSets: AdSet[];
  campaignAar: number;
  selectedAdSetId: string | null;
  onAdSetSelect: (adSetId: string) => void;
}

interface ScatterDataPoint {
  adSetId: string;
  name: string;
  impressions: number;
  authenticAdRate: number;
  health: HealthStatus;
}

const HEALTH_COLORS: Record<HealthStatus, string> = {
  'on-track': colors.grass[500],
  'at-risk': colors.orange[500],
  'needs-attention': colors.tomato[500],
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ScatterDataPoint }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-cool-900 mb-1">{d.name}</p>
      <p className="text-cool-600">AAR: <span className="font-medium text-cool-800">{formatPercent(d.authenticAdRate)}</span></p>
      <p className="text-cool-600">Impressions: <span className="font-medium text-cool-800">{formatNumber(d.impressions)}</span></p>
    </div>
  );
}

export function QualityReachChart({ adSets, campaignAar, selectedAdSetId, onAdSetSelect }: QualityReachChartProps) {
  const dataPoints = useMemo<ScatterDataPoint[]>(() =>
    adSets.map(as => ({
      adSetId: as.id,
      name: as.platformAdSetName.length > 30 ? as.platformAdSetName.slice(0, 28) + '…' : as.platformAdSetName,
      impressions: as.impressions,
      authenticAdRate: as.authenticAdRate,
      health: getAdSetHealth(as),
    })),
    [adSets]
  );

  const medianImpressions = useMemo(() => {
    const sorted = [...dataPoints].sort((a, b) => a.impressions - b.impressions);
    return sorted[Math.floor(sorted.length / 2)]?.impressions ?? 0;
  }, [dataPoints]);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-body2 font-semibold text-cool-900">Quality vs. Reach</h3>
        <div className="flex items-center gap-4 text-label text-cool-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.grass[500] }} />On Track</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.orange[500] }} />At Risk</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.tomato[500] }} />Needs Attention</span>
        </div>
      </div>

      <div className="relative">
        {/* Quadrant labels */}
        <div className="absolute top-2 left-12 text-label text-cool-400 pointer-events-none z-10">Niche Quality</div>
        <div className="absolute top-2 right-8 text-label font-medium text-grass-600 pointer-events-none z-10">Scalable High Quality</div>
        <div className="absolute bottom-8 left-12 text-label text-cool-300 pointer-events-none z-10">Underperforming</div>
        <div className="absolute bottom-8 right-8 text-label text-tomato-500 pointer-events-none z-10">Trash Reach</div>

        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[100]} />
            <XAxis
              type="number"
              dataKey="impressions"
              name="Impressions"
              tick={{ fontSize: 11, fill: colors.cool[500] }}
              tickFormatter={(v: number) => formatNumber(v)}
              axisLine={{ stroke: colors.neutral[200] }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="authenticAdRate"
              name="Authentic Ad Rate"
              tick={{ fontSize: 11, fill: colors.cool[500] }}
              tickFormatter={(v: number) => `${v}%`}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <ReferenceLine y={campaignAar} stroke={colors.plum[300]} strokeDasharray="5 5" label={{ value: `Campaign AAR ${campaignAar.toFixed(1)}%`, position: 'right', fontSize: 10, fill: colors.plum[400] }} />
            <ReferenceLine x={medianImpressions} stroke={colors.plum[300]} strokeDasharray="5 5" />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Scatter
              data={dataPoints}
              onClick={(entry: ScatterDataPoint) => onAdSetSelect(entry.adSetId)}
              style={{ cursor: 'pointer' }}
            >
              {dataPoints.map((point) => (
                <Cell
                  key={point.adSetId}
                  fill={HEALTH_COLORS[point.health]}
                  stroke={selectedAdSetId === point.adSetId ? colors.plum[600] : 'transparent'}
                  strokeWidth={selectedAdSetId === point.adSetId ? 3 : 0}
                  r={selectedAdSetId === point.adSetId ? 8 : 6}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
