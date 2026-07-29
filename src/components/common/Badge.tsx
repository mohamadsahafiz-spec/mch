import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'cyan' | 'indigo' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  dot = true,
  className = ''
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    amber: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    rose: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
    blue: 'bg-blue-950/70 text-blue-300 border-blue-800/60',
    cyan: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
    indigo: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
    gray: 'bg-slate-900/80 text-slate-300 border-slate-700/60'
  };

  const dotColors = {
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    blue: 'bg-blue-400',
    cyan: 'bg-sky-400',
    indigo: 'bg-indigo-400',
    gray: 'bg-slate-400'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
