import React, { useState } from 'react';
import type { ChangeInstructorPassword, Instructor } from '../../../types/Instructor';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { KeyRound, ShieldAlert, ShieldCheck, LoaderCircle } from 'lucide-react';
import { InstructorsService } from '../../../Api/Instructors';
import { toast } from 'sonner';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor: Instructor | null;
  onSuccess?: () => void | Promise<void>;
}

const MIN_FEEDBACK_MS = 650;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function withMinimumFeedback<T>(operation: () => Promise<T>): Promise<T> {
  const startedAt = Date.now();
  try {
    const result = await operation();
    await wait(Math.max(0, MIN_FEEDBACK_MS - (Date.now() - startedAt)));
    return result;
  } catch (error) {
    await wait(Math.max(0, MIN_FEEDBACK_MS - (Date.now() - startedAt)));
    throw error;
  }
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  instructor,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!instructor) return null;

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data: ChangeInstructorPassword = { newPassword, confirmPassword };
      await toast.promise(
        withMinimumFeedback(async () => {
          const isExist = await InstructorsService.IsExist(instructor.instructorId);
          if (!isExist) throw new Error('This instructor could not be found. Refresh the directory and try again.');
          await InstructorsService.changePassword(instructor.instructorId, data);
          await onSuccess?.();
        }),
        {
          loading: 'Updating account password…',
          success: 'Instructor password updated successfully.',
          error: (error) => {
            const message = (error as any)?.response?.data?.message ?? (error as any)?.response?.data;
            return typeof message === 'string' ? message : (error as Error)?.message || 'Could not update the password. Please try again.';
          },
        }
      );
      onClose();
    } catch (error) {
      console.error('Failed to change password', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { if (!isSubmitting) onClose(); }}
      title="Reset faculty password"
      subtitle={`Update login credentials for ${instructor.firstName} ${instructor.lastName}.`}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button form="password-form" variant="primary" size="sm" type="submit" disabled={isSubmitting} icon={isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}>
            {isSubmitting ? 'Updating password…' : 'Update password'}
          </Button>
        </>
      }
    >
      <form className="space-y-5" id="password-form" onSubmit={handleUpdatePassword}>
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">Account security</h3>
              <p className="mt-1 break-words text-xs leading-5 text-slate-600">{instructor.firstName} {instructor.lastName}</p>
              <p className="mt-0.5 break-all text-xs text-slate-500">{instructor.email}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs leading-5">Changing the password may invalidate existing sign-in sessions for this faculty account. Ensure the new credentials are shared securely.</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5">
          <Input name="newPassword" label="New password" type="password" placeholder="Enter a new password" helperText="Use at least 8 characters, including a number and a symbol." required />
          <Input name="confirmPassword" label="Confirm new password" type="password" placeholder="Re-enter the new password" required />
        </div>
      </form>
    </Modal>
  );
};
