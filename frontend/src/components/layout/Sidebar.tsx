import React, { useEffect } from 'react';
import {
  GraduationCap,
  BarChart3,
  BookOpen,
  UserCheck,
  Users,
  Award,
  Building2,
  ChevronRight,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'overview' | 'courses' | 'instructors' | 'students' | 'enrollments';

export interface SidebarProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  path: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'overview',
  onTabChange,
  isMobileOpen = false,
  onMobileClose,
}) => {
  // Close drawer on Escape key when mobile menu is open
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onMobileClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onMobileClose]);

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Academy Overview',
      description: 'Operations & key metrics',
      icon: <BarChart3 className="h-[18px] w-[18px]" strokeWidth={2} />,
      path: '/',
    },
    {
      id: 'courses',
      label: 'Course Catalog',
      description: 'Curriculum & schedules',
      icon: <BookOpen className="h-[18px] w-[18px]" strokeWidth={2} />,
      badge: 'Courses',
      path: '/courses',
    },
    {
      id: 'instructors',
      label: 'Faculty Directory',
      description: 'Instructors & leadership',
      icon: <UserCheck className="h-[18px] w-[18px]" strokeWidth={2} />,
      badge: 'Faculty',
      path: '/instructors',
    },
    {
      id: 'students',
      label: 'Student Directory',
      description: 'Admissions & profiles',
      icon: <Users className="h-[18px] w-[18px]" strokeWidth={2} />,
      badge: 'Students',
      path: '/students',
    },
    {
      id: 'enrollments',
      label: 'Enrollments & Grades',
      description: 'Progress & evaluations',
      icon: <Award className="h-[18px] w-[18px]" strokeWidth={2} />,
      badge: 'Records',
      path: '/enrollments',
    },
  ];

  const sidebarContent = (
    <aside className="relative flex h-full w-72 flex-col overflow-hidden border-r border-slate-800/80 bg-slate-950 text-slate-300 select-none">
      {/* Subtle top glow highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent"
      />

      {/* Brand Header */}
      <div className="relative border-b border-white/[0.08] px-5 py-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-950/50 ring-1 ring-white/20">
              <GraduationCap className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-500" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-indigo-400/25 bg-indigo-500/15 px-1.5 py-0.5 font-mono text-[14px] font-bold uppercase tracking-wider text-indigo-300">
                                    EduCenter

                </span>
              </div>
              <p className="truncate text-[11px] font-medium text-slate-400">
                Institutional Management
              </p>
            </div>
          </div>

          {isMobileOpen && (
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close navigation"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Campus Context Card */}
      <div className="px-4 pt-3.5">
        <div className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-slate-900/60 p-3 backdrop-blur-sm transition-colors hover:border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/90 text-slate-300 group-hover:text-white transition-colors">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-semibold text-slate-100">Main Campus</p>
                <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
              </div>
              <p className="truncate text-[10px] text-slate-400">Central Academic Division</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav aria-label="Main navigation" className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        <div className="flex items-center justify-between px-3 pb-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspaces
          </span>
          <span className="rounded border border-slate-800/80 bg-slate-900 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-400">
            05 MODULES
          </span>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  onTabChange?.(item.id);
                  onMobileClose?.();
                }}
                className={`group relative flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  isActive
                    ? 'border-indigo-400/25 bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent text-white shadow-sm shadow-indigo-950/30'
                    : 'border-transparent text-slate-400 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-slate-100'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.7)]"
                  />
                )}

                {/* Icon Container */}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'border border-indigo-400/30 bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-300/20 shadow-xs'
                      : 'border border-slate-800/80 bg-slate-900/80 text-slate-400 group-hover:border-slate-700 group-hover:bg-slate-800 group-hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </span>

                {/* Labels */}
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-[13px] font-semibold leading-tight ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`mt-0.5 block truncate text-[10px] leading-tight ${
                      isActive ? 'text-indigo-200/80' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  >
                    {item.description}
                  </span>
                </span>

                {/* Badge or Arrow */}
                {item.badge ? (
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider transition-colors ${
                      isActive
                        ? 'border border-indigo-300/20 bg-indigo-400/15 text-indigo-200'
                        : 'border border-slate-800 bg-slate-900/90 text-slate-500 group-hover:border-slate-700 group-hover:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isActive
                        ? 'translate-x-0 text-indigo-300'
                        : '-translate-x-1 text-slate-600 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Administrative Session & System Security Footer */}
      <div className="relative border-t border-white/[0.08] p-3.5">
        <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-3 shadow-inner">
          <div className="mt-2.5 justify-center flex gap-1 items-center border-t border-white/[0.06] pt-2 text-[10px]">
            <span className="text-slate-400">Made by :</span>
            <span className="font-mono font-medium text-emerald-400"> Mohamed</span>
          </div>
        </div>

        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-widest text-slate-500">
          EduCenter · Admin Core
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            onClick={onMobileClose}
            aria-hidden="true"
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
          />
          <div className="relative z-10 h-full w-72 max-w-[85vw] shadow-2xl shadow-black/80">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
