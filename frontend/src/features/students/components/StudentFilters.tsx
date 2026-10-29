import React from 'react';
import {
  Search,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Users,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface StudentFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  cityFilter: string;
  onCityFilterChange: (val: string) => void;
  availableCities: string[];
  viewMode?: 'grid' | 'table';
  onViewModeChange?: (mode: 'grid' | 'table') => void;
  onNewStudent: () => void;
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  cityFilter,
  onCityFilterChange,
  availableCities,
  viewMode = 'grid',
  onViewModeChange,
  onNewStudent,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Find student records</h2>
          <p className="mt-0.5 text-xs text-slate-500">Search, filter, and manage the student directory.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search students</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or student ID..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />
        </label>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:items-center">
          <label className="relative min-w-0">
            <span className="sr-only">Filter by academic status</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 sm:min-w-[190px]"
            >
              <option value="All">All academic statuses</option>
              <option value="Active">Active</option>
              <option value="Graduated">Graduated</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌄</span>
          </label>

          <label className="relative min-w-0">
            <span className="sr-only">Filter by city</span>
            <select
              value={cityFilter}
              onChange={(e) => onCityFilterChange(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 sm:min-w-[180px] xl:max-w-[220px]"
            >
              <option value="All">All student regions</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌄</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onViewModeChange && (
            <div className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1" role="group" aria-label="Student display mode">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`inline-flex h-9 w-10 items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'
                }`}
                title="Card grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                aria-pressed={viewMode === 'table'}
                className={`inline-flex h-9 w-10 items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'
                }`}
                title="Table view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={onNewStudent}
            className="h-11 rounded-xl px-4 shadow-sm shadow-indigo-600/15"
          >
            Admit Student
          </Button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <Users className="h-3.5 w-3.5" />
        <span>Use the filters to narrow the directory without changing student records.</span>
      </div>
    </section>
  );
};
