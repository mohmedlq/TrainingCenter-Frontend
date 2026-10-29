import React, { useState } from 'react';
import type { CreateStudent, UpdateStudent, StudentWithProfile } from '../../../types/Students';
import type { UpdateStudentProfile } from '../../../types/StudentsProfiles';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import {
  UserRound,
  MapPin,
  LoaderCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCog,
} from 'lucide-react';
import { StudentsProfileService } from '../../../Api/StudentProfile';
import { StudentsService } from '../../../Api/Students';
import { toast } from 'sonner';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: StudentWithProfile | null;
  onSuccess?: () => void;
}

const minimumLoadingTime = 650;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
  onSuccess,
}) => {
  const isEditing = !!studentToEdit;
  const [activeTab, setActiveTab] = useState<'account' | 'profile'>('account');
  const [isLoading, setIsLoading] = useState(false);

  const levelTabs = [
    {
      id: 'account' as const,
      title: 'Student account',
      subtitle: 'Identity and access',
      icon: <UserRound className="h-4 w-4" />,
    },
    {
      id: 'profile' as const,
      title: 'Personal profile',
      subtitle: 'Location and biography',
      icon: <MapPin className="h-4 w-4" />,
    },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Suspended', label: 'Suspended' },
    { value: 'Graduated', label: 'Graduated' },
    { value: 'Pending', label: 'Pending verification' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    const formElement = e.currentTarget;
    const invalidControl = Array.from(formElement.elements).find(
      (element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
        (element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement) && !element.checkValidity(),
    );

    if (invalidControl) {
      const invalidSection = invalidControl.closest('[data-form-section]')?.getAttribute('data-form-section');
      setActiveTab(invalidSection === 'profile' ? 'profile' : 'account');
      window.setTimeout(() => {
        invalidControl.focus();
        invalidControl.reportValidity();
      }, 0);
      return;
    }

    const formData = new FormData(formElement);
    const studentData = {
      firstName: (formData.get('firstName') as string) || '',
      lastName: (formData.get('lastName') as string) || '',
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string | null,
      dateOfBirth: formData.get('dateOfBirth') as string | null | Date,
    };

    const profileData: UpdateStudentProfile = {
      city: formData.get('city') as string,
      country: formData.get('country') as string,
      address: formData.get('address') as string,
      linkedInUrl: formData.get('linkedInUrl') as string,
      bio: formData.get('bio') as string,
    };

    setIsLoading(true);

    const operation = async () => {
      const startedAt = Date.now();
      try {
        if (isEditing && studentToEdit) {
          const updateStudent: UpdateStudent = {
            ...studentData,
            status: formData.get('status') as string,
          };

          await StudentsService.update(studentToEdit.studentId, updateStudent);
          await StudentsProfileService.update(studentToEdit.studentId, profileData);
        } else {
          const createStudent: CreateStudent = {
            ...studentData,
            password: formData.get('password') as string,
          };

          const newStudentId = await StudentsService.create(createStudent);
          if (newStudentId) {
            await StudentsProfileService.create(profileData);
          }
        }

        await onSuccess?.();
      } finally {
        const remainingTime = minimumLoadingTime - (Date.now() - startedAt);
        if (remainingTime > 0) await wait(remainingTime);
      }
    };

    try {
      const savePromise = operation();
      toast.promise(savePromise, {
        loading: isEditing ? 'Updating student record…' : 'Creating student record…',
        success: isEditing ? 'Student updated successfully.' : 'Student admitted successfully.',
        error: isEditing ? 'Unable to update student. Please try again.' : 'Unable to admit student. Please try again.',
      });
      await savePromise;
      onClose();
    } catch (error) {
      console.error('Failed to submit student form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => undefined : onClose}
      title={isEditing ? `Edit Student: ${studentToEdit.firstName} ${studentToEdit.lastName}` : 'Admit a new student'}
      subtitle="Manage the student account and personal profile in one place."
      maxWidth="xl"
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Changes are saved to the student records.</span>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="studentForm"
              variant="primary"
              size="sm"
              disabled={isLoading}
              className="min-w-[160px] justify-center"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  {isEditing ? 'Saving changes…' : 'Creating record…'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {isEditing ? 'Save changes' : 'Complete admission'}
                </span>
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
              <UserCog className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                {isEditing ? 'Update student information' : 'Create a student record'}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {isEditing
                  ? 'Keep the student’s account details and profile information up to date.'
                  : 'Enter the account details first, then complete optional profile information.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {levelTabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-white text-indigo-600 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                  {tab.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-semibold ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {index + 1}. {tab.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">{tab.subtitle}</span>
                </span>
                {isActive && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
              </button>
            );
          })}
        </div>

        <form
          key={studentToEdit ? studentToEdit.studentId : 'new-student'}
          id="studentForm"
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <section data-form-section="account" className={activeTab === 'account' ? 'space-y-4' : 'hidden'}>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100">
                <UserRound className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Account information</h3>
                <p className="mt-0.5 text-xs text-slate-500">Identity, contact details, and academic standing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="First name" name="firstName" defaultValue={studentToEdit?.firstName || ''} placeholder="e.g. Zayd" required />
              <Input label="Last name" name="lastName" defaultValue={studentToEdit?.lastName || ''} placeholder="e.g. Issa" required />
              <Input label="Email address" name="email" type="email" defaultValue={studentToEdit?.email || ''} placeholder="student@academy.edu" helperText="Used for student account communication." required />
              <Input label="Phone number" name="phoneNumber" type="tel" defaultValue={(studentToEdit as any)?.phoneNumber || ''} placeholder="+966 50 123 4567" />
              <Input
                label="Date of birth"
                name="dateOfBirth"
                type="date"
                defaultValue={studentToEdit?.dateOfBirth ? new Date(studentToEdit.dateOfBirth).toISOString().split('T')[0] : '2000-01-01'}
                required
              />
              <Select label="Academic status" name="status" options={statusOptions} defaultValue={studentToEdit?.status || 'Active'} />
            </div>

            {!isEditing && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-950">Initial account access</h4>
                    <p className="mt-0.5 text-xs text-amber-800">Set the initial password for the student portal.</p>
                  </div>
                </div>
                <Input label="Initial password" name="password" type="password" placeholder="Enter an initial password" helperText="Share credentials securely with the student." required />
              </div>
            )}
          </section>

          <section data-form-section="profile" className={activeTab === 'profile' ? 'space-y-4' : 'hidden'}>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Personal profile</h3>
                <p className="mt-0.5 text-xs text-slate-500">Residence and optional professional information.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="City" name="city" defaultValue={studentToEdit?.profile?.city || ''} placeholder="e.g. Riyadh" />
              <Input label="Country" name="country" defaultValue={studentToEdit?.profile?.country || ''} placeholder="e.g. Saudi Arabia" />
            </div>

            <Input label="Street address" name="address" defaultValue={studentToEdit?.profile?.address || ''} placeholder="District, street, or residence" />
            <Input label="LinkedIn profile URL" name="linkedInUrl" type="url" defaultValue={studentToEdit?.profile?.linkedInUrl || ''} placeholder="https://linkedin.com/in/profile" helperText="Optional professional profile link." />

            <div>
              <label htmlFor="student-bio" className="mb-1.5 block text-sm font-medium text-slate-700">Biography</label>
              <textarea
                id="student-bio"
                name="bio"
                rows={4}
                defaultValue={studentToEdit?.profile?.bio || ''}
                placeholder="Educational background, interests, and goals…"
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </section>
        </form>

        <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <p>Complete the fields relevant to the selected section. Your existing student and profile services will handle saving the record.</p>
        </div>
      </div>
    </Modal>
  );
};
