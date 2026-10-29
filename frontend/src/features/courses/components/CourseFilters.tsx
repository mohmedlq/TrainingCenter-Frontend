import React from 'react';
import { Search, Plus, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface CourseFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onNewCourse: () => void;
}

const selectClassName =
  'min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 sm:w-auto';

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onNewCourse,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0 flex-1">
          <label htmlFor="course-search" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Search catalog
          </label>
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="course-search"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by course title or code..."
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-0 flex-1 sm:flex-none">
            <label htmlFor="course-level-filter" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Skill level
            </label>
            <select
              id="course-level-filter"
              value={selectedLevel}
              onChange={(event) => onLevelChange(event.target.value)}
              className={selectClassName}
            >
              <option value="All">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="min-w-0 flex-1 sm:flex-none">
            <label htmlFor="course-status-filter" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Catalog status
            </label>
            <select
              id="course-status-filter"
              value={selectedStatus}
              onChange={(event) => onStatusChange(event.target.value)}
              className={selectClassName}
            >
              <option value="All">All statuses</option>
              <option value="Published">Published</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">View</span>
            <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 p-1" role="group" aria-label="Course display mode">
              <button
                type="button"
                aria-pressed={viewMode === 'grid'}
                onClick={() => onViewModeChange('grid')}
                className={`inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Card grid view"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden md:inline">Cards</span>
              </button>
              <button
                type="button"
                aria-pressed={viewMode === 'table'}
                onClick={() => onViewModeChange('table')}
                className={`inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table view"
              >
                <List className="h-4 w-4" />
                <span className="hidden md:inline">Table</span>
              </button>
            </div>
          </div>

          <div className="sm:pb-0">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={onNewCourse}
            >
              Add course
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>Refine the catalog by keyword, skill level, or publication status.</span>
      </div>
    </section>
  );
};
