import React from 'react';
import type { StudentWithProfile } from '../../../types/Students';
import type { Enrollment } from '../../../types';
import { SlideOver } from '../../../components/ui/SlideOver';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import type { BadgeVariant } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import {
  Mail,
  CalendarDays,
  MapPin,
  ExternalLink,
  BookOpen,
  Award,
  KeyRound,
  Edit,
  ShieldCheck,
  UserRound,
  Home,
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';

interface StudentProfileDrawerProps {
  student: StudentWithProfile | null;
  isOpen: boolean;
  onClose: () => void;
  enrollments: Enrollment[];
  onEdit?: (student: StudentWithProfile) => void;
  onChangePassword?: (student: StudentWithProfile) => void;
}

const statusBadgeVariant: Record<string, BadgeVariant> = {
  Active: 'success',
  Graduated: 'primary',
  Suspended: 'danger',
  Pending: 'warning',
};

const enrollmentStatusVariant: Record<string, BadgeVariant> = {
  Completed: 'success',
  'In Progress': 'primary',
  Enrolled: 'neutral',
  Dropped: 'danger',
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not provided' : date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  student,
  isOpen,
  onClose,
  enrollments,
  onEdit,
  onChangePassword,
}) => {
  if (!student) return null;

  const fullName = `${student.firstName} ${student.lastName}`;
  const studentEnrollments = enrollments.filter((e) => e.studentId === student.studentId);
  const completedCount = studentEnrollments.filter((e) => e.status === 'Completed').length;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Student academic profile"
      subtitle={`Student ID #${student.studentId} · Complete student record`}
      width="xl"
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close profile
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              size="sm"
              icon={<KeyRound className="h-4 w-4" />}
              onClick={() => onChangePassword?.(student)}
            >
              Reset password
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Edit className="h-4 w-4" />}
              onClick={() => {
                onClose();
                onEdit?.(student);
              }}
            >
              Edit student
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 pb-1">
        {/* Student identity */}
        <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-indigo-100/60 blur-2xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-indigo-100">
                <Avatar name={fullName} size="lg" />
              </div>
              <div className="min-w-0">
                <h3 className="break-words text-lg font-bold tracking-tight text-slate-900">{fullName}</h3>
                <p className="mt-1 break-all text-sm text-slate-600">{student.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/80 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                  Student #{student.studentId}
                </div>
              </div>
            </div>
            <Badge variant={statusBadgeVariant[student.status] || 'neutral'} size="md" dot>
              {student.status}
            </Badge>
          </div>
        </section>

        {/* Snapshot */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-sky-800">Total enrollments</span>
              <BookOpen className="h-4 w-4 text-sky-700" />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900">{studentEnrollments.length}</p>
            <p className="mt-1 text-xs text-sky-800/80">Course records</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-emerald-800">Completed</span>
              <Award className="h-4 w-4 text-emerald-700" />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900">{completedCount}</p>
            <p className="mt-1 text-xs text-emerald-800/80">Completed enrollments</p>
          </div>
          <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-violet-800">Profile status</span>
              <UserRound className="h-4 w-4 text-violet-700" />
            </div>
            <p className="mt-3 text-base font-bold text-slate-900">{student.profile ? 'Profile linked' : 'Incomplete'}</p>
            <p className="mt-1 text-xs text-violet-800/80">Personal information</p>
          </div>
        </div>

        {/* Contact & demographics */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserRound className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Personal information</h4>
              <p className="mt-0.5 text-xs text-slate-500">Contact details and demographic profile.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2">
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Mail className="h-4 w-4 text-indigo-500" /> Email address
              </div>
              <p className="mt-2 break-all text-sm font-semibold text-slate-800">{student.email || 'Not provided'}</p>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <CalendarDays className="h-4 w-4 text-amber-600" /> Date of birth
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-800">{formatDate(student.dateOfBirth)}</p>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <MapPin className="h-4 w-4 text-sky-600" /> City and country
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {student.profile?.city
                  ? `${student.profile.city}${student.profile.country ? `, ${student.profile.country}` : ''}`
                  : 'Not recorded'}
              </p>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Home className="h-4 w-4 text-violet-600" /> Residential address
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-800">{student.profile?.address || 'Not recorded'}</p>
            </div>
          </div>
        </section>

        {/* Bio & professional profile */}
        {student.profile && (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Biography and professional profile</h4>
                <p className="mt-0.5 text-xs text-slate-500">Background and external profile information.</p>
              </div>
            </div>
            <p className="whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600">
              {student.profile.bio || 'No biography has been added.'}
            </p>
            {student.profile.linkedInUrl && (
              <a
                href={student.profile.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition-colors hover:border-indigo-200 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span className="truncate">View LinkedIn profile</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </a>
            )}
          </section>
        )}

        {/* Enrollment history */}
        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Academic course history</h4>
                <p className="mt-0.5 text-xs text-slate-500">Enrollment progress, dates, and grades.</p>
              </div>
            </div>
            <span className="self-start rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold tabular-nums text-slate-600 sm:self-center">
              {studentEnrollments.length} {studentEnrollments.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          {studentEnrollments.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-9 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">No enrollment history</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">There are no course enrollment records associated with this student.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentEnrollments.map((enr) => (
                <article key={enr.enrollmentId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-flex max-w-full truncate rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 font-mono text-[10px] font-semibold text-indigo-700">
                          {enr.courseCode}
                        </span>
                        <h5 className="mt-2 break-words text-sm font-semibold text-slate-900">{enr.courseTitle}</h5>
                        <p className="mt-1 text-xs text-slate-500">Enrollment #{enr.enrollmentId}</p>
                      </div>
                    </div>
                    <Badge variant={enrollmentStatusVariant[enr.status] || 'neutral'} dot size="sm">
                      {enr.status}
                    </Badge>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-600">Course progress</span>
                      <span className="text-xs text-slate-400">Learning completion</span>
                    </div>
                    <ProgressBar value={enr.progressPercent} size="sm" status={enr.status} showLabel />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-3">
                      <CalendarDays className="h-4 w-4 shrink-0 text-sky-600" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-500">Enrollment date</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-800">{formatDate(enr.enrollmentDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-3">
                      <Award className="h-4 w-4 shrink-0 text-amber-600" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-500">Final grade</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-800">
                          {enr.finalGrade !== null && enr.finalGrade !== undefined
                            ? `${enr.finalGrade}%`
                            : 'Pending evaluation'}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </SlideOver>
  );
};
