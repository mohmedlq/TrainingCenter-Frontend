import React from 'react';
import type { Instructor } from '../../../types/Instructor';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { ArrowUpRight, Users, UserRoundCheck } from 'lucide-react';

interface FacultyLeadSummaryProps {
  instructors: Instructor[];
  onViewAll?: () => void;
}

export const FacultyLeadSummary: React.FC<FacultyLeadSummaryProps> = ({
  instructors,
  onViewAll,
}) => {
  const safeInstructors = Array.isArray(instructors) ? instructors : [];
  const activeCount = safeInstructors.filter((instructor) => instructor.isActive).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
            <UserRoundCheck className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Faculty directory</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Instructor availability and reporting lines.
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-semibold leading-none tabular-nums text-slate-900">{activeCount}</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">Active</p>
        </div>
      </header>

      <div className="space-y-2.5 p-4 sm:p-5">
        {safeInstructors.slice(0, 4).map((instructor) => (
          <div
            key={instructor.instructorId}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:border-slate-200 hover:bg-slate-50/80"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar
                name={`${instructor.firstName} ${instructor.lastName}`}
                size="sm"
                status={instructor.isActive ? 'online' : 'offline'}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {instructor.firstName} {instructor.lastName}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500" title={instructor.email}>
                  {instructor.email}
                </p>
                <p className="mt-1 truncate text-[10px] text-slate-400">
                  {instructor.managerId
                    ? `Reports to manager #${instructor.managerId}`
                    : 'No reporting manager assigned'}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Badge variant={instructor.isActive ? 'success' : 'neutral'} size="sm" dot>
                {instructor.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        ))}

        {safeInstructors.length === 0 && (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
              <Users className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-medium text-slate-700">No instructors found</p>
            <p className="mt-1 text-xs text-slate-500">Instructor records will appear here when available.</p>
          </div>
        )}
      </div>

      {onViewAll && (
        <footer className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onViewAll}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            View all instructors
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </footer>
      )}
    </section>
  );
};
