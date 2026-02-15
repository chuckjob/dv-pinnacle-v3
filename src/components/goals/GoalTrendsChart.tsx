import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import type { Goal } from '@/types/goal';
import { colors } from '@/tokens/foundry';

// Generate mock daily data for the goal's date range
function generateTrendData(goal: Goal) {
  const start = new Date(goal.dateRange.start);
  const end = new Date(goal.dateRange.end);
  const now = new Date();
  const dataEnd = end < now ? end : now;
  const days: any[] = [];

  for (let d = new Date(start); d <= dataEnd; d.setDate(d.getDate() + 1)) {
    const jitter = () => (Math.random() - 0.5) * 4;
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      authenticAdRate: Math.max(30, Math.min(100, goal.authenticAdRate + jitter())),
      viewability: Math.max(40, Math.min(100, goal.viewabilityRate + jitter())),
      suitability: Math.max(85, Math.min(100, goal.brandSuitabilityRate + jitter() * 0.5)),
      inGeo: Math.max(85, Math.min(100, goal.inGeoRate + jitter() * 0.5)),
      attention: Math.max(30, Math.min(100, goal.attentionIndex + jitter())),
      fraud: Math.max(0, Math.min(10, goal.fraudRate + jitter() * 0.3)),
    });
  }
  return days;
}

const metrics = [
  { key: 'authenticAdRate', label: 'Authentic Ad Rate', color: colors.berry[500], unit: '%' },
  { key: 'viewability', label: 'Viewability', color: colors.grass[500], unit: '%' },
  { key: 'suitability', label: 'Suitability', color: colors.turquoise[500], unit: '%' },
  { key: 'inGeo', label: 'In-Geo', color: colors.plum[500], unit: '%' },
  { key: 'attention', label: 'Attention', color: colors.orange[500], unit: '' },
  { key: 'fraud', label: 'Fraud', color: colors.tomato[500], unit: '%' },
];

export function GoalTrendsChart({ goal }: { goal: Goal }) {
  const [activeMetrics, setActiveMetrics] = useState<string[]>(['authenticAdRate', 'viewability']);
  const data = generateTrendData(goal);

  const toggleMetric = (key: string) => {
    setActiveMetrics(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-body2 font-semibold text-cool-900">Performance Trends</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {metrics.map(m => (
            <button
              key={m.key}
              onClick={() => toggleMetric(m.key)}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label font-medium transition-colors border',
                activeMetrics.includes(m.key)
                  ? 'border-current opacity-100'
                  : 'border-neutral-200 text-cool-400 opacity-60 hover:opacity-80'
              )}
              style={activeMetrics.includes(m.key) ? { color: m.color, borderColor: m.color } : undefined}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={224}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#71768e' }}
            axisLine={{ stroke: '#e6e6e6' }}
            tickLine={false}
            interval={Math.max(0, Math.floor(data.length / 8))}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#71768e' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e6e6e6', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          {metrics.map(m =>
            activeMetrics.includes(m.key) ? (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                stroke={m.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                name={m.label}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
