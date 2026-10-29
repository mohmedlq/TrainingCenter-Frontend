import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500 shadow-xs border border-indigo-700',
  secondary:
    'bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 focus-visible:ring-zinc-900 border border-zinc-900',
  outline:
    'bg-white text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 border border-zinc-300 focus-visible:ring-zinc-400 shadow-xs',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-xs border border-rose-700',
  ghost:
    'bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-2.5 text-xs font-medium gap-1.5 rounded-md',
  md: 'h-9 px-3.5 text-sm font-medium gap-2 rounded-md',
  lg: 'h-11 px-5 text-sm font-semibold gap-2.5 rounded-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'outline',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center cursor-pointer select-none transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
