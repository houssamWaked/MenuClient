import { http } from './httpClient.js';
import { endpoints } from './endpoints.js';

function unwrap(response) {
  const payload = response?.data;
  return payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;
}

export const api = {
  getPublicSite: async (slug) => {
    const response = await http.get(endpoints.publicSiteBySlug(slug));
    return unwrap(response);
  },

  submitContact: async (slug, body) => {
    const response = await http.post(endpoints.publicContact(slug), body);
    return unwrap(response);
  },

  subscribeNewsletter: async (slug, body) => {
    const response = await http.post(endpoints.publicNewsletter(slug), body);
    return unwrap(response);
  },

  createPublicOrder: async (slug, body) => {
    const response = await http.post(endpoints.publicOrders(slug), body);
    return unwrap(response);
  },
};
