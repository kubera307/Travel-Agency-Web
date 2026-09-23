import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actionText,
  actionLink,
  onActionClick,
  align = 'left',
  className = ''
}) {
  const isCenter = align === 'center';

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12 ${
        isCenter ? 'text-center md:items-center' : 'text-left'
      } ${className}`}
    >
      <div className={`${isCenter ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
        {eyebrow && (
          <p className="eyebrow mb-2.5">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="font-display text-2xl font-extrabold leading-tight tracking-[-0.055em] text-[#102039] sm:text-3xl lg:text-4xl">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && (
        <div className={`shrink-0 ${isCenter ? 'mt-4' : ''}`}>
          {actionLink ? (
            <Link
              to={actionLink}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#34445a] transition-colors hover:text-[#d97706]"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#34445a] transition-colors hover:text-[#d97706]"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

