import React from 'react';
import {
  Menu,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export interface TopNavbarProps {
  onMobileMenuToggle?: () => void;
  title?: string;
  subtitle?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onMobileMenuToggle,
  title = 'Academy Command Center',
  subtitle = 'Institutional Management & Academic Operations',
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:px-8 select-none">
      {/* Left: Mobile Drawer Trigger & Dynamic Page Context */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label="Open navigation menu"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="hidden h-2 w-2 shrink-0 rounded-full bg-indigo-600 ring-4 ring-indigo-50 sm:inline-block"
            />
            <h1 className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="mt-0.5 hidden truncate text-xs font-medium text-slate-500 sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Operational Status Context & Administrator Identity */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Academic Term Badge */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 shadow-2xs sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-100 bg-white text-indigo-600 shadow-2xs">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-semibold leading-tight text-slate-800">Term 2026-A</p>
            <p className="font-mono text-[10px] leading-tight text-slate-500">Week 8 of 16</p>
          </div>
        </div>

        {/* Live Operational Status */}
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700 md:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span>System Active</span>
        </div>

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        {/* Administrator Identity */}
        <div
          role="region"
          aria-label="Authenticated administrator profile"
          className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 shadow-2xs"
        >
          <Avatar name="Admin Registrar" size="sm" status="online" />
          <div className="hidden min-w-0 text-left sm:block">
            <div className="flex items-center gap-1">
              <span className="truncate text-xs font-semibold leading-tight text-slate-800">
                Academic Registrar
              </span>
              <Sparkles className="h-3 w-3 shrink-0 text-amber-500" />
            </div>
            <p className="mt-0.5 truncate font-mono text-[9px] leading-tight text-slate-500">
              Admin · REG-2026
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
