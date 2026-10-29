import React from 'react';
import {
  Search,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface EnrollmentFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  courseFilter: string;
  onCourseFilterChange: (val: string) => void;
  courses: { id: number; title: string; code: string }[];
  viewMode?: 'grid' | 'table';
  onViewModeChange?: (mode: 'grid' | 'table') => void;
  onNewEnrollment: () => void;
}

export const EnrollmentFilters: React.FC<EnrollmentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  courseFilter,
  onCourseFilterChange,
  courses,
  viewMode = 'grid',
  onViewModeChange,
  onNewEnrollment,
}) => {
  const hasFilters = searchQuery !== '' || statusFilter !== 'All' || courseFilter !== 'All';

  const resetFilters = () => {
    onSearchChange('');
    onStatusFilterChange('All');
    onCourseFilterChange('All');
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Find enrollment records</h2>
          <p className="mt-0.5 text-xs text-slate-500">Search and narrow the list by course or academic status.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search enrollments</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by student, email, course, or code..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />
        </label>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:items-center">
          <label className="min-w-0">
            <span className="sr-only">Filter by status</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="h-11 w-full min-w-[170px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="All">All statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Dropped">Dropped</option>
            </select>
          </label>

          <label className="min-w-0">
            <span className="sr-only">Filter by course</span>
            <select
              value={courseFilter}
              onChange={(e) => onCourseFilterChange(e.target.value)}
              className="h-11 w-full min-w-[190px] max-w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="All">All courses</option>
              {courses.map((course) => (
                <option key={course.id} value={String(course.id)}>
                  {course.code}: {course.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}

          {onViewModeChange && (
            <div className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-slate-100 p-1" aria-label="Choose view mode">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                aria-label="Card grid view"
                aria-pressed={viewMode === 'grid'}
                className={`flex h-8 w-9 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                aria-label="Table view"
                aria-pressed={viewMode === 'table'}
                className={`flex h-8 w-9 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={onNewEnrollment}
          >
            Enroll student
          </Button>
        </div>
      </div>
    </section>
  );
};
