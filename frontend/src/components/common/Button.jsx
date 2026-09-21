import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#d97706] text-white hover:bg-[#c86a00] focus:ring-[#d97706] shadow-[0_10px_22px_rgba(217,119,6,0.2)] hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-[#102039] text-white hover:bg-[#1b2b45] focus:ring-[#102039] shadow-sm hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border border-[#ded3c8] bg-[#fffdf9] text-[#102039] hover:border-[#d97706] hover:text-[#d97706] focus:ring-[#d97706] active:translate-y-0.5',
    ghost: 'text-[#34445a] hover:text-[#d97706] hover:bg-[#f8f1ea] focus:ring-[#d97706]',
    white: 'bg-white text-[#102039] hover:bg-[#fff8f1] focus:ring-white shadow-sm hover:-translate-y-0.5',
    subtle: 'bg-[#fff0df] text-[#b45309] hover:bg-[#ffe6c7] focus:ring-[#d97706]'
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
    sm: 'text-sm px-3.5 py-2 rounded-lg gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-xl gap-2 font-semibold',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5 font-semibold',
    xl: 'text-lg px-8 py-3.5 rounded-2xl gap-3 font-semibold'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}

