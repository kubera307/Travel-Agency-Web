import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    primary: 'bg-orange-50 text-orange-700 border border-orange-200/80',
    dark: 'bg-slate-900 text-white',
    green: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    outline: 'bg-transparent text-slate-700 border border-slate-300',
    glass: 'bg-white/80 backdrop-blur-md text-slate-900 border border-white/60 shadow-xs'
  };

  const sizes = {
    sm: 'text-[11px] font-medium px-2 py-0.5 rounded-md',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-lg',
    lg: 'text-sm font-semibold px-3 py-1.5 rounded-xl'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 tracking-wide ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}

