import React from 'react';
import {
  BookOpen,
  Users,
  UserCheck,
  Award,
  DollarSign,
} from 'lucide-react';
import type { Course } from '../../../types/Courses';
import type { Instructor } from '../../../types/Instructor';
import type { Student } from '../../../types/Students';
import type { EnrollmentWithDetails } from '../../../types/Enrollments';

interface MetricCardsProps {
  courses: Course[];
  instructors: Instructor[];
  students: Student[];
  enrollments: EnrollmentWithDetails[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  courses,
  instructors,
  students,
  enrollments,
}) => {
  const activeCourses = courses.filter(
    (course) => course.status === 'Published' || course.status === 'Active'
  ).length;
  const activeInstructors = instructors.filter((instructor) => instructor.isActive).length;
  const activeStudents = students.filter((student) => student.status === 'Active').length;
  const completedEnrollments = enrollments.filter(
    (enrollment) => enrollment.status === 'Completed'
  ).length;
  const completionRate = enrollments.length
    ? Math.round((completedEnrollments / enrollments.length) * 100)
    : 0;
  const totalTuitionValue = enrollments.reduce(
    (total, enrollment) => total + (enrollment.coursePrice || 0),
    0
  );

  const metrics = [
    {
      code: 'COURSES',
      title: 'Active courses',
      value: activeCourses.toLocaleString(),
      detail: `${courses.length} courses in the catalog`,
      icon: BookOpen,
      accent: 'border-t-indigo-500',
      iconStyle: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
      footStyle: 'text-indigo-700',
      foot: 'Curriculum',
    },
    {
      code: 'STUDENTS',
      title: 'Active students',
      value: activeStudents.toLocaleString(),
      detail: `${students.length} registered student records`,
      icon: Users,
      accent: 'border-t-sky-500',
      iconStyle: 'bg-sky-50 text-sky-700 ring-sky-100',
      footStyle: 'text-sky-700',
      foot: 'Student registry',
    },
    {
      code: 'FACULTY',
      title: 'Active instructors',
      value: activeInstructors.toLocaleString(),
      detail: `${instructors.length} instructors in the directory`,
      icon: UserCheck,
      accent: 'border-t-violet-500',
      iconStyle: 'bg-violet-50 text-violet-700 ring-violet-100',
      footStyle: 'text-violet-700',
      foot: 'Faculty',
    },
    {
      code: 'COMPLETION',
      title: 'Completion rate',
      value: `${completionRate}%`,
      detail: `${completedEnrollments} completed enrollments`,
      icon: Award,
      accent: 'border-t-emerald-500',
      iconStyle: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      footStyle: 'text-emerald-700',
      foot: 'Academic progress',
    },
    {
      code: 'COURSE VALUE',
      title: 'Enrolled course value',
      value: `$${totalTuitionValue.toLocaleString()}`,
      detail: `${enrollments.length} enrollment records`,
      icon: DollarSign,
      accent: 'border-t-amber-500',
      iconStyle: 'bg-amber-50 text-amber-700 ring-amber-100',
      footStyle: 'text-amber-700',
      foot: 'Listed course value',
    },
  ];

  return (
    <section aria-label="Institutional metrics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <article
            key={metric.code}
            className={`group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 border-t-[3px] ${metric.accent} bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {metric.code}
                </p>
                <h3 className="mt-2 text-sm font-medium text-slate-600">
                  {metric.title}
                </h3>
              </div>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${metric.iconStyle}`}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>
            </div>

            <p className="mt-4 break-words text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">
              {metric.value}
            </p>

            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="truncate text-xs text-slate-500" title={metric.detail}>
                {metric.detail}
              </p>
              <p className={`mt-2 text-[10px] font-semibold uppercase tracking-wider ${metric.footStyle}`}>
                {metric.foot}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
};
