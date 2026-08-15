import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs sm:text-sm text-slate-500 mb-6 overflow-x-auto py-1 no-scrollbar">
      <button
        onClick={items[0]?.onClick}
        className="flex items-center hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        Home
      </button>

      {items.slice(1).map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {item.active ? (
            <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
              {item.label}
            </span>
          ) : (
            <button
              onClick={item.onClick}
              className="hover:text-blue-600 font-medium transition-colors whitespace-nowrap truncate max-w-[150px] sm:max-w-xs"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
