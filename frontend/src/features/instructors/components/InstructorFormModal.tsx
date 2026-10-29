import React, { useState } from 'react';
import type { Instructor } from '../../../types/Instructor';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { InstructorsService } from '../../../Api/Instructors';
import { toast } from 'sonner';
import { BadgeCheck, BriefcaseBusiness, Building2, CalendarDays, CircleUserRound, KeyRound, LoaderCircle, UserRound } from 'lucide-react';

interface InstructorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorToEdit?: Instructor | null;
  availableManagers: Instructor[];
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

export const InstructorFormModal: React.FC<InstructorFormModalProps> = ({
  isOpen,
  onClose,
  instructorToEdit,
  availableManagers,
  onSuccess,
}) => {
  const isEditing = !!instructorToEdit;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const baseData = {
      firstName: (formData.get('firstName') as string).trim(),
      lastName: (formData.get('lastName') as string).trim(),
      email: (formData.get('email') as string).trim(),
      userName: ((formData.get('userName') as string) || '').trim() || null,
      hireDate: formData.get('hireDate') as string,
      salary: Number(formData.get('salary')),
      managerId: formData.get('managerID') ? Number(formData.get('managerID')) : null,
      isActive: formData.get('isActive') === 'on',
    };

    setIsSubmitting(true);
    try {
      await toast.promise(
        withMinimumFeedback(async () => {
          if (isEditing && instructorToEdit) {
            await InstructorsService.update(instructorToEdit.instructorId, baseData);
          } else {
            const create = {
              ...baseData,
              password: formData.get('password') as string,
            };
            await InstructorsService.create(create);
          }
          await onSuccess?.();
        }),
        {
          loading: isEditing ? 'Saving faculty changes…' : 'Creating faculty account…',
          success: isEditing ? 'Faculty member updated successfully.' : 'Faculty member created successfully.',
          error: (error) => {
            const message = (error as any)?.response?.data?.message;
            return typeof message === 'string' ? message : 'Could not save the faculty record. Please try again.';
          },
        }
      );
      onClose();
    } catch (error) {
      console.error('An error occurred while adding/updating instructor', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const managerOptions = [
    { label: 'No manager — reports to faculty dean', value: '' },
    ...availableManagers
      .filter((manager) => manager.instructorId !== instructorToEdit?.instructorId)
      .map((manager) => ({
        label: `${manager.firstName} ${manager.lastName} (ID #${manager.instructorId})`,
        value: manager.instructorId,
      })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title={isEditing ? `Edit ${instructorToEdit.firstName} ${instructorToEdit.lastName}` : 'Add a faculty member'}
      subtitle={isEditing ? 'Update staff details, reporting relationships, and account status.' : 'Create a staff record and configure institutional account details.'}
      maxWidth="xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="instructor-form" size="sm" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
            {isSubmitting ? (isEditing ? 'Saving changes…' : 'Creating account…') : (isEditing ? 'Save changes' : 'Create faculty account')}
          </Button>
        </>
      }
    >
      <form
        key={instructorToEdit ? instructorToEdit.instructorId : 'create-new'}
        className="space-y-5"
        id="instructor-form"
        onSubmit={handleSubmit}
      >
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-sky-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
              <CircleUserRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Faculty profile</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {isEditing ? 'Keep staff identity and contact information accurate.' : 'Start with the faculty member’s identity and institutional contact details.'}
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-3 rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="mb-1 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700"><UserRound className="h-4 w-4" /></div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Personal information</h4>
              <p className="text-xs text-slate-500">Name and contact details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="First name" name="firstName" defaultValue={instructorToEdit?.firstName || ''} placeholder="e.g. Elena" required />
            <Input label="Last name" name="lastName" defaultValue={instructorToEdit?.lastName || ''} placeholder="e.g. Rostova" required />
            <Input label="Institutional email" name="email" type="email" defaultValue={instructorToEdit?.email || ''} placeholder="name@academy.edu" helperText="Must be unique across the institution" required />
            <Input label="System username" name="userName" defaultValue={instructorToEdit?.userName || ''} placeholder="e.g. erostova" required />
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><BriefcaseBusiness className="h-4 w-4" /></div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Employment details</h4>
              <p className="text-xs text-slate-500">Tenure, compensation, and reporting structure</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Hire date" name="hireDate" type="date" defaultValue={instructorToEdit?.hireDate ? instructorToEdit.hireDate.split('T')[0] : new Date().toISOString().split('T')[0]} required />
            <Input label="Annual compensation ($)" name="salary" type="number" defaultValue={instructorToEdit?.salary ?? 75000} placeholder="75000" required />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
            Employment dates and compensation are stored in the instructor record.
          </div>

          <div className="pt-1">
            <Select options={managerOptions} label="Department supervisor" name="managerID" defaultValue={instructorToEdit?.managerId ?? ''} />
          </div>
        </section>

        {!isEditing && (
          <section className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700"><KeyRound className="h-4 w-4" /></div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Initial account access</h4>
                <p className="text-xs text-slate-600">Set the temporary password for the new faculty account.</p>
              </div>
            </div>
            <Input label="Temporary password" name="password" type="password" placeholder="Enter an initial password" helperText="Use a strong password and share it securely." required />
          </section>
        )}

        <section className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input
            id="is-active-checkbox"
            name="isActive"
            type="checkbox"
            defaultChecked={instructorToEdit ? instructorToEdit.isActive : true}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="is-active-checkbox" className="cursor-pointer">
            <span className="block text-sm font-semibold text-slate-800">Active faculty member</span>
            <span className="mt-0.5 block text-xs leading-5 text-slate-500">Active staff can be assigned to courses and included in normal faculty workflows.</span>
          </label>
        </section>
      </form>
    </Modal>
  );
};
