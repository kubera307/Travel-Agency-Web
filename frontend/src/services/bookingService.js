import { api } from './api';

export const bookingService = {
  async createBooking(bookingData) {
    return await api.post('/bookings', bookingData);
  },

  async getMyBookings() {
    return await api.get('/bookings/my');
  },

  async getBookingById(id) {
    return await api.get(`/bookings/${id}`);
  },

  async cancelBooking(id, reason = '') {
    return await api.post(`/bookings/${id}/cancel`, { reason });
  },

  async validateCoupon(code, amount) {
    return await api.post('/bookings/validate-coupon', { code, amount });
  }
};

