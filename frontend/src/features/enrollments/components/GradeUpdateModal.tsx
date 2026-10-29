import React, { useState } from 'react';
import type { EnrollmentWithDetails, UpdateEnrollment } from '../../../types/Enrollments';
import { EnrollmentsService } from '../../../Api/EnrollmentsService';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Award, CalendarCheck2, CircleAlert, LoaderCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface GradeUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: EnrollmentWithDetails | null;
  onSuccess?: () => void | Promise<void>;
}

const MIN_LOADING_MS = 650;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const getErrorMessage = (error: any) => {
  const responseData = error?.response?.data;
  if (typeof responseData === 'string') return responseData;
  if (typeof responseData?.message === 'string') return responseData.message;
  if (typeof error?.message === 'string') return error.message;
  return 'Failed to update enrollment grade and progress.';
};

export const GradeUpdateModal: React.FC<GradeUpdateModalProps> = ({
  isOpen,
  onClose,
  enrollment,
  onSuccess,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!enrollment) return null;

  const statusOptions = [
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Enrolled', label: 'Enrolled' },
    { value: 'Dropped', label: 'Dropped / Withdrawn' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const progressPercent = Number(formData.get('progressPercent'));
    const rawGrade = formData.get('finalGrade') as string;
    const finalGrade = rawGrade !== '' && rawGrade !== null ? Number(rawGrade) : null;
    const status = (formData.get('status') as string) || enrollment.status;
    const rawCompletionDate = formData.get('completionDate') as string;
    const completionDate = rawCompletionDate || null;

    if (!Number.isFinite(progressPercent) || progressPercent < 0 || progressPercent > 100) {
      setErrorMessage('Progress must be a number between 0 and 100.');
      setIsSubmitting(false);
      return;
    }

    if (finalGrade !== null && (!Number.isFinite(finalGrade) || finalGrade < 0 || finalGrade > 100)) {
      setErrorMessage('Final grade must be a number between 0 and 100.');
      setIsSubmitting(false);
      return;
    }

    const payload: UpdateEnrollment = {
      progressPercent,
      finalGrade,
      status,
      completionDate,
    };

    const startedAt = Date.now();
    const operation = (async () => {
      try {
        await EnrollmentsService.update(enrollment.enrollmentId, payload);
        await onSuccess?.();
      } finally {
        const remaining = MIN_LOADING_MS - (Date.now() - startedAt);
        if (remaining > 0) await wait(remaining);
      }
    })();

    toast.promise(operation, {
      loading: 'Saving academic evaluation…',
      success: 'Grade and progress updated successfully.',
      error: (error) => getErrorMessage(error),
    });

    try {
      await operation;
      onClose();
    } catch (error) {
      console.error('Failed to update enrollment:', error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => undefined : onClose}
      title="Update academic evaluation"
      subtitle={`${enrollment.studentName || `Student #${enrollment.studentId}`} · ${enrollment.courseCode || ''} ${enrollment.courseTitle || ''}`}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            form="grade-update-form"
            icon={isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving evaluation…' : 'Save evaluation'}
          </Button>
        </>
      }
    >
      <form id="grade-update-form" className="space-y-5" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white text-indigo-600 shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Academic record</p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900">{enrollment.courseTitle || `Course #${enrollment.courseId}`}</h3>
              <p className="mt-1 text-xs text-slate-500">Update the student's completion progress and final result.</p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-slate-600">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-semibold">Course progress</span>
            </div>
            <Input
              label="Progress (%)"
              name="progressPercent"
              type="number"
              min={0}
              max={100}
              defaultValue={enrollment.progressPercent}
              helperText="Enter a value from 0 to 100."
              required
            />
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-slate-600">
              <Award className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold">Final assessment</span>
            </div>
            <Input
              label="Final grade (%)"
              name="finalGrade"
              type="number"
              step="0.1"
              min={0}
              max={100}
              defaultValue={enrollment.finalGrade ?? ''}
              placeholder="e.g. 94.5"
              helperText="Leave empty while ungraded."
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <CalendarCheck2 className="h-4 w-4 text-sky-600" />
            <span className="text-sm font-semibold">Enrollment outcome</span>
          </div>
          <div className="space-y-4">
            <Select label="Academic status" name="status" options={statusOptions} defaultValue={enrollment.status} />
            <Input
              label="Completion date"
              name="completionDate"
              type="date"
              defaultValue={enrollment.completionDate ? enrollment.completionDate.split('T')[0] : ''}
              helperText="Leave blank if the course has not been completed."
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
