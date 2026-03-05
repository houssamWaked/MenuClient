import { http } from './httpClient.js';

function sitePath(slug) {
  return `/api/v1/public/sites/${encodeURIComponent(slug)}`;
}

export const publicSiteApi = {
  async getSite(slug) {
    const response = await http.get(sitePath(slug));
    return response.data?.data;
  },

  async submitContact(slug, body) {
    const response = await http.post(`${sitePath(slug)}/contact`, body);
    return response.data?.data;
  },

  async subscribeNewsletter(slug, body) {
    const response = await http.post(`${sitePath(slug)}/newsletter`, body);
    return response.data?.data;
  },

  async createOrder(slug, body) {
    const response = await http.post(`${sitePath(slug)}/orders`, body);
    return response.data?.data;
  },
};
