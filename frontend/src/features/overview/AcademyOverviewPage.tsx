import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types/Courses';
import type { Instructor } from '../../types/Instructor';
import type { Student, StudentWithProfile } from '../../types/Students';
import type { StudentProfile } from '../../types/StudentsProfiles';
import type { Enrollment, EnrollmentWithDetails } from '../../types/Enrollments';
import { CoursesService } from '../../Api/CoursesService';
import { InstructorsService } from '../../Api/Instructors';
import { StudentsService } from '../../Api/Students';
import { StudentsProfileService } from '../../Api/StudentProfile';
import { EnrollmentsService } from '../../Api/EnrollmentsService';
import { MetricCards } from './components/MetricCards';
import { RecentEnrollmentsTable } from './components/RecentEnrollmentsTable';
import { CourseCapacityDistribution } from './components/CourseCapacityDistribution';
import { FacultyLeadSummary } from './components/FacultyLeadSummary';
import { Button } from '../../components/ui/Button';
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Layers3,
  MapPin,
  Plus,
  Printer,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { NavTab } from '../../components/layout/Sidebar';
import { StudentProfileDrawer } from '../Students/components/StudentProfileDrawer';

interface AcademyOverviewPageProps {
  onNavigate?: (tab: NavTab) => void;
}

const pathByTab: Record<NavTab, string> = {
  overview: '/',
  courses: '/courses',
  instructors: '/instructors',
  students: '/students',
  enrollments: '/enrollments',
};

