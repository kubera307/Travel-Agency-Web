import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const toastCtx = useToast();
  const notify = toastCtx?.addToast || toastCtx?.showToast || (() => {});
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_india_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('travel_india_compare', JSON.stringify(compareList));
  }, [compareList]);

  const isInCompare = (tourId) => {
    return compareList.some(t => t.id === tourId);
  };

  const addToCompare = (tour) => {
    if (compareList.some(t => t.id === tour.id)) {
      setCompareList(prev => prev.filter(t => t.id !== tour.id));
      notify(`Removed "${tour.title}" from comparison`, 'info');
      return;
    }

    if (compareList.length >= 4) {
      notify('You can compare up to 4 tours at once', 'warning');
      return;
    }

    setCompareList(prev => [...prev, tour]);
    notify(`Added "${tour.title}" to compare list`, 'success');
  };

  const removeFromCompare = (tourId) => {
    setCompareList(prev => prev.filter(t => t.id !== tourId));
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem('travel_india_compare');
    notify('Comparison list cleared', 'info');
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      compareCount: compareList.length,
      isInCompare,
      addToCompare,
      removeFromCompare,
      clearCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

