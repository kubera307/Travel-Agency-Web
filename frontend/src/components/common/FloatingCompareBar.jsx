import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { ArrowRight, X, Layers } from 'lucide-react';

export default function FloatingCompareBar() {
  const { compareList, compareCount, removeFromCompare, clearCompare } = useCompare();

  if (compareCount === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl bg-[#0B192C]/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Left Info & Thumbnails */}
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Compare Tours</p>
            <p className="text-[10px] text-slate-400">{compareCount} of 4 selected</p>
          </div>
        </div>

        {/* Tour mini badges */}
        <div className="flex items-center gap-2">
          {compareList.map((t) => (
            <div
              key={t.id}
              className="relative flex items-center gap-1.5 bg-white/10 hover:bg-white/15 rounded-xl p-1 pr-2 border border-white/10 shrink-0 max-w-[140px]"
            >
              <img
                src={t.primary_image || t.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=100&q=80'}
                alt={t.title}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <span className="text-[10px] font-medium text-slate-200 truncate">{t.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCompare(t.id);
                }}
                className="w-4 h-4 rounded-full bg-black/40 hover:bg-rose-500 text-white flex items-center justify-center text-[10px] transition-colors shrink-0 ml-1"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <button
          onClick={clearCompare}
          className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          Clear
        </button>
        <Link
          to="/compare"
          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

