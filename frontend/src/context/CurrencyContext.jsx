import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0095, label: 'GBP (£)' }
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem('travel_india_currency') || 'INR');

  useEffect(() => {
    localStorage.setItem('travel_india_currency', currency);
  }, [currency]);

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.INR;

  const formatPrice = (inrAmount) => {
    if (inrAmount === undefined || inrAmount === null) return '';
    const numericAmount = Number(inrAmount) || 0;
    const converted = Math.round(numericAmount * activeCurrency.rate);

    if (activeCurrency.code === 'INR') {
      return `₹${converted.toLocaleString('en-IN')}`;
    }
    return `${activeCurrency.symbol}${converted.toLocaleString('en-US')}`;
  };

  const convertPrice = (inrAmount) => {
    const numericAmount = Number(inrAmount) || 0;
    return Math.round(numericAmount * activeCurrency.rate);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      currencies: CURRENCIES,
      activeCurrency,
      formatPrice,
      convertPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

