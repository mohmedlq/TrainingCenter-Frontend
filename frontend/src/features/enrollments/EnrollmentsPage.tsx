import React, { useEffect, useState } from 'react';
import type { Enrollment, EnrollmentWithDetails } from '../../types/Enrollments';
import type { Course } from '../../types/Courses';
import type { Student } from '../../types/Students';
import { EnrollmentsService } from '../../Api/EnrollmentsService';
import { CoursesService } from '../../Api/CoursesService';
import { StudentsService } from '../../Api/Students';
import { EnrollmentFilters } from './components/EnrollmentFilters';
import { EnrollmentTable } from './components/EnrollmentTable';
import { NewEnrollmentModal } from './components/NewEnrollmentModal';
import { GradeUpdateModal } from './components/GradeUpdateModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  LoaderCircle,
  Plus,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { toast } from 'sonner';

const MIN_LOADING_MS = 650;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const formatCount = (value: number) => new Intl.NumberFormat().format(value);

export const EnrollmentsPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingEnrollmentId, setDeletingEnrollmentId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isNewEnrollmentOpen, setIsNewEnrollmentOpen] = useState(false);
  const [gradeModalTarget, setGradeModalTarget] = useState<EnrollmentWithDetails | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [enrollmentsData, studentsData, coursesData] = await Promise.all([
        EnrollmentsService.getAll().catch((error) => {
          console.error('Failed to load enrollments:', error);
          return [] as Enrollment[];
        }),
        StudentsService.getAll().catch((error) => {
          console.error('Failed to load students:', error);
          return [] as Student[];
        }),
        CoursesService.getAll().catch((error) => {
          console.error('Failed to load courses:', error);
          return [] as Course[];
        }),
      ]);

      if (enrollmentsData) setEnrollments(enrollmentsData);
      if (studentsData) setStudents(studentsData);
      if (coursesData) setCourses(coursesData);
    } catch (error) {
      console.error('Failed to load enrollment workspace:', error);
      toast.error('Could not refresh enrollment records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeCourses = Array.isArray(courses) ? courses : [];

  const enrichedEnrollments: EnrollmentWithDetails[] = safeEnrollments.map((enrollment) => {
    const student = safeStudents.find((item) => item.studentId === enrollment.studentId);
    const course = safeCourses.find((item) => item.courseId === enrollment.courseId);

    return {
      ...enrollment,
      studentName: student ? `${student.firstName} ${student.lastName}` : `Student #${enrollment.studentId}`,
      studentEmail: student?.email || '',
      courseTitle: course?.title || `Course #${enrollment.courseId}`,
      courseCode: course?.code || `C-${enrollment.courseId}`,
      coursePrice: course?.price || 0,
    };
  });

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredEnrollments = enrichedEnrollments.filter((enrollment) => {
    const studentMatch = (enrollment.studentName || '').toLowerCase().includes(normalizedQuery);
    const courseMatch =
      (enrollment.courseTitle || '').toLowerCase().includes(normalizedQuery) ||
      (enrollment.courseCode || '').toLowerCase().includes(normalizedQuery);
    const emailMatch = (enrollment.studentEmail || '').toLowerCase().includes(normalizedQuery);

    return (
      (studentMatch || courseMatch || emailMatch) &&
      (statusFilter === 'All' || enrollment.status === statusFilter) &&
      (courseFilter === 'All' || String(enrollment.courseId) === courseFilter)
    );
  });

  const coursesList = safeCourses.map((course) => ({
    id: course.courseId,
    title: course.title,
    code: course.code,
  }));

  const inProgressCount = enrichedEnrollments.filter((item) => item.status === 'In Progress').length;
  const completedCount = enrichedEnrollments.filter((item) => item.status === 'Completed').length;
  const awaitingGradeCount = enrichedEnrollments.filter(
    (item) => item.finalGrade === null || item.finalGrade === undefined,
  ).length;
  const averageProgress = enrichedEnrollments.length
    ? Math.round(
        enrichedEnrollments.reduce((sum, item) => sum + (Number(item.progressPercent) || 0), 0) /
          enrichedEnrollments.length,
      )
    : 0;

  const handleDeleteEnrollment = async (enrollment: EnrollmentWithDetails) => {
    const studentName = enrollment.studentName || `Student #${enrollment.studentId}`;
    const courseName = enrollment.courseCode || enrollment.courseTitle || 'this course';

    if (deletingEnrollmentId !== null) return;
    if (!window.confirm(`Unenroll ${studentName} from ${courseName}? This action cannot be undone.`)) return;

    setDeletingEnrollmentId(enrollment.enrollmentId);
    const startedAt = Date.now();
    const operation = (async () => {
      try {
        await EnrollmentsService.remove(enrollment.enrollmentId);
        await loadData();
      } finally {
        const remaining = MIN_LOADING_MS - (Date.now() - startedAt);
        if (remaining > 0) await wait(remaining);
      }
    })();

    toast.promise(operation, {
      loading: `Removing ${studentName} from ${courseName}…`,
      success: 'Enrollment removed successfully.',
      error: 'Could not remove enrollment. Please try again.',
    });

    try {
      await operation;
    } catch (error) {
      console.error('Failed to unenroll student:', error);
    } finally {
      setDeletingEnrollmentId(null);
    }
  };

  const metrics = [
    {
      label: 'Total enrollments',
      value: formatCount(enrichedEnrollments.length),
      note: `${formatCount(filteredEnrollments.length)} match current filters`,
      icon: ClipboardList,
      tone: 'indigo',
    },
    {
      label: 'In progress',
      value: formatCount(inProgressCount),
      note: 'Students currently learning',
      icon: TrendingUp,
      tone: 'sky',
    },
    {
      label: 'Completed',
      value: formatCount(completedCount),
      note: 'Completed course records',
      icon: CheckCircle2,
      tone: 'emerald',
    },
    {
      label: 'Awaiting grade',
      value: formatCount(awaitingGradeCount),
      note: `${averageProgress}% average recorded progress`,
      icon: Award,
      tone: 'amber',
    },
  ] as const;

  const toneClasses = {
    indigo: 'border-indigo-100 bg-indigo-50 text-indigo-700',
    sky: 'border-sky-100 bg-sky-50 text-sky-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
  } as const;

  return (
    <div className="space-y-6 pb-6">
      {/* Administrative page header */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-900/10 sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              ACADEMIC OPERATIONS
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Enrollments & learner progress</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Manage course registrations, monitor learning progress, and maintain academic evaluation records from one workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Filtered records</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-white">{formatCount(filteredEnrollments.length)}</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setIsNewEnrollmentOpen(true)}
            >
              Enroll student
            </Button>
          </div>
        </div>
      </section>

      {/* Summary metrics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4" aria-label="Enrollment summary">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{metric.value}</p>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${toneClasses[metric.tone]}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-xs leading-5 text-slate-500">{metric.note}</p>
              </div>
            </article>
          );
        })}
      </section>

      {/* Search and filters */}
      <EnrollmentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        courseFilter={courseFilter}
        onCourseFilterChange={setCourseFilter}
        courses={coursesList}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewEnrollment={() => setIsNewEnrollmentOpen(true)}
      />

      {/* Results heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Enrollment records</h2>
          <p className="mt-1 text-sm text-slate-500">Select an action on a record to update academic results or remove an enrollment.</p>
        </div>
        <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
          {formatCount(filteredEnrollments.length)} {filteredEnrollments.length === 1 ? 'record' : 'records'}
        </span>
      </div>

      {isLoading ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <LoaderCircle className="h-6 w-6 animate-spin" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-800">Loading enrollment workspace</p>
          <p className="mt-1 text-xs text-slate-500">Retrieving students, courses, and enrollment records…</p>
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <EmptyState
            icon={<UsersRound className="h-6 w-6 text-slate-400" />}
            title="No enrollments found"
            description="Try a different search, select another status, or clear the filters to see more records."
            actionLabel="Reset filters"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setCourseFilter('All');
            }}
          />
        </div>
      ) : (
        <EnrollmentTable
          enrollments={filteredEnrollments}
          viewMode={viewMode}
          onUpdateGrade={(enrollment) => setGradeModalTarget(enrollment)}
          onDeleteEnrollment={handleDeleteEnrollment}
          deletingEnrollmentId={deletingEnrollmentId}
        />
      )}

      {/* Create enrollment */}
      <NewEnrollmentModal
        isOpen={isNewEnrollmentOpen}
        onClose={() => setIsNewEnrollmentOpen(false)}
        students={safeStudents}
        courses={safeCourses}
        onSuccess={loadData}
      />

      {/* Update academic results */}
      <GradeUpdateModal
        isOpen={!!gradeModalTarget}
        onClose={() => setGradeModalTarget(null)}
        enrollment={gradeModalTarget}
        onSuccess={loadData}
      />
    </div>
  );
};
