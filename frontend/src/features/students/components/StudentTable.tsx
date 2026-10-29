import React from 'react';
import type { StudentWithProfile } from '../../../types/Students';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import type { BadgeVariant } from '../../../components/ui/Badge';
import { Table, TableHeader, TableHeadCell, TableRow, TableCell, TablePagination } from '../../../components/ui/Table';
import {
  Eye,
  Edit2,
  MapPin,
  Mail,
  CalendarDays,
  ArrowUpRight,
  Users,
} from 'lucide-react';

interface StudentTableProps {
  students: StudentWithProfile[];
  onSelectStudent: (student: StudentWithProfile) => void;
  onEditStudent: (student: StudentWithProfile) => void;
  viewMode?: 'grid' | 'table';
}

const studentStatusBadge: Record<string, BadgeVariant> = {
  Active: 'success',
  Graduated: 'primary',
  Suspended: 'danger',
  Pending: 'warning',
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Not provided'
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  viewMode = 'grid',
}) => {
  if (viewMode === 'table') {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Student directory</h3>
            <p className="mt-1 text-xs text-slate-500">Detailed view of student records and profile information.</p>
          </div>
          <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium tabular-nums text-slate-500">
            {students.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <TableHeadCell>Student</TableHeadCell>
                <TableHeadCell>Contact email</TableHeadCell>
                <TableHeadCell>Location</TableHeadCell>
                <TableHeadCell>Date of birth</TableHeadCell>
                <TableHeadCell align="center">Status</TableHeadCell>
                <TableHeadCell align="right">Actions</TableHeadCell>
              </tr>
            </TableHeader>
            <tbody>
              {students.map((student) => {
                const fullName = `${student.firstName} ${student.lastName}`;
                return (
                  <TableRow key={student.studentId} onClick={() => onSelectStudent(student)}>
                    <TableCell>
                      <div className="flex min-w-[190px] items-center gap-3">
                        <Avatar name={fullName} size="sm" />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900">{fullName}</div>
                          <div className="mt-0.5 text-[11px] font-mono text-slate-400">ID #{student.studentId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-600">{student.email}</span>
                    </TableCell>
                    <TableCell>
                      {student.profile?.city ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-600" />
                          <span>{student.profile.city}{student.profile.country ? `, ${student.profile.country}` : ''}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
                          Profile incomplete
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-xs text-slate-600">{formatDate(student.dateOfBirth)}</span>
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant={studentStatusBadge[student.status] || 'neutral'} dot size="sm">
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onSelectStudent(student)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          title="View student profile"
                          aria-label={`View ${fullName}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditStudent(student)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          title="Edit student"
                          aria-label={`Edit ${fullName}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="border-t border-slate-100 px-4 py-2">
          <TablePagination totalCount={students.length} label="students" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Student profiles</h3>
          <p className="mt-1 text-xs text-slate-500">Select a card to open the full academic record.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
          <Users className="h-3.5 w-3.5" /> {students.length} students
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {students.map((student) => {
          const fullName = `${student.firstName} ${student.lastName}`;
          return (
            <article
              key={student.studentId}
              role="button"
              tabIndex={0}
              aria-label={`Open academic profile for ${fullName}`}
              onClick={() => onSelectStudent(student)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectStudent(student);
                }
              }}
              className="group relative flex min-h-[280px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 opacity-70 transition-opacity group-hover:opacity-100" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 p-1.5 ring-1 ring-indigo-100 transition-colors group-hover:from-indigo-100 group-hover:to-sky-100">
                    <Avatar name={fullName} size="md" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-700">{fullName}</h4>
                    <p className="mt-1 text-[11px] font-mono text-slate-400">Student #{student.studentId}</p>
                  </div>
                </div>
                <Badge variant={studentStatusBadge[student.status] || 'neutral'} dot size="sm">
                  {student.status}
                </Badge>
              </div>

              <div className="mt-5 space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 ring-1 ring-slate-200">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Email address</p>
                    <p className="mt-0.5 truncate text-xs font-medium text-slate-700">{student.email}</p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sky-700 ring-1 ring-slate-200">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Location</p>
                    <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                      {student.profile?.city
                        ? `${student.profile.city}${student.profile.country ? `, ${student.profile.country}` : ''}`
                        : 'Profile not completed'}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-amber-700 ring-1 ring-slate-200">
                    <CalendarDays className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date of birth</p>
                    <p className="mt-0.5 text-xs font-medium text-slate-700">{formatDate(student.dateOfBirth)}</p>
                  </div>
                </div>
              </div>

              {student.profile?.bio && (
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">{student.profile.bio}</p>
              )}

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-5">
                <span className="inline-flex min-w-0 items-center gap-2 text-xs font-semibold text-indigo-700">
                  View academic profile
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <div className="flex shrink-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    title="View student"
                    aria-label={`View ${fullName}`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditStudent(student)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    title="Edit student"
                    aria-label={`Edit ${fullName}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <TablePagination totalCount={students.length} label="students" />
    </div>
  );
};

