import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  error,
  placeholder,
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
      <div className="relative">
        <select
          id={generatedId}
          disabled={disabled}
          className={`block w-full appearance-none rounded-md border text-sm transition-colors bg-white px-3 py-2 pr-8 focus:outline-hidden focus:ring-2 focus:ring-offset-0 disabled:bg-zinc-50 disabled:text-zinc-500 disabled:border-zinc-200 ${
            error
              ? 'border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-zinc-300 text-zinc-900 focus:border-indigo-500 focus:ring-indigo-500/20'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-zinc-500">{helperText}</p>
      )}
    </div>
  );
};
