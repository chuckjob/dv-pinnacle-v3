import { cn } from '@/lib/utils';
import { type PillarIssue } from '@/lib/authentic-ad-utils';

interface IssueBadgeProps {
  issue: PillarIssue;
  className?: string;
}

export function IssueBadge({ issue, className }: IssueBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-label font-medium bg-neutral-100 text-cool-700',
        className
      )}
    >
      {issue}
    </span>
  );
}

interface IssueBadgeListProps {
  issues: PillarIssue[];
  className?: string;
}

export function IssueBadgeList({ issues, className }: IssueBadgeListProps) {
  if (issues.length === 0) {
    return <span className={cn('text-label text-cool-400', className)}>None</span>;
  }

  return (
    <div className={cn('flex items-center gap-1 flex-wrap', className)}>
      {issues.map(issue => (
        <IssueBadge key={issue} issue={issue} />
      ))}
    </div>
  );
}
