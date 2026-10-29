import React from 'react';
import type { Course } from '../../../types/Courses';
import { SlideOver } from '../../../components/ui/SlideOver';
import { Badge } from '../../../components/ui/Badge';
import type { BadgeVariant } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import {
  Clock,
  DollarSign,
  User,
  Users,
  Calendar,
  Layers,
  Edit,
  BookOpen,
  GraduationCap,
  Hash,
} from 'lucide-react';

interface CourseDetailDrawerProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
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

export const CourseDetailDrawer: React.FC<CourseDetailDrawerProps> = ({
  course,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!course) return null;

  const metrics = [
    {
      label: 'Duration',
      value: `${course.durationHours} hrs`,
      icon: Clock,
      iconClass: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    },
    {
      label: 'Tuition',
      value: `$${course.price.toLocaleString()}`,
      icon: DollarSign,
      iconClass: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    },
    {
      label: 'Enrolled',
      value: String(course.totalEnrolled || 0),
      icon: Users,
      iconClass: 'bg-sky-50 text-sky-600 ring-sky-100',
    },
    {
      label: 'Skill level',
      value: course.level,
      icon: Layers,
      iconClass: 'bg-violet-50 text-violet-600 ring-violet-100',
    },
  ];

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={course.title}
      subtitle={`Course code: ${course.code} • Catalog ID #${course.courseId}`}
      width="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Edit className="h-3.5 w-3.5" />}
            onClick={() => {
              onClose();
              onEdit?.(course);
            }}
          >
            Edit course
          </Button>
        </>
      }
    >
      <div className="space-y-5 pb-1">
        {/* Course overview */}
        <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-5">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-100/60 blur-2xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-white/90 px-2.5 py-1.5 font-mono text-xs font-semibold text-indigo-700 shadow-sm">
                <Hash className="h-3.5 w-3.5" /> {course.code}
              </span>
              <Badge variant={levelBadgeMap[course.level] || 'default'} size="sm">
                {course.level}
              </Badge>
              <Badge variant={statusBadgeMap[course.status] || 'neutral'} dot size="sm">
                {course.status}
              </Badge>
            </div>
            <div className="mt-5 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold leading-6 tracking-tight text-slate-900">{course.title}</h3>
                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  {course.description || 'No course description has been added yet.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-2 gap-3">
          {metrics.map(({ label, value, icon: Icon, iconClass }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500">{label}</span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset ${iconClass}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 truncate text-xl font-bold tracking-tight text-slate-900">{value}</p>
            </div>
          ))}
        </section>

        {/* Syllabus */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-100">
              <BookOpen className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Course description</h4>
              <p className="mt-0.5 text-xs text-slate-500">Curriculum summary and learning context</p>
            </div>
          </div>
          <p className="p-4 text-sm leading-6 text-slate-600">
            {course.description || 'No detailed syllabus summary has been provided for this course.'}
          </p>
        </section>

        {/* Instructor */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100">
                <User className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Lead instructor</h4>
                <p className="mt-0.5 text-xs text-slate-500">Assigned course faculty</p>
              </div>
            </div>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] font-medium text-slate-600">
              ID #{course.instructorId}
            </span>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">
              {course.instructorName || `Faculty member #${course.instructorId}`}
            </p>
            <p className="mt-1 text-xs text-slate-500">Course lead and instructional contact</p>
          </div>
        </section>

        {/* Publication metadata */}
        <section className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Calendar className="h-4 w-4" /> Publication date
          </span>
          <span className="text-sm font-semibold text-slate-800">
            {course.publishedAt
              ? new Date(course.publishedAt).toLocaleDateString()
              : 'Draft / not published'}
          </span>
        </section>
      </div>
    </SlideOver>
  );
};
