import React from 'react';
import {
  Search,
  Plus,
  Filter,
  LayoutGrid,
  List,
  Users,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface InstructorFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (val: 'all' | 'active' | 'inactive') => void;
  selectedManager: string;
  onManagerChange: (managerId: string) => void;
  viewMode?: 'grid' | 'table';
  onViewModeChange?: (mode: 'grid' | 'table') => void;
  onNewInstructor: () => void;
}

export const InstructorFilters: React.FC<InstructorFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedManager,
  onManagerChange,
  viewMode = 'grid',
  onViewModeChange,
  onNewInstructor,
}) => {
  const hasFilters = searchQuery.trim().length > 0 || statusFilter !== 'all' || selectedManager !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onManagerChange('all');
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Find faculty</h2>
            <p className="mt-0.5 text-xs text-slate-500">Search and narrow the staff directory</p>
          </div>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search faculty</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, email, or username…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:items-center">
          <label className="relative min-w-0">
            <span className="sr-only">Employment status</span>
            <select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value as 'all' | 'active' | 'inactive')}
              className="h-11 w-full min-w-[190px] appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="all">All employment statuses</option>
              <option value="active">Active faculty</option>
              <option value="inactive">Inactive faculty</option>
            </select>
            <Filter className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </label>

          <label className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 transition hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 sm:min-w-[155px]">
            <Users className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="whitespace-nowrap text-xs font-medium text-slate-500">Manager ID</span>
            <input
              inputMode="numeric"
              value={selectedManager === 'all' ? '' : selectedManager}
              onChange={(event) => onManagerChange(event.target.value ? event.target.value : 'all')}
              placeholder="All"
              aria-label="Filter by manager ID"
              className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 xl:justify-end">
          {onViewModeChange && (
            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1" role="group" aria-label="Display mode">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                aria-pressed={viewMode === 'grid'}
                title="Card grid view"
                className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                aria-pressed={viewMode === 'table'}
                title="Table view"
                className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={onNewInstructor}
          >
            Add faculty
          </Button>
        </div>
      </div>
    </section>
  );
};
