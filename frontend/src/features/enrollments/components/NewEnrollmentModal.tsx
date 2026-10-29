import React, { useState } from 'react';
import type { Student } from '../../../types/Students';
import type { Course } from '../../../types/Courses';
import type { CreateEnrollment } from '../../../types/Enrollments';
import { EnrollmentsService } from '../../../Api/EnrollmentsService';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { AlertCircle, BookOpen, LoaderCircle, UserPlus, UsersRound } from 'lucide-react';
import { toast } from 'sonner';

interface NewEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  courses: Course[];
  onSuccess?: () => void | Promise<void>;
}

const MIN_LOADING_MS = 650;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const getErrorMessage = (error: any) => {
  const responseData = error?.response?.data;
  if (typeof responseData === 'string') return responseData;
  if (typeof responseData?.message === 'string') return responseData.message;
  if (typeof error?.message === 'string') return error.message;
  return 'Failed to enroll student. The student may already be enrolled in this course.';
};

export const NewEnrollmentModal: React.FC<NewEnrollmentModalProps> = ({
  isOpen,
  onClose,
  students,
  courses,
  onSuccess,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentOptions = students.map((student) => ({
    value: student.studentId,
    label: `${student.firstName} ${student.lastName} (${student.email})`,
  }));

  const courseOptions = courses.map((course) => ({
    value: course.courseId,
    label: `${course.code}: ${course.title} • $${course.price.toLocaleString()}`,
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    const formData = new FormData(e.currentTarget);
    const studentId = Number(formData.get('studentId'));
    const courseId = Number(formData.get('courseId'));

    if (!studentId || !courseId) {
      setErrorMessage('Please select both a student and a course.');
      return;
    }

    setIsSubmitting(true);
    const payload: CreateEnrollment = { studentId, courseId };
    const startedAt = Date.now();

    const operation = (async () => {
      try {
        await EnrollmentsService.create(payload);
        await onSuccess?.();
      } finally {
        const remaining = MIN_LOADING_MS - (Date.now() - startedAt);
        if (remaining > 0) await wait(remaining);
      }
    })();

    toast.promise(operation, {
      loading: 'Enrolling student…',
      success: 'Student enrolled successfully.',
      error: (error) => getErrorMessage(error),
    });

    try {
      await operation;
      onClose();
    } catch (error) {
      console.error('Failed to create enrollment:', error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => undefined : onClose}
      title="Create enrollment"
      subtitle="Assign a student to a course and create a new enrollment record."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            form="new-enrollment-form"
            icon={isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            disabled={isSubmitting || students.length === 0 || courses.length === 0}
          >
            {isSubmitting ? 'Creating enrollment…' : 'Confirm enrollment'}
          </Button>
        </>
      }
    >
      <form id="new-enrollment-form" className="space-y-5" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-indigo-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white text-sky-700 shadow-sm">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">New course enrollment</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">Select the student and course carefully. Duplicate enrollment rules are enforced by the backend.</p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {students.length === 0 || courses.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {students.length === 0 && courses.length === 0
              ? 'There are no students or courses available to enroll.'
              : students.length === 0
                ? 'No student records are available.'
                : 'No course records are available.'}
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <UsersRound className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold">Student selection</span>
          </div>
          <Select
            label="Student"
            placeholder="Choose a student…"
            name="studentId"
            options={studentOptions}
            required
          />
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <BookOpen className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-semibold">Course selection</span>
          </div>
          <Select
            label="Course offering"
            placeholder="Choose a course…"
            name="courseId"
            options={courseOptions}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5">
            <p className="text-[11px] font-medium text-indigo-600">Initial progress</p>
            <p className="mt-1 text-lg font-bold text-slate-900">0%</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Starting state</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5">
            <p className="text-[11px] font-medium text-emerald-700">Initial status</p>
            <p className="mt-1 text-lg font-bold text-slate-900">Enrolled</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Awaiting progress</p>
          </div>
        </div>
      </form>
    </Modal>
  );
};
