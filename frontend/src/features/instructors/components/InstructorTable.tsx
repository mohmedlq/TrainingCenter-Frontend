import React from 'react';
import type { Instructor } from '../../../types/Instructor';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Table, TableHeader, TableHeadCell, TableRow, TableCell, TablePagination } from '../../../components/ui/Table';
import {
  Edit2,
  KeyRound,
  Trash2,
  Mail,
  CalendarDays,
  Building2,
  DollarSign,
  ArrowUpRight,
  UserRound,
} from 'lucide-react';

interface InstructorTableProps {
  instructors: Instructor[];
  onEdit: (instructor: Instructor) => void;
  onChangePassword: (instructor: Instructor) => void;
  onDelete: (instructor: Instructor) => void;
  viewMode?: 'grid' | 'table';
}

const formatDate = (value: string | Date) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

export const InstructorTable: React.FC<InstructorTableProps> = ({
  instructors,
  onEdit,
  onChangePassword,
  onDelete,
  viewMode = 'grid',
}) => {
  if (viewMode === 'table') {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <TableHeadCell>Faculty member</TableHeadCell>
                <TableHeadCell>Username</TableHeadCell>
                <TableHeadCell>Hire date</TableHeadCell>
                <TableHeadCell align="right">Annual salary</TableHeadCell>
                <TableHeadCell>Supervisor</TableHeadCell>
                <TableHeadCell align="center">Status</TableHeadCell>
                <TableHeadCell align="right">Actions</TableHeadCell>
              </tr>
            </TableHeader>
            <tbody>
              {instructors.map((instructor) => (
                <TableRow key={instructor.instructorId}>
                  <TableCell>
                    <div className="flex min-w-[220px] items-center gap-3 py-1">
                      <Avatar
                        name={`${instructor.firstName} ${instructor.lastName}`}
                        size="sm"
                        status={instructor.isActive ? 'online' : 'offline'}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {instructor.firstName} {instructor.lastName}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-slate-500">{instructor.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 font-mono text-xs font-medium text-indigo-700">
                      @{instructor.userName || 'no-username'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap text-xs tabular-nums text-slate-600">{formatDate(instructor.hireDate)}</span>
                  </TableCell>
                  <TableCell align="right">
                    <span className="whitespace-nowrap font-mono text-sm font-semibold tabular-nums text-slate-900">${instructor.salary.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    {instructor.managerId ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        Manager #{instructor.managerId}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Faculty dean</span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Badge variant={instructor.isActive ? 'success' : 'neutral'} dot size="sm">
                      {instructor.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button type="button" onClick={() => onChangePassword(instructor)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" title="Reset password" aria-label={`Reset password for ${instructor.firstName} ${instructor.lastName}`}>
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => onEdit(instructor)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" title="Edit faculty record" aria-label={`Edit ${instructor.firstName} ${instructor.lastName}`}>
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => onDelete(instructor)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500" title="Delete faculty record" aria-label={`Delete ${instructor.firstName} ${instructor.lastName}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="border-t border-slate-100 px-4 py-2.5">
          <TablePagination totalCount={instructors.length} label="faculty members" />
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Faculty directory</h2>
          <p className="mt-0.5 text-xs text-slate-500">Individual staff records and account actions</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium tabular-nums text-slate-500">
          {instructors.length} {instructors.length === 1 ? 'member' : 'members'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {instructors.map((instructor) => (
          <article key={instructor.instructorId} className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60">
            <div className={`h-1.5 w-full ${instructor.isActive ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400' : 'bg-slate-300'}`} />

            <div className="flex-1 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 p-1 ring-1 ring-indigo-100/80">
                    <Avatar name={`${instructor.firstName} ${instructor.lastName}`} size="md" status={instructor.isActive ? 'online' : 'offline'} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-700">
                      {instructor.firstName} {instructor.lastName}
                    </h3>
                    <p className="mt-1 truncate text-xs text-slate-500">{instructor.email}</p>
                  </div>
                </div>
                <Badge variant={instructor.isActive ? 'success' : 'neutral'} dot size="sm">
                  {instructor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1.5 font-mono text-xs font-medium text-indigo-700">
                  <UserRound className="h-3.5 w-3.5" />
                  @{instructor.userName || 'no-username'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                  Joined {formatDate(instructor.hireDate)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800">
                    <DollarSign className="h-3.5 w-3.5" />
                    Annual salary
                  </div>
                  <p className="mt-2 font-mono text-lg font-semibold tabular-nums tracking-tight text-slate-900">
                    ${instructor.salary.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-sky-800">
                    <Building2 className="h-3.5 w-3.5" />
                    Reports to
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                    {instructor.managerId ? `Manager #${instructor.managerId}` : 'Faculty dean'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5">
              <span className="text-xs text-slate-500">Faculty ID <span className="font-mono font-semibold text-slate-700">#{instructor.instructorId}</span></span>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => onChangePassword(instructor)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" title="Reset password" aria-label={`Reset password for ${instructor.firstName} ${instructor.lastName}`}>
                  <KeyRound className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onEdit(instructor)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" title="Edit faculty record" aria-label={`Edit ${instructor.firstName} ${instructor.lastName}`}>
                  <Edit2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onDelete(instructor)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500" title="Delete faculty record" aria-label={`Delete ${instructor.firstName} ${instructor.lastName}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
                <span aria-hidden="true" className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors group-hover:bg-indigo-600">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5">
        <TablePagination totalCount={instructors.length} label="faculty members" />
      </div>
    </div>
  );
};
