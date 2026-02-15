import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface BreadcrumbDropdownProps {
  currentLabel: string;
  items: Array<{ id: string; label: string }>;
  currentId: string;
  onSelect: (id: string) => void;
  isLast?: boolean;
}

export function BreadcrumbDropdown({ currentLabel, items, currentId, onSelect, isLast }: BreadcrumbDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-0.5 transition-colors hover:text-plum-600',
            isLast ? 'font-medium text-cool-700' : 'text-cool-500'
          )}
        >
          <span>{currentLabel}</span>
          <ChevronDown className="h-3 w-3 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
        {items.map(item => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              'cursor-pointer',
              item.id === currentId && 'bg-plum-50 text-plum-700 font-medium'
            )}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
