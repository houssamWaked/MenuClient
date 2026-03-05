import { DEFAULT_SLUG } from '../siteData.js';

export function getInitialSlug() {
  return DEFAULT_SLUG;
}

export function persistSlug(slug) {
  window.localStorage.setItem('public-site-slug', slug);
  const url = new URL(window.location.href);
  url.searchParams.set('slug', slug);
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}
