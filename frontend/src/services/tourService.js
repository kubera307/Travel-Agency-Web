import { api } from './api';

export const tourService = {
  async getTours(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.difficulty) query.append('difficulty', params.difficulty);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.duration) query.append('duration', params.duration);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const endpoint = queryString ? `/tours?${queryString}` : '/tours';
    return await api.get(endpoint);
  },

  async getTourById(idOrSlug) {
    return await api.get(`/tours/${idOrSlug}`);
  },

  async getFeaturedTours() {
    try {
      const res = await api.get('/tours/featured');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res;
      }
    } catch (e) {
      // fallback
    }
    return await api.get('/tours?limit=6');
  },

  async getUpcomingDepartures() {
    return await api.get('/tours?upcoming=true&limit=8');
  }
};

