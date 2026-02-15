export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface MetricSummary {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  trend: number;
  trendDirection: 'up' | 'down';
  isPositive: boolean;
  sparkline?: TimeSeriesPoint[];
}
