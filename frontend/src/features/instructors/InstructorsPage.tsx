import React, { useEffect, useState } from 'react';
import { InstructorFilters } from './components/InstructorFilters';
import { InstructorTable } from './components/InstructorTable';
import { InstructorFormModal } from './components/InstructorFormModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  UserCheck,
  Plus,
  Users,
  UserRoundCheck,
  UserRoundX,
  Network,
  LoaderCircle,
  ShieldCheck,
} from 'lucide-react';
import type { Instructor } from '../../types/Instructor';
import { InstructorsService } from '../../Api/Instructors';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';

export const InstructorsPage: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedManager, setSelectedManager] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [instructorToEdit, setInstructorToEdit] = useState<Instructor | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<Instructor | null>(null);

  const loadInstructors = async (options?: { silent?: boolean }) => {
    if (!options?.silent) setIsLoading(true);
    try {
      const data = await InstructorsService.getAll();
      if (Array.isArray(data)) setInstructors(data);
    } catch (error) {
      console.error('Failed to load instructors:', error);
      toast.error('Unable to load faculty records.', {
        description: 'Check your connection and try refreshing the directory.',
      });
    } finally {
      if (!options?.silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadInstructors();
  }, []);

  const safeArray = Array.isArray(instructors) ? instructors : [];
  const activeCount = safeArray.filter((instructor) => instructor.isActive).length;
  const inactiveCount = safeArray.length - activeCount;
  const reportingCount = safeArray.filter((instructor) => instructor.managerId !== null && instructor.managerId !== undefined).length;

  const filteredInstructors = safeArray.filter((instructor) => {
    const fullName = `${instructor.firstName} ${instructor.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      fullName.includes(query) ||
      (instructor.email || '').toLowerCase().includes(query) ||
      (instructor.userName || '').toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && instructor.isActive) ||
      (statusFilter === 'inactive' && !instructor.isActive);
    const matchesManager = selectedManager === 'all' || String(instructor.managerId ?? '') === selectedManager;
    return matchesSearch && matchesStatus && matchesManager;
  });

  const openNewInstructor = () => {
    setInstructorToEdit(null);
    setIsFormOpen(true);
  };

  const handleDeleteNotConnected = (instructor: Instructor) => {
    // The supplied project code does not include an instructor delete API call.
    // Do not imply that the record was deleted until the service is implemented.
    toast.info('Delete is not connected yet.', {
      description: `No changes were made to ${instructor.firstName} ${instructor.lastName}'s record. Connect the delete API before enabling this action.`,
    });
  };

  const metrics = [
    {
      label: 'Total faculty',
      value: safeArray.length,
      detail: 'All staff records',
      icon: <Users className="h-5 w-5" />,
      tone: 'indigo' as const,
    },
    {
      label: 'Active members',
      value: activeCount,
      detail: 'Eligible for assignments',
      icon: <UserRoundCheck className="h-5 w-5" />,
      tone: 'emerald' as const,
    },
    {
      label: 'Inactive members',
      value: inactiveCount,
      detail: 'Not currently active',
      icon: <UserRoundX className="h-5 w-5" />,
      tone: 'amber' as const,
    },
    {
      label: 'Reporting links',
      value: reportingCount,
      detail: 'Assigned to a manager',
      icon: <Network className="h-5 w-5" />,
      tone: 'sky' as const,
    },
  ];

  const toneClasses = {
    indigo: 'border-indigo-100 bg-indigo-50 text-indigo-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    sky: 'border-sky-100 bg-sky-50 text-sky-700',
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Page heading */}
      <section className="relative isolate overflow-hidden rounded-2xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-900/10 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-1/3 -z-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-indigo-200">
                <ShieldCheck className="h-3.5 w-3.5" /> Workforce management
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Faculty directory
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Faculty directory</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Manage staff profiles, employment details, reporting relationships, and account access from one organized workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Showing</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-white">{filteredInstructors.length}<span className="ml-1 text-sm font-normal text-slate-400">/ {safeArray.length}</span></p>
            </div>
            <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={openNewInstructor}>
              Add faculty
            </Button>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${toneClasses[metric.tone]}`}>
              {metric.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">{metric.label}</p>
              <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{metric.value}</p>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">{metric.detail}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Filters */}
      <InstructorFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedManager={selectedManager}
        onManagerChange={setSelectedManager}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewInstructor={openNewInstructor}
      />

      {/* Results */}
      {isLoading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm sm:p-14">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
              <LoaderCircle className="h-6 w-6 animate-spin" />
            </div>
            <h2 className="mt-4 text-sm font-semibold text-slate-900">Loading faculty directory</h2>
            <p className="mt-1 text-sm text-slate-500">Retrieving current staff records…</p>
            <div className="mt-6 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => <div key={item} className="h-40 animate-pulse rounded-xl border border-slate-100 bg-slate-50" />)}
            </div>
          </div>
        </section>
      ) : filteredInstructors.length === 0 ? (
        <EmptyState
          icon={<UserCheck className="h-6 w-6 text-slate-400" />}
          title="No faculty members found"
          description="Try another search, clear the filters, or add a new faculty member to the directory."
          actionLabel={searchQuery || statusFilter !== 'all' || selectedManager !== 'all' ? 'Clear filters' : 'Add faculty'}
          onAction={() => {
            if (searchQuery || statusFilter !== 'all' || selectedManager !== 'all') {
              setSearchQuery('');
              setStatusFilter('all');
              setSelectedManager('all');
            } else {
              openNewInstructor();
            }
          }}
        />
      ) : (
        <InstructorTable
          instructors={filteredInstructors}
          viewMode={viewMode}
          onEdit={(instructor) => {
            setInstructorToEdit(instructor);
            setIsFormOpen(true);
          }}
          onChangePassword={(instructor) => setPasswordTarget(instructor)}
          onDelete={handleDeleteNotConnected}
        />
      )}

      <InstructorFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        instructorToEdit={instructorToEdit}
        availableManagers={safeArray}
        onSuccess={() => loadInstructors({ silent: true })}
      />

      <ChangePasswordModal
        isOpen={!!passwordTarget}
        onClose={() => setPasswordTarget(null)}
        instructor={passwordTarget}
        onSuccess={() => loadInstructors({ silent: true })}
      />
    </div>
  );
};
