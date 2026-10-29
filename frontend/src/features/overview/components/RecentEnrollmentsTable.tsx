import React from 'react';
import type { EnrollmentWithDetails } from '../../../types/Enrollments';
import { Badge } from '../../../components/ui/Badge';
import type { BadgeVariant } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { ArrowUpRight, Award, BookOpen, GraduationCap, UserRound } from 'lucide-react';

interface RecentEnrollmentsTableProps {
  enrollments: EnrollmentWithDetails[];
  onViewAll?: () => void;
  onEnrollmentClick?: (enrollment: EnrollmentWithDetails) => void;
}

const statusBadgeVariant: Record<string, BadgeVariant> = {
  Completed: 'success',
  'In Progress': 'primary',
  Enrolled: 'neutral',
  Dropped: 'danger',
};

export const RecentEnrollmentsTable: React.FC<RecentEnrollmentsTableProps> = ({
  enrollments,
  onViewAll,
  onEnrollmentClick,
}) => {
  const recentEnrollments = enrollments.slice(0, 5);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">Recent enrollments</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
              Open a record to review the student's academic profile.
            </p>
          </div>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:self-center"
          >
            All enrollments
            <ArrowUpRight className="h-4 w-4" />
          </button>
        )}
      </header>

      <div className="space-y-3 bg-slate-50/60 p-4 sm:p-5">
        {recentEnrollments.map((enrollment) => {
          const studentName = enrollment.studentName || `Student #${enrollment.studentId}`;
          const courseTitle = enrollment.courseTitle || `Course #${enrollment.courseId}`;
          const clickable = Boolean(onEnrollmentClick);

          const contents = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-colors group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-700">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-700">
                      {studentName}
                    </h4>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      {enrollment.studentEmail || `Student ID: #${enrollment.studentId}`}
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Enrollment #{enrollment.enrollmentId}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={statusBadgeVariant[enrollment.status] || 'neutral'} dot>
                    {enrollment.status}
                  </Badge>
                  {clickable && (
                    <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:p-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-600">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Enrolled course</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-800">{courseTitle}</p>
                    <span className="mt-1.5 inline-flex rounded-md border border-indigo-100 bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-indigo-700">
                      {enrollment.courseCode || `C-${enrollment.courseId}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_130px] sm:items-center">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-700">Learning progress</span>
                    <span className="text-[11px] text-slate-400">Completion</span>
                  </div>
                  <ProgressBar value={enrollment.progressPercent} size="sm" status={enrollment.status} showLabel />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:flex-col sm:items-start">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Award className="h-3.5 w-3.5" /> Final grade
                  </span>
                  {enrollment.finalGrade !== null && enrollment.finalGrade !== undefined ? (
                    <span className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                      {Number(enrollment.finalGrade).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-amber-700">Pending</span>
                  )}
                </div>
              </div>

              {clickable && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">Student academic profile</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                    Open record <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              )}
            </>
          );

          return (
            <article
              key={enrollment.enrollmentId}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              aria-label={clickable ? `Open academic profile for ${studentName}` : undefined}
              onClick={clickable ? () => onEnrollmentClick?.(enrollment) : undefined}
              onKeyDown={clickable ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onEnrollmentClick?.(enrollment);
                }
              } : undefined}
              className={`group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 sm:p-5 ${
                clickable
                  ? 'cursor-pointer hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
                  : ''
              }`}
            >
              {contents}
            </article>
          );
        })}

        {recentEnrollments.length === 0 && (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h4 className="mt-3 text-sm font-semibold text-slate-800">No enrollments yet</h4>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
              Enrollment records will appear here once students register for courses.
            </p>
          </div>
        )}
      </div>

      {recentEnrollments.length > 0 && (
        <footer className="flex items-center justify-between border-t border-slate-100 px-5 py-3 sm:px-6">
          <span className="text-xs text-slate-500">Latest enrollment activity</span>
          <span className="text-xs font-medium tabular-nums text-slate-400">
            {recentEnrollments.length} of {enrollments.length} records
          </span>
        </footer>
      )}
    </section>
  );
};
