import React, { useEffect, useMemo, useState } from 'react';
import type { Course } from '../../types/Courses';
import { CourseFilters } from './components/CourseFilters';
import { CourseCard } from './components/CourseCard';
import { CourseFormModal } from './components/CourseFormModal';
import { CourseDetailDrawer } from './components/CourseDetailDrawer';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import { BookOpen, Edit2, Eye, Plus, Layers3, GraduationCap, Sparkles, RefreshCw } from 'lucide-react';
import { Table, TableHeader, TableHeadCell, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { CoursesService } from '../../Api/CoursesService';
import { toast } from 'sonner';

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

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const response = await CoursesService.getAll();
      if (response) setCourses(response);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setCourses([]);
      toast.error('Could not load the course catalog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCourses();
  }, []);

  const safeCourses = Array.isArray(courses) ? courses : [];

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return safeCourses.filter((course) => {
      const matchesQuery =
        course.title.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query);
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      const matchesStatus = selectedStatus === 'All' || course.status === selectedStatus;
      return matchesQuery && matchesLevel && matchesStatus;
    });
  }, [safeCourses, searchQuery, selectedLevel, selectedStatus]);

  const publishedCount = safeCourses.filter((course) => course.status === 'Published').length;
  const activeCount = safeCourses.filter((course) => course.status === 'Active').length;
  const draftCount = safeCourses.filter((course) => course.status === 'Draft').length;

  const handleEditCourse = (course: Course) => {
    setCourseToEdit(course);
    setSelectedCourse(null);
    setIsFormOpen(true);
  };

  const handleNewCourse = () => {
    setCourseToEdit(null);
    setIsFormOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('All');
    setSelectedStatus('All');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-lg shadow-slate-950/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.12),transparent_40%)]" />
        <div className="relative flex flex-col gap-6 p-5 sm:p-7 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-200">
              <Layers3 className="h-3.5 w-3.5" /> Curriculum workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Course catalog</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Manage course offerings, learning levels, tuition, and instructor assignments from one organized workspace.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-300" /> {safeCourses.length} total courses
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1.5 text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> API catalog
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void loadCourses()} disabled={isLoading} icon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={handleNewCourse}>
              Create course
            </Button>
          </div>
        </div>
      </section>

      {/* Catalog snapshot */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm sm:p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200/70">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium text-emerald-800/70">Published courses</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{publishedCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm sm:p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-200/70">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium text-indigo-800/70">Active courses</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{activeCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm sm:p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200/70">
            <Edit2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium text-amber-800/70">Draft courses</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{draftCount}</p>
          </div>
        </div>
      </section>

      <CourseFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewCourse={handleNewCourse}
      />

      {/* Results header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Course offerings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filteredCourses.length}</span> of {safeCourses.length} courses
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          {viewMode === 'grid' ? 'Card view' : 'Table view'}
        </div>
      </div>

      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3' : 'space-y-3'} aria-label="Loading courses">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="h-6 w-24 rounded-lg bg-slate-100" />
                <div className="h-6 w-20 rounded-lg bg-slate-100" />
              </div>
              <div className="mt-5 h-5 w-3/4 rounded bg-slate-100" />
              <div className="mt-3 h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
              <div className="mt-6 h-16 rounded-xl bg-slate-50" />
              <div className="mt-5 h-10 rounded-xl bg-slate-50" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <EmptyState
            icon={<BookOpen className="h-6 w-6 text-indigo-500" />}
            title="No courses found"
            description="No course matches the current search and filters. Try changing your search or clearing the filters."
            actionLabel="Reset filters"
            onAction={resetFilters}
          />
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <tr>
                <TableHeadCell>Course</TableHeadCell>
                <TableHeadCell>Level</TableHeadCell>
                <TableHeadCell align="center">Duration</TableHeadCell>
                <TableHeadCell align="right">Tuition</TableHeadCell>
                <TableHeadCell>Instructor</TableHeadCell>
                <TableHeadCell align="center">Status</TableHeadCell>
                <TableHeadCell align="right">Actions</TableHeadCell>
              </tr>
            </TableHeader>
            <tbody>
              {filteredCourses.map((course) => (
                <TableRow key={course.courseId} onClick={() => setSelectedCourse(course)}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
                        <BookOpen className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{course.title}</p>
                        <span className="mt-1 inline-flex rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-700">
                          {course.code}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={levelBadgeMap[course.level] || 'default'} size="sm">{course.level}</Badge>
                  </TableCell>
                  <TableCell align="center">
                    <span className="text-sm font-medium text-slate-600">{course.durationHours} hrs</span>
                  </TableCell>
                  <TableCell align="right">
                    <span className="font-semibold tabular-nums text-slate-900">${course.price.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{course.instructorName || `Faculty #${course.instructorId}`}</span>
                  </TableCell>
                  <TableCell align="center">
                    <Badge variant={statusBadgeMap[course.status] || 'neutral'} dot size="sm">{course.status}</Badge>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                      <button type="button" onClick={() => setSelectedCourse(course)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" title="View details" aria-label={`View ${course.title}`}>
                        <Eye className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleEditCourse(course)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" title="Edit course" aria-label={`Edit ${course.title}`}>
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              onSelect={setSelectedCourse}
              onEdit={handleEditCourse}
            />
          ))}
        </div>
      )}

      <CourseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        courseToEdit={courseToEdit}
        onSuccess={loadCourses}
      />

      <CourseDetailDrawer
        course={selectedCourse}
        isOpen={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        onEdit={handleEditCourse}
      />
    </div>
  );
};
