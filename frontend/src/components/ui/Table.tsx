import React from 'react';

export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-xs">
      <table className={`w-full text-left text-sm text-zinc-600 ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <thead className={`bg-zinc-50 border-b border-zinc-200 text-xs font-semibold uppercase tracking-wider text-zinc-500 ${className}`}>
      {children}
    </thead>
  );
};

export const TableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}> = ({ children, className = '', onClick, hoverable = true }) => {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-zinc-100 last:border-0 transition-colors ${
        hoverable ? 'hover:bg-zinc-50/80 cursor-default' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHeadCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}> = ({ children, className = '', align = 'left' }) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <th scope="col" className={`px-4 py-3 text-xs font-semibold ${alignClass} ${className}`}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}> = ({ children, className = '', align = 'left' }) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <td className={`px-4 py-3.5 text-sm ${alignClass} ${className}`}>
      {children}
    </td>
  );
};

export const TablePagination: React.FC<{
  totalCount: number;
  currentPage?: number;
  pageSize?: number;
  label?: string;
}> = ({ totalCount, currentPage = 1, pageSize = 10, label = 'records' }) => {
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
      <div>
        Showing <span className="font-semibold text-zinc-800">{startItem}</span> to{' '}
        <span className="font-semibold text-zinc-800">{endItem}</span> of{' '}
        <span className="font-semibold text-zinc-800">{totalCount}</span> {label}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          className="inline-flex items-center justify-center px-2.5 py-1 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none"
        >
          Previous
        </button>
        <span className="px-2 text-zinc-800 font-medium">Page {currentPage}</span>
        <button
          type="button"
          disabled={endItem >= totalCount}
          className="inline-flex items-center justify-center px-2.5 py-1 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none"
        >
          Next
        </button>
      </div>
    </div>
  );
};
