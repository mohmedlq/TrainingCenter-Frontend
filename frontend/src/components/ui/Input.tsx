import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  icon,
  iconPosition = 'left',
  id,
  className = '',
  disabled,
  ...props
}) => {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-semibold text-zinc-700 tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-xs">
        {icon && iconPosition === 'left' && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            {icon}
          </div>
        )}
        <input
          id={generatedId}
          disabled={disabled}
          className={`block w-full rounded-md border text-sm transition-colors placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-offset-0 disabled:bg-zinc-50 disabled:text-zinc-500 disabled:border-zinc-200 ${
            error
              ? 'border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-zinc-300 text-zinc-900 focus:border-indigo-500 focus:ring-indigo-500/20'
          } ${icon && iconPosition === 'left' ? 'pl-9' : 'pl-3'} ${
            icon && iconPosition === 'right' ? 'pr-9' : 'pr-3'
          } py-2 ${className}`}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-zinc-500">{helperText}</p>
      )}
    </div>
  );
};