export const AcademyOverviewPage: React.FC<AcademyOverviewPageProps> = ({
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsProfiles, setStudentsProfiles] = useState<StudentProfile[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithProfile | null>(null);
  const [isStudentDrawerOpen, setIsStudentDrawerOpen] = useState(false);

  const loadOverviewData = async () => {
    try {
      setIsLoading(true);
      const [coursesData, instructorsData, studentsData, profilesData, enrollmentsData] =
        await Promise.all([
          CoursesService.getAll().catch((error) => {
            console.error('Failed to load courses for overview:', error);
            return [] as Course[];
          }),
          InstructorsService.getAll().catch((error) => {
            console.error('Failed to load instructors for overview:', error);
            return [] as Instructor[];
          }),
          StudentsService.getAll().catch((error) => {
            console.error('Failed to load students for overview:', error);
            return [] as Student[];
          }),
          StudentsProfileService.getAll().catch((error) => {
            console.error('Failed to load student profiles for overview:', error);
            return [] as StudentProfile[];
          }),
          EnrollmentsService.getAll().catch((error) => {
            console.error('Failed to load enrollments for overview:', error);
            return [] as Enrollment[];
          }),
        ]);

      if (coursesData) setCourses(coursesData);
      if (instructorsData) setInstructors(instructorsData);
      if (studentsData) setStudents(studentsData);
      if (profilesData) setStudentsProfiles(profilesData);
      if (enrollmentsData) setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Failed to load overview data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOverviewData();
  }, []);

  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeInstructors = Array.isArray(instructors) ? instructors : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeProfiles = Array.isArray(studentsProfiles) ? studentsProfiles : [];
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  const enrichedEnrollments: EnrollmentWithDetails[] = safeEnrollments.map((enrollment) => {
    const student = safeStudents.find((item) => item.studentId === enrollment.studentId);
    const course = safeCourses.find((item) => item.courseId === enrollment.courseId);

    return {
      ...enrollment,
      studentName: student
        ? `${student.firstName} ${student.lastName}`
        : `Student #${enrollment.studentId}`,
      studentEmail: student?.email || '',
      courseTitle: course?.title || `Course #${enrollment.courseId}`,
      courseCode: course?.code || `C-${enrollment.courseId}`,
      coursePrice: course?.price || 0,
    };
  });

  const locations = safeProfiles
    .filter((profile: StudentProfile) => Boolean(profile.city))
    .map((profile: StudentProfile) =>
      `${profile.city}${profile.country ? `, ${profile.country}` : ''}`
    );
  const uniqueLocations = Array.from(new Set(locations));

  const navigateTo = (tab: NavTab) => {
    if (onNavigate) {
      onNavigate(tab);
      return;
    }
    navigate(pathByTab[tab]);
  };

  const handleEnrollmentClick = (enrollment: EnrollmentWithDetails) => {
    const student = safeStudents.find((item) => item.studentId === enrollment.studentId);

    if (!student) {
      console.warn(`Student #${enrollment.studentId} was not found in the loaded student records.`);
      return;
    }

    const profile = safeProfiles.find((item) => item.studentId === student.studentId) ?? null;
    setSelectedStudent({ ...student, profile } as StudentWithProfile);
    setIsStudentDrawerOpen(true);
  };

  const closeStudentDrawer = () => setIsStudentDrawerOpen(false);

  return (
    <div className="mx-auto w-full max-w-[1680px] space-y-6 pb-8">
      {/* Page identity */}
      <section className="relative isolate overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-sm">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[45%] bg-gradient-to-l from-indigo-500/15 via-indigo-500/5 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/[0.06]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-16 h-56 w-56 rounded-full border border-white/[0.06]" />

        <div className="relative flex flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-indigo-200 sm:flex">
              <Layers3 className="h-6 w-6" strokeWidth={1.7} />
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-200/80">
                  EduCenter / Administration
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-200">
                  <span className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'animate-pulse bg-amber-300' : 'bg-emerald-300'}`} />
                  {isLoading ? 'Loading records' : 'Overview workspace'}
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Academic overview
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                A consolidated view of the academy's courses, faculty, students, and enrollment activity.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.07] text-indigo-200">
              <Building2 className="h-[18px] w-[18px]" />
            </div>
            <div>
              <p className="text-xs font-medium text-white">Academy operations</p>
              <p className="mt-1 text-[11px] text-slate-400">Management workspace</p>
            </div>
            <ShieldCheck className="ml-2 h-4 w-4 text-emerald-300" />
          </div>
        </div>
      </section>

      {/* Primary actions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <GraduationCap className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-800">Institutional snapshot</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Key records and operational shortcuts</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="h-3.5 w-3.5" />}
            onClick={() => window.print()}
          >
            Print overview
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowUpRight className="h-3.5 w-3.5" />}
            onClick={() => navigateTo('enrollments')}
          >
            Enrollments
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => navigateTo('courses')}
          >
            New course
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">At a glance</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Institutional metrics</h2>
          </div>
          <p className="text-xs text-slate-500">Calculated from the currently loaded records</p>
        </div>

        <MetricCards
          courses={safeCourses}
          instructors={safeInstructors}
          students={safeStudents}
          enrollments={enrichedEnrollments}
        />
      </section>

      {/* Operational workspace */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12 xl:gap-6">
        <div className="min-w-0 space-y-5 xl:col-span-8 xl:space-y-6">
          <RecentEnrollmentsTable
            enrollments={enrichedEnrollments}
            onViewAll={() => navigateTo('enrollments')}
            onEnrollmentClick={handleEnrollmentClick}
          />

          {/* Location / demographics */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-700">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Student locations</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Cities and countries recorded in student profile data.
                  </p>
                </div>
              </div>
              <div className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                <p className="text-lg font-semibold leading-none tabular-nums text-slate-900">{uniqueLocations.length}</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">Locations</p>
              </div>
            </header>

            <div className="p-5 sm:p-6">
              {uniqueLocations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {uniqueLocations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-sky-200 hover:bg-sky-50/60"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      {location}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 ring-1 ring-slate-200">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {isLoading ? 'Loading student profiles' : 'No location data available'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {isLoading
                        ? 'Location records will appear here when the data has loaded.'
                        : 'No city information has been recorded in the available student profiles.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <footer className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>Demographic information from registered student profiles</span>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('students')}
                className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-indigo-700 transition-colors hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:self-auto"
              >
                Open student directory
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </footer>
          </section>
        </div>

        <aside className="min-w-0 space-y-5 xl:col-span-4 xl:space-y-6">
          <CourseCapacityDistribution courses={safeCourses} />
          <FacultyLeadSummary
            instructors={safeInstructors}
            onViewAll={() => navigateTo('instructors')}
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">Workspace guide</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Use the overview to review activity, then open a management area to work with individual records.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Record categories</span>
                <span className="font-medium text-slate-800">4 main areas</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Data loading</span>
                <span className={`inline-flex items-center gap-1.5 font-medium ${isLoading ? 'text-amber-700' : 'text-emerald-700'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  {isLoading ? 'In progress' : 'Finished'}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-[11px] leading-relaxed text-slate-500">
              <ArrowDownRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              Select an enrollment record to open its linked student profile.
            </div>
          </div>
        </aside>
      </div>

      <StudentProfileDrawer
        student={selectedStudent}
        isOpen={isStudentDrawerOpen}
        onClose={closeStudentDrawer}
        enrollments={enrichedEnrollments as Enrollment[]}
      />
    </div>
  );
};
