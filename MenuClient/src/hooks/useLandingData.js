import { useEffect, useState } from 'react';
import { api } from '../api/index.js';
import { extractCollection, extractSingle } from '../utils/landing.js';
import { hasFreshSiteCache, loadSiteCache, persistSiteCache } from '../utils/site-cache.js';
import {
  getPrimaryLocation,
  normalizeBlogPosts,
  normalizeGallery,
  normalizeLocations,
  normalizeNavigation,
  normalizeSocialLinks,
  normalizeSpecials,
  normalizeTeam,
  normalizeTestimonials,
} from '../utils/site-content.js';

const initialState = {
  loading: true,
  error: '',
  tenant: null,
  primaryLocation: null,
  navigation: [],
  socialLinks: [],
  menus: [],
  locations: [],
  categories: [],
  items: [],
  featuredItems: [],
  blogPosts: [],
  gallery: [],
  specials: [],
  team: [],
  testimonials: [],
  siteContent: null,
};

function hasLiveContent(data) {
  return Boolean(
    data?.tenant ||
      data?.navigation?.length ||
      data?.items?.length ||
      data?.locations?.length ||
      data?.siteContent
  );
}

function hydrateCachedState(cachedData) {
  if (!cachedData || typeof cachedData !== 'object') {
    return initialState;
  }

  return {
    ...initialState,
    ...cachedData,
    loading: false,
    error: '',
  };
}

export function useLandingData() {
  const tenantSlug = import.meta.env.VITE_TENANT_SLUG?.trim() || 'burger-bachelor';
  const [pageData, setPageData] = useState(() => hydrateCachedState(loadSiteCache(tenantSlug)));

  useEffect(() => {
    let cancelled = false;
    const cachedState = hydrateCachedState(loadSiteCache(tenantSlug));
    const hasCachedContent = hasLiveContent(cachedState);

    async function loadPage() {
      if (!hasCachedContent) {
        setPageData((current) => ({ ...current, loading: true, error: '' }));
      }

      try {
        const site = extractSingle(await api.getPublicSite(tenantSlug));
        const siteContent =
          site?.siteContent && typeof site.siteContent === 'object' ? site.siteContent : {};
        const tenant = site?.tenant ?? null;
        const locations = normalizeLocations(site?.locations);
        const primaryLocation = getPrimaryLocation(locations);
        const navigation = normalizeNavigation(siteContent?.theme?.navigation);
        const socialLinks = normalizeSocialLinks(siteContent?.socialLinks);
        const menus = extractCollection(site?.menus);
        const categories = extractCollection(site?.categories);
        const items = extractCollection(site?.items);
        const featuredItems = extractCollection(site?.featuredItems);
        const specials = normalizeSpecials(siteContent?.specials);
        const team = normalizeTeam(siteContent?.team);
        const testimonials = normalizeTestimonials(siteContent?.testimonials);
        const gallery = normalizeGallery(siteContent?.gallery);
        const blogPosts = normalizeBlogPosts(siteContent?.blogPosts);
        const nextState = {
          loading: false,
          error: '',
          tenant,
          primaryLocation,
          navigation,
          socialLinks,
          menus,
          locations,
          categories,
          items,
          featuredItems,
          blogPosts,
          gallery,
          specials,
          team,
          testimonials,
          siteContent,
        };

        persistSiteCache(tenantSlug, nextState);

        if (!cancelled) {
          setPageData(nextState);
        }
      } catch (error) {
        const resolvedMessage =
          typeof error?.response?.data?.message === 'string' && error.response.data.message.trim()
            ? error.response.data.message.trim()
            : error?.message ?? 'Unable to reach the backend right now.';

        if (!cancelled) {
          if (hasCachedContent) {
            setPageData((current) => ({
              ...current,
              loading: false,
            }));
            return;
          }

          setPageData({
            loading: false,
            error: resolvedMessage,
            tenant: null,
            primaryLocation: null,
            navigation: [],
            socialLinks: [],
            menus: [],
            locations: [],
            categories: [],
            items: [],
            featuredItems: [],
            blogPosts: [],
            gallery: [],
            specials: [],
            team: [],
            testimonials: [],
            siteContent: null,
          });
        }
      }
    }

    if (hasCachedContent && hasFreshSiteCache(tenantSlug)) {
      return () => {
        cancelled = true;
      };
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [tenantSlug]);

  return pageData;
}
