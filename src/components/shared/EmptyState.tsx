import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-cool-400" />
      </div>
      <h3 className="text-body2 font-semibold text-cool-700 mb-1">{title}</h3>
      {description && <p className="text-body3 text-cool-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
