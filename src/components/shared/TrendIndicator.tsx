import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  value: number;
  direction: 'up' | 'down';
  isPositive: boolean;
  className?: string;
}

export function TrendIndicator({ value, direction, isPositive, className }: TrendIndicatorProps) {
  const colorClass = isPositive ? 'text-grass-600' : 'text-tomato-500';
  const Icon = direction === 'up' ? TrendingUp : TrendingDown;

  return (
    <span className={cn('inline-flex items-center gap-0.5 text-label font-medium', colorClass, className)}>
      <Icon className="h-3 w-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
