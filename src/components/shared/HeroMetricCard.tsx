import { cn } from '@/lib/utils';
import { TrendIndicator } from './TrendIndicator';

interface HeroMetricCardProps {
  label: string;
  value: string;
  description?: string;
  valueColorClass?: string;
  trend?: number;
  trendDirection?: 'up' | 'down';
  isPositive?: boolean;
  className?: string;
}

export function HeroMetricCard({
  label,
  value,
  description,
  valueColorClass,
  trend,
  trendDirection,
  isPositive,
  className,
}: HeroMetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 bg-white p-6',
        className
      )}
    >
      <p className="text-label text-cool-500 uppercase tracking-wide">{label}</p>
      <div className="flex items-end gap-3 mt-2">
        <span className={cn('text-h3 font-bold', valueColorClass || 'text-cool-900')}>
          {value}
        </span>
        {trend !== undefined && trendDirection && isPositive !== undefined && (
          <TrendIndicator value={trend} direction={trendDirection} isPositive={isPositive} />
        )}
      </div>
      {description && (
        <p className="text-body3 text-cool-500 mt-2">{description}</p>
      )}
    </div>
  );
}
