import { cn } from '@/lib/utils';
import type { HealthStatus, EntityStatus } from '@/types/goal';

const healthStyles: Record<HealthStatus, string> = {
  'on-track': 'bg-grass-50 text-grass-700',
  'at-risk': 'bg-orange-50 text-orange-700',
  'needs-attention': 'bg-tomato-50 text-tomato-700',
};

const healthLabels: Record<HealthStatus, string> = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  'needs-attention': 'Needs Attention',
};

const statusStyles: Record<EntityStatus, string> = {
  'active': 'bg-grass-50 text-grass-700',
  'paused': 'bg-orange-50 text-orange-700',
  'draft': 'bg-neutral-100 text-cool-600',
};

const statusLabels: Record<EntityStatus, string> = {
  'active': 'Active',
  'paused': 'Paused',
  'draft': 'Draft',
};

interface StatusBadgeProps {
  status?: EntityStatus;
  healthStatus?: HealthStatus;
  className?: string;
}

export function StatusBadge({ status, healthStatus, className }: StatusBadgeProps) {
  if (healthStatus) {
    return (
      <span className={cn('inline-flex items-center gap-1 px-1.5 py-px rounded-full text-label font-medium', healthStyles[healthStatus], className)}>
        <span className={cn('w-1 h-1 rounded-full', {
          'bg-grass-500': healthStatus === 'on-track',
          'bg-orange-500': healthStatus === 'at-risk',
          'bg-tomato-500': healthStatus === 'needs-attention',
        })} />
        {healthLabels[healthStatus]}
      </span>
    );
  }

  if (status) {
    return (
      <span className={cn('inline-flex items-center px-1.5 py-px rounded-full text-label font-medium', statusStyles[status], className)}>
        {statusLabels[status]}
      </span>
    );
  }

  return null;
}
