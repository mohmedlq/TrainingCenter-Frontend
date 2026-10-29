import React from 'react';
import type { Course } from '../../../types/Courses';
import { Badge } from '../../../components/ui/Badge';
import type { BadgeVariant } from '../../../components/ui/Badge';
import { Clock, Users, Edit2, ArrowUpRight, BookOpen, DollarSign } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';

interface CourseCardProps {
  course: Course;
  onSelect?: (course: Course) => void;
  onEdit?: (course: Course) => void;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  Published: 'success',
  Active: 'primary',
  Draft: 'warning',
  Archived: 'neutral',
};

const levelBadgeMap: Record<string, BadgeVariant> = {
  Beginner: 'info',
  Intermediate: 'primary',
  Advanced: 'default',
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, onEdit }) => {
  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!onSelect || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onSelect(course);
  };

  return (
    <article
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={onSelect ? `View ${course.title} course details` : undefined}
      onClick={() => onSelect?.(course)}
      onKeyDown={handleCardKeyDown}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 ${
        onSelect
          ? 'cursor-pointer hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
          : ''
      }`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 opacity-80" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-indigo-700">
              <BookOpen className="h-3.5 w-3.5" />
              {course.code}
            </span>
            <Badge variant={levelBadgeMap[course.level] || 'default'} size="sm">
              {course.level}
            </Badge>
          </div>
          <Badge variant={statusBadgeMap[course.status] || 'neutral'} dot size="sm">
            {course.status}
          </Badge>
        </div>

        <div className="mt-5 min-w-0">
          <h3 className="line-clamp-2 min-h-[3rem] text-lg font-semibold leading-6 tracking-tight text-slate-900 transition-colors group-hover:text-indigo-700">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-slate-500">
            {course.description || 'No course description has been added yet.'}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/80">
              <Clock className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Duration</span>
              <span className="mt-0.5 block truncate text-sm font-semibold text-slate-800">{course.durationHours} hrs</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sky-600 shadow-sm ring-1 ring-slate-200/80">
              <Users className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Enrolled</span>
              <span className="mt-0.5 block truncate text-sm font-semibold text-slate-800">{course.totalEnrolled || 0} students</span>
            </span>
          </div>
        </div>

        <div className="mt-5 flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3">
          <Avatar
            name={course.instructorName || `Faculty ${course.instructorId}`}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Lead instructor</span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-slate-800">
              {course.instructorName || `Faculty #${course.instructorId}`}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Tuition</span>
            <span className="mt-0.5 block whitespace-nowrap text-base font-bold tabular-nums text-slate-900">
              ${course.price.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-5">
          <span className="text-xs font-medium text-slate-500">Course details</span>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(course);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                title="Edit course"
                aria-label={`Edit ${course.title}`}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            <span className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-3.5 text-xs font-semibold text-white transition-colors group-hover:bg-indigo-600">
              View details
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
