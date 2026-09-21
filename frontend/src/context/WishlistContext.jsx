import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_india_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with API when user logs in
  useEffect(() => {
    if (token) {
      fetch('/api/favourites', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.favourites && Array.isArray(data.favourites)) {
            const serverIds = data.favourites.map(f => f.tour_id || f.id);
            setWishlist(prev => {
              const combined = Array.from(new Set([...prev, ...serverIds]));
              localStorage.setItem('travel_india_wishlist', JSON.stringify(combined));
              return combined;
            });
          }
        })
        .catch(err => console.error('Failed to sync favourites:', err));
    }
  }, [token]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('travel_india_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (tourId) => {
    return wishlist.includes(tourId);
  };

  const toggleWishlist = async (tourOrId, tourTitle = 'Tour') => {
    const tourId = typeof tourOrId === 'object' && tourOrId !== null ? tourOrId.id : tourOrId;
    const title = typeof tourOrId === 'object' && tourOrId !== null ? (tourOrId.title || tourTitle) : tourTitle;
    const isCurrentlyIn = wishlist.includes(tourId);

    if (isCurrentlyIn) {
      setWishlist(prev => prev.filter(id => id !== tourId));
      if (typeof addToast === 'function') addToast(`Removed "${title}" from wishlist`, 'info');

      if (token) {
        try {
          await fetch(`/api/favourites/${tourId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (e) {
          console.error('Failed to delete favourite on server:', e);
        }
      }
    } else {
      setWishlist(prev => [...prev, tourId]);
      if (typeof addToast === 'function') addToast(`Saved "${title}" to your wishlist ❤️`, 'success');

      if (token) {
        try {
          await fetch('/api/favourites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ tour_id: tourId })
          });
        } catch (e) {
          console.error('Failed to save favourite on server:', e);
        }
      }
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('travel_india_wishlist');
    if (typeof addToast === 'function') addToast('Wishlist cleared', 'info');
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      isInWishlist,
      isWishlisted: isInWishlist,
      toggleWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

