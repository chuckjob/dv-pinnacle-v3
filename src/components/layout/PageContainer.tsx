import { ReactNode } from 'react';
import { Breadcrumbs } from './Breadcrumbs';

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1440px] mx-auto px-4 pt-2 pb-4">
        <div className="rounded-2xl bg-white shadow-sm p-6 min-h-[calc(100vh-6rem)]">
          <Breadcrumbs />
          {children}
        </div>
      </div>
    </div>
  );
}
