import { api } from './api';

export const enquiryService = {
  async submitEnquiry(data) {
    return await api.post('/enquiries', data);
  },

  async subscribeNewsletter(email) {
    return await api.post('/enquiries', {
      name: 'Newsletter Subscriber',
      email: email,
      message: 'Subscribed to NammaYathra newsletter & seasonal journals'
    });
  }
};

