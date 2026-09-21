import { api } from './api';

export const destinationService = {
  async getDestinations(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.region) query.append('region', params.region);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const endpoint = queryString ? `/destinations?${queryString}` : '/destinations';
    return await api.get(endpoint);
  },

  async getDestinationById(idOrSlug) {
    return await api.get(`/destinations/${idOrSlug}`);
  }
};

