import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
  className = ''
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`relative my-8 w-full transform overflow-hidden rounded-[26px] border border-[#e8dfd5] bg-[#fffdf9] text-left shadow-[0_24px_70px_rgba(15,23,42,0.18)] transition-all ${maxWidth} ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-[#eee5dc] px-6 py-4">
              <h3 className="font-display text-lg font-bold text-[#102039]">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {!title && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 backdrop-blur-sm shadow-xs transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

