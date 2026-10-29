import React from 'react';
import { BookOpen, Layers3, ListChecks } from 'lucide-react';
import type { Course } from '../../../types/Courses';
import { Badge } from '../../../components/ui/Badge';

interface CourseCapacityDistributionProps {
  courses: Course[];
}

export const CourseCapacityDistribution: React.FC<CourseCapacityDistributionProps> = ({
  courses,
}) => {
  const safeCourses = Array.isArray(courses) ? courses : [];

  const levelCounts = {
    Beginner: safeCourses.filter((course) => course.level === 'Beginner').length,
    Intermediate: safeCourses.filter((course) => course.level === 'Intermediate').length,
    Advanced: safeCourses.filter((course) => course.level === 'Advanced').length,
  };

  const statusCounts = {
    Published: safeCourses.filter((course) => course.status === 'Published').length,
    Active: safeCourses.filter((course) => course.status === 'Active').length,
    Draft: safeCourses.filter((course) => course.status === 'Draft').length,
    Archived: safeCourses.filter((course) => course.status === 'Archived').length,
  };

  const levels = [
    { label: 'Beginner', count: levelCounts.Beginner, bar: 'bg-sky-500', dot: 'bg-sky-500' },
    { label: 'Intermediate', count: levelCounts.Intermediate, bar: 'bg-indigo-500', dot: 'bg-indigo-500' },
    { label: 'Advanced', count: levelCounts.Advanced, bar: 'bg-violet-500', dot: 'bg-violet-500' },
  ];

  const statuses = [
    { label: 'Published', count: statusCounts.Published, variant: 'success' as const, dot: 'bg-emerald-500' },
    { label: 'Active', count: statusCounts.Active, variant: 'primary' as const, dot: 'bg-indigo-500' },
    { label: 'Draft', count: statusCounts.Draft, variant: 'warning' as const, dot: 'bg-amber-500' },
    { label: 'Archived', count: statusCounts.Archived, variant: 'neutral' as const, dot: 'bg-slate-400' },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700">
            <Layers3 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Course portfolio</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Course levels and catalog lifecycle.
            </p>
          </div>
        </div>
        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold tabular-nums text-slate-700">
          {safeCourses.length} total
        </span>
      </header>

      <div className="space-y-5 p-5">
        <section aria-labelledby="course-levels-heading">
          <div className="mb-3 flex items-center justify-between">
            <h4 id="course-levels-heading" className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <BookOpen className="h-4 w-4 text-slate-400" />
              Difficulty levels
            </h4>
            <span className="text-[11px] text-slate-400">By course count</span>
          </div>

          <div className="space-y-4">
            {levels.map((level) => {
              const percentage = safeCourses.length
                ? Math.round((level.count / safeCourses.length) * 100)
                : 0;

              return (
                <div key={level.label}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <span className={`h-2 w-2 rounded-full ${level.dot}`} />
                      {level.label}
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-slate-800">
                      {level.count}
                      <span className="ml-1.5 font-normal text-slate-400">{percentage}%</span>
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${level.bar}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {safeCourses.length === 0 && (
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Course-level statistics will appear when courses are available.
            </p>
          )}
        </section>

        <div className="border-t border-slate-100" />

        <section aria-labelledby="catalog-status-heading">
          <div className="mb-3 flex items-center justify-between">
            <h4 id="catalog-status-heading" className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <ListChecks className="h-4 w-4 text-slate-400" />
              Catalog status
            </h4>
            <span className="text-[11px] text-slate-400">Lifecycle</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {statuses.map((status) => (
              <div key={status.label} className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`} />
                  <span className="truncate text-xs font-medium text-slate-600">{status.label}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums text-slate-900">{status.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
        <Badge variant="neutral" size="sm">Curriculum</Badge>
        <span className="text-[11px] text-slate-500">Distribution reflects the currently loaded course records.</span>
      </footer>
    </section>
  );
};
