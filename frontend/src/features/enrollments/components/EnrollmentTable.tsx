import React from 'react';
import type { EnrollmentWithDetails } from '../../../types/Enrollments';
import { Badge } from '../../../components/ui/Badge';
import type { BadgeVariant } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import {
  Table,
  TableHeader,
  TableHeadCell,
  TableRow,
  TableCell,
  TablePagination,
} from '../../../components/ui/Table';
import {
  Edit3,
  Trash2,
  CalendarDays,
  Award,
  BookOpen,
  UserRound,
  LoaderCircle,
  ArrowUpRight,
} from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';

interface EnrollmentTableProps {
  enrollments: EnrollmentWithDetails[];
  onUpdateGrade: (enrollment: EnrollmentWithDetails) => void;
  onDeleteEnrollment: (enrollment: EnrollmentWithDetails) => void;
  viewMode?: 'grid' | 'table';
  deletingEnrollmentId?: number | null;
}

const enrollmentStatusVariant: Record<string, BadgeVariant> = {
  Completed: 'success',
  'In Progress': 'primary',
  Enrolled: 'neutral',
  Dropped: 'danger',
};

const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

export const EnrollmentTable: React.FC<EnrollmentTableProps> = ({
  enrollments,
  onUpdateGrade,
  onDeleteEnrollment,
  viewMode = 'grid',
  deletingEnrollmentId = null,
}) => {
  if (viewMode === 'table') {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <TableHeadCell>Student</TableHeadCell>
                <TableHeadCell>Course</TableHeadCell>
                <TableHeadCell>Enrollment date</TableHeadCell>
                <TableHeadCell>Syllabus progress</TableHeadCell>
                <TableHeadCell align="center">Final grade</TableHeadCell>
                <TableHeadCell>Completion date</TableHeadCell>
                <TableHeadCell align="center">Status</TableHeadCell>
                <TableHeadCell align="right">Actions</TableHeadCell>
              </tr>
            </TableHeader>
            <tbody>
              {enrollments.map((enrollment) => {
                const isDeleting = deletingEnrollmentId === enrollment.enrollmentId;
                return (
                  <TableRow key={enrollment.enrollmentId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={enrollment.studentName || `Student ${enrollment.studentId}`}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{enrollment.studentName || `Student #${enrollment.studentId}`}</p>
                          <p className="max-w-[190px] truncate text-xs text-slate-500">{enrollment.studentEmail || `ID: #${enrollment.studentId}`}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-800">{enrollment.courseTitle || `Course #${enrollment.courseId}`}</p>
                      <span className="mt-1 inline-flex rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-700">
                        {enrollment.courseCode || `C-${enrollment.courseId}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-slate-600">{formatDate(enrollment.enrollmentDate)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[160px]">
                        <ProgressBar value={enrollment.progressPercent} size="sm" status={enrollment.status} showLabel />
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      {enrollment.finalGrade !== null && enrollment.finalGrade !== undefined ? (
                        <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-xs font-semibold tabular-nums text-slate-800">
                          {Number(enrollment.finalGrade).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`whitespace-nowrap text-sm ${enrollment.completionDate ? 'font-medium text-emerald-700' : 'text-slate-400'}`}>
                        {formatDate(enrollment.completionDate)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant={enrollmentStatusVariant[enrollment.status] || 'neutral'} dot size="sm">
                        {enrollment.status}
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateGrade(enrollment)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          title="Update grade and progress"
                          aria-label={`Update ${enrollment.studentName ?? 'student'} grade`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteEnrollment(enrollment)}
                          disabled={isDeleting}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                          title="Unenroll student"
                          aria-label={`Unenroll ${enrollment.studentName ?? 'student'}`}
                        >
                          {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        </div>
        <TablePagination totalCount={enrollments.length} label="enrollments" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {enrollments.map((enrollment) => {
          const isDeleting = deletingEnrollmentId === enrollment.enrollmentId;
          return (
            <article
              key={enrollment.enrollmentId}
              className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400" />
              <div className="flex flex-1 flex-col p-5">
                {/* Student identity */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={enrollment.studentName || `Student ${enrollment.studentId}`} size="md" />
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-700">
                        {enrollment.studentName || `Student #${enrollment.studentId}`}
                      </h3>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {enrollment.studentEmail || `Student ID: #${enrollment.studentId}`}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-slate-400">
                        Enrollment #{enrollment.enrollmentId}
                      </p>
                    </div>
                  </div>
                  <Badge variant={enrollmentStatusVariant[enrollment.status] || 'neutral'} dot size="sm">
                    {enrollment.status}
                  </Badge>
                </div>

                {/* Course card */}
                <div className="mt-5 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white text-indigo-600 shadow-sm">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-indigo-500">Enrolled course</p>
                      <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                        {enrollment.courseTitle || `Course #${enrollment.courseId}`}
                      </h4>
                      <span className="mt-2 inline-flex rounded-md border border-indigo-100 bg-white px-2 py-1 font-mono text-[10px] font-semibold text-indigo-700">
                        {enrollment.courseCode || `C-${enrollment.courseId}`}
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-indigo-300 transition group-hover:text-indigo-600" />
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-700">Course progress</span>
                    <span className="text-xs text-slate-400">{enrollment.status === 'Completed' ? 'Completed course' : 'Learning journey'}</span>
                  </div>
                  <ProgressBar value={enrollment.progressPercent} size="sm" status={enrollment.status} showLabel />
                </div>

                {/* Dates & grade */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-medium">Enrolled on</span>
                    </div>
                    <p className="mt-2 text-xs font-semibold tabular-nums text-slate-800">{formatDate(enrollment.enrollmentDate)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Award className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-medium">Final grade</span>
                    </div>
                    {enrollment.finalGrade !== null && enrollment.finalGrade !== undefined ? (
                      <p className="mt-1.5 text-base font-bold tabular-nums text-slate-900">{Number(enrollment.finalGrade).toFixed(1)}<span className="ml-0.5 text-xs font-semibold text-slate-500">%</span></p>
                    ) : (
                      <p className="mt-2 text-xs font-semibold text-amber-600">Not graded</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Completion date</span>
                  <span className={enrollment.completionDate ? 'font-medium text-emerald-700' : 'text-slate-400'}>
                    {formatDate(enrollment.completionDate)}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => onUpdateGrade(enrollment)}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Update grade
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteEnrollment(enrollment)}
                    disabled={isDeleting}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    title="Unenroll student"
                  >
                    {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    <span className="hidden sm:inline">Unenroll</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <TablePagination totalCount={enrollments.length} label="enrollments" />
    </div>
  );
};
