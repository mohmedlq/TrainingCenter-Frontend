import React, { useEffect, useState } from 'react';
import type { Student, StudentWithProfile } from '../../types/Students';
import type { StudentProfile } from '../../types/StudentsProfiles';
import { mockEnrollments } from '../../data/mockData';
import { StudentFilters } from './components/StudentFilters';
import { StudentTable } from './components/StudentTable';
import { StudentFormModal } from './components/StudentFormModal';
import { StudentProfileDrawer } from './components/StudentProfileDrawer';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Plus,
  GraduationCap,
  UserRoundCheck,
  MapPinned,
  ShieldCheck,
  LoaderCircle,
  ArrowUpRight,
} from 'lucide-react';
import { StudentsProfileService } from '../../Api/StudentProfile';
import { StudentsService } from '../../Api/Students';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsProfiles, setStudentsProfiles] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentWithProfile | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithProfile | null>(null);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const [studentsData, profilesData] = await Promise.all([
        StudentsService.getAll().catch((err) => {
          console.error('Failed to load students:', err);
          return [] as Student[];
        }),
        StudentsProfileService.getAll().catch((err) => {
          console.error('Failed to load student profiles:', err);
          return [] as StudentProfile[];
        }),
      ]);

      if (studentsData) setStudents(studentsData);
      if (profilesData) setStudentsProfiles(profilesData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const safeStudents = Array.isArray(students) ? students : [];
  const safeProfiles = Array.isArray(studentsProfiles) ? studentsProfiles : [];

  const studentsWithProfile: StudentWithProfile[] = safeStudents.map((student) => {
    const profile = safeProfiles.find((item) => item.studentId === student.studentId) || null;
    return { ...student, profile };
  });

  const filteredStudents = studentsWithProfile.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      fullName.includes(query) ||
      (student.email || '').toLowerCase().includes(query) ||
      String(student.studentId).includes(query);
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    const matchesCity = cityFilter === 'All' || student.profile?.city === cityFilter;
    return matchesSearch && matchesStatus && matchesCity;
  });

  const availableCities = Array.from(
    new Set(studentsWithProfile.map((student) => student.profile?.city).filter(Boolean) as string[]),
  ).sort((a, b) => a.localeCompare(b));

  const activeCount = studentsWithProfile.filter((student) => student.status === 'Active').length;
  const graduatedCount = studentsWithProfile.filter((student) => student.status === 'Graduated').length;
  const profilesCompleteCount = studentsWithProfile.filter((student) => Boolean(student.profile)).length;

  const openCreateForm = () => {
    setStudentToEdit(null);
    setIsFormOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCityFilter('All');
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Page hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-lg shadow-slate-900/10 sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-5rem] right-1/3 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.12)]" />
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Student registry and admissions
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Student Directory
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Manage student identities, admission status, and personal profiles from one organized workspace.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {students.length} registered students
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
              <span className="inline-flex items-center gap-1.5">
                <MapPinned className="h-3.5 w-3.5" />
                {availableCities.length} represented cities
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Directory available
            </span>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={openCreateForm}
              className="h-11 rounded-xl border border-indigo-400/30 bg-indigo-500 px-4 shadow-lg shadow-indigo-950/30 hover:bg-indigo-400"
            >
              Admit student
            </Button>
          </div>
        </div>
      </section>

      {/* At-a-glance metrics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Student summary">
        <div className="group rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Active students</p>
              <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-slate-900">{activeCount}</p>
              <p className="mt-1 text-xs text-slate-500">Currently active in the academy</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100 transition-transform group-hover:scale-105">
              <UserRoundCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-indigo-100">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${students.length ? (activeCount / students.length) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Graduated</p>
              <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-slate-900">{graduatedCount}</p>
              <p className="mt-1 text-xs text-slate-500">Students marked as graduated</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100 transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-emerald-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${students.length ? (graduatedCount / students.length) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="group rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">Profiles linked</p>
              <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-slate-900">{profilesCompleteCount}</p>
              <p className="mt-1 text-xs text-slate-500">Student records with a profile</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm ring-1 ring-sky-100 transition-transform group-hover:scale-105">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-sky-100">
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${students.length ? (profilesCompleteCount / students.length) * 100 : 0}%` }} />
          </div>
        </div>
      </section>

      {/* Filters */}
      <StudentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        availableCities={availableCities}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewStudent={openCreateForm}
      />

      {/* Results heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Student records</h2>
          <p className="mt-1 text-xs text-slate-500">Showing {filteredStudents.length} of {students.length} records</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
          {viewMode === 'grid' ? <Users className="h-3.5 w-3.5 text-indigo-600" /> : <ArrowUpRight className="h-3.5 w-3.5 text-indigo-600" />}
          {viewMode === 'grid' ? 'Card view' : 'Table view'}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <LoaderCircle className="h-6 w-6 animate-spin" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-900">Loading student directory</h3>
          <p className="mt-1 text-xs text-slate-500">Retrieving student records and profile information…</p>
          <div className="mx-auto mt-5 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-400" />
          </div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6 text-slate-400" />}
          title="No students found"
          description="Try another search term or adjust the status and region filters to find student records."
          actionLabel="Reset filters"
          onAction={resetFilters}
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          viewMode={viewMode}
          onSelectStudent={(student) => setSelectedStudent(student)}
          onEditStudent={(student) => {
            setStudentToEdit(student);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* Create / edit form */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        studentToEdit={studentToEdit}
        onSuccess={loadStudents}
      />

      {/* Student academic profile */}
      <StudentProfileDrawer
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        enrollments={mockEnrollments}
        onEdit={(student) => {
          setSelectedStudent(null);
          setStudentToEdit(student);
          setIsFormOpen(true);
        }}
      />
    </div>
  );
};
