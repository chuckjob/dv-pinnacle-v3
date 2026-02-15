import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  pageSize?: number;
  keyAccessor: keyof T;
  className?: string;
}

export function DataTable<T>({ data, columns, onRowClick, pageSize = 10, keyAccessor, className }: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const getValue = (row: T, accessor: ColumnDef<T>['accessor']) => {
    if (typeof accessor === 'function') return accessor(row);
    return row[accessor];
  };

  const sorted = useMemo(() => {
    if (!sortCol) return data;
    const col = columns.find(c => c.id === sortCol);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const aVal = getValue(a, col.accessor);
      const bVal = getValue(b, col.accessor);
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortCol, sortDir, columns]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (colId: string) => {
    if (sortCol === colId) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(colId);
      setSortDir('asc');
    }
  };

  return (
    <div className={cn('rounded-xl border border-neutral-200 bg-white overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-25">
              {columns.map(col => (
                <th
                  key={col.id}
                  className={cn(
                    'px-4 py-3 text-label font-semibold text-cool-600 whitespace-nowrap',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.sortable && 'cursor-pointer select-none hover:text-cool-900 transition-colors'
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && toggleSort(col.id)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortCol === col.id
                        ? (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)
                        : <ArrowUpDown className="h-3 w-3 text-cool-300" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr
                key={String(row[keyAccessor])}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-neutral-100 last:border-0 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-plum-25'
                )}
              >
                {columns.map(col => {
                  const val = getValue(row, col.accessor);
                  return (
                    <td
                      key={col.id}
                      className={cn(
                        'px-4 py-3 text-body3 text-cool-700',
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      )}
                    >
                      {col.render ? col.render(val, row) : String(val ?? '')}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
          <span className="text-label text-cool-500">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-md hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-cool-600" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  'w-8 h-8 rounded-md text-label font-medium transition-colors',
                  page === i ? 'bg-plum-600 text-white' : 'text-cool-600 hover:bg-neutral-50'
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-md hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-cool-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
