import React, { useState } from 'react';
import type { Course, CreateCourse } from '../../../types/Courses';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { CoursesService } from '../../../Api/CoursesService';
import { toast } from 'sonner';
import { BookOpen, CalendarDays, CircleDollarSign, Clock3, GraduationCap } from 'lucide-react';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: Course | null;
  instructors?: { value: string | number; label: string }[];
  onSuccess?: () => void | Promise<void>;
}

const MIN_FEEDBACK_DURATION = 650;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  courseToEdit,
  instructors = [
    { value: 1, label: 'Dr. Alan Turing' },
    { value: 2, label: 'Prof. Ada Lovelace' },
    { value: 3, label: 'Grace Hopper' },
  ],
  onSuccess,
}) => {
  const isEditing = Boolean(courseToEdit);
  const [isLoading, setIsLoading] = useState(false);

  const levelOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Published', label: 'Published' },
    { value: 'Active', label: 'Active' },
    { value: 'Archived', label: 'Archived' },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);
    const rawPublishedAt = formData.get('publishedAt') as string;
    const rawDescription = formData.get('description') as string;

    const baseData = {
      title: (formData.get('title') as string).trim(),
      code: (formData.get('code') as string).trim(),
      description: rawDescription ? rawDescription.trim() : null,
      price: Number(formData.get('price')),
      durationHours: Number(formData.get('durationHours')),
      level: formData.get('level') as string,
      status: formData.get('status') as string,
      publishedAt: rawPublishedAt || null,
    };

    const startedAt = Date.now();
    setIsLoading(true);

    const operation = (async () => {
      if (isEditing && courseToEdit) {
        await CoursesService.update(courseToEdit.courseId, baseData);
      } else {
        const createData: CreateCourse = {
          ...baseData,
          instructorId: Number(formData.get('instructorId')),
        };
        await CoursesService.create(createData);
      }

      // Keep feedback visible long enough to avoid a flash on fast API responses.
      const remaining = MIN_FEEDBACK_DURATION - (Date.now() - startedAt);
      if (remaining > 0) await delay(remaining);
      await onSuccess?.();
    })();

    toast.promise(operation, {
      loading: isEditing ? 'Saving course changes…' : 'Creating course…',
      success: isEditing ? 'Course updated successfully.' : 'Course created successfully.',
      error: (error) => {
        console.error('Failed to create or update course:', error);
        return isEditing
          ? 'Could not update the course. Please try again.'
          : 'Could not create the course. Please try again.';
      },
    });

    try {
      await operation;
      onClose();
    } catch (error) {
      // toast.promise already presents the error to the user.
      console.error('Course save operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => undefined : onClose}
      title={isEditing ? `Edit course · ${courseToEdit?.code ?? ''}` : 'Create a course'}
      subtitle={isEditing
        ? 'Update the curriculum details and course availability.'
        : 'Add a new offering to your training catalog.'}
      maxWidth="xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            form="course-form"
            disabled={isLoading}
            icon={isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
          >
            {isLoading ? (isEditing ? 'Saving changes…' : 'Creating course…') : (isEditing ? 'Save changes' : 'Create course')}
          </Button>
        </>
      }
    >
      <form id="course-form" className="space-y-5" onSubmit={handleSubmit}>
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-sky-50/70 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Course information</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Set a recognizable title and unique code, then configure the learning level, tuition, and publication status.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            <h4 className="text-sm font-semibold text-slate-900">Course identity</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Input
                name="title"
                label="Course title"
                defaultValue={courseToEdit?.title || ''}
                placeholder="e.g. Modern Full-Stack Web Development"
                required
              />
            </div>
            <div>
              <Input
                name="code"
                label="Course code"
                defaultValue={courseToEdit?.code || ''}
                placeholder="e.g. CS-101"
                helperText="Must be unique"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="course-description" className="mb-1.5 block text-sm font-medium text-slate-700">
              Description and syllabus
            </label>
            <textarea
              id="course-description"
              name="description"
              rows={4}
              defaultValue={courseToEdit?.description || ''}
              placeholder="Describe the course objectives, topics, and prerequisites…"
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CircleDollarSign className="h-4 w-4 text-emerald-600" />
            <h4 className="text-sm font-semibold text-slate-900">Course setup</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              name="price"
              label="Tuition price ($)"
              type="number"
              defaultValue={courseToEdit?.price ?? 500}
              placeholder="500"
            />
            <Input
              name="durationHours"
              label="Duration (hours)"
              type="number"
              defaultValue={courseToEdit?.durationHours ?? 40}
              placeholder="40"
            />
            <Select
              name="level"
              label="Skill level"
              options={levelOptions}
              defaultValue={courseToEdit?.level || 'Beginner'}
            />
          </div>

          {!isEditing && (
            <Select
              name="instructorId"
              label="Lead instructor"
              placeholder="Select instructor"
              options={instructors}
              defaultValue={instructors[0]?.value ?? ''}
            />
          )}
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CalendarDays className="h-4 w-4 text-violet-600" />
            <h4 className="text-sm font-semibold text-slate-900">Publication settings</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              name="status"
              label="Publication status"
              options={statusOptions}
              defaultValue={courseToEdit?.status || 'Draft'}
            />
            <Input
              name="publishedAt"
              label="Publication date"
              type="date"
              defaultValue={courseToEdit?.publishedAt ? courseToEdit.publishedAt.split('T')[0] : ''}
              helperText="Leave empty if the course is not published yet."
            />
          </div>
        </section>

        {isLoading && (
          <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm text-indigo-800" role="status" aria-live="polite">
            <Clock3 className="h-4 w-4 animate-pulse" />
            <span>{isEditing ? 'Saving your course changes…' : 'Creating your course…'}</span>
          </div>
        )}
      </form>
    </Modal>
  );
};
