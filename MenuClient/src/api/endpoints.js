export const endpoints = {
  publicSiteBySlug: (slug) => `/api/v1/public/sites/${slug}`,
  publicContact: (slug) => `/api/v1/public/sites/${slug}/contact`,
  publicNewsletter: (slug) => `/api/v1/public/sites/${slug}/newsletter`,
  publicOrders: (slug) => `/api/v1/public/sites/${slug}/orders`,
};
