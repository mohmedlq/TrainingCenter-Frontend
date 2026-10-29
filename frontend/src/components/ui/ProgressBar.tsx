import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  status?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = true,
  size = 'md',
  status,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const getBarColor = () => {
    if (status === 'Completed' || clampedValue === 100) return 'bg-emerald-500';
    if (status === 'Dropped') return 'bg-rose-400';
    if (clampedValue < 30) return 'bg-amber-500';
    if (clampedValue < 75) return 'bg-indigo-500';
    return 'bg-indigo-600';
  };

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-600">Progress</span>
          <span className="font-semibold text-zinc-900 tabular-nums">
            {clampedValue}%
          </span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 ${sizeClasses[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
