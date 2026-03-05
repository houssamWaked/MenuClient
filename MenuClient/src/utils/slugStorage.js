import { DEFAULT_SLUG } from '../siteData.js';

export function getInitialSlug() {
  const urlSlug = new URLSearchParams(window.location.search).get('slug');
  if (urlSlug) return urlSlug;
  const cached = window.localStorage.getItem('public-site-slug');
  if (cached) return cached;
  return DEFAULT_SLUG;
}

export function persistSlug(slug) {
  window.localStorage.setItem('public-site-slug', slug);
  const url = new URL(window.location.href);
  url.searchParams.set('slug', slug);
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}
