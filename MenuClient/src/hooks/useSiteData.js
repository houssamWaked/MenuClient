import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/api.js';

const memoryCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getCacheKey(slug) {
  return `public-site:${slug}`;
}

function readLocalCache(slug) {
  try {
    const raw = localStorage.getItem(getCacheKey(slug));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeLocalCache(slug, payload) {
  try {
    localStorage.setItem(
      getCacheKey(slug),
      JSON.stringify({
        data: payload,
        fetchedAt: Date.now(),
      })
    );
  } catch {
    // Ignore storage failures.
  }
}

function getCachedPayload(slug) {
  const inMemory = memoryCache.get(slug);
  if (inMemory && Date.now() - inMemory.fetchedAt < CACHE_TTL_MS) {
    return inMemory;
  }

  const persisted = readLocalCache(slug);
  if (!persisted) {
    return null;
  }

  if (typeof persisted.fetchedAt !== 'number') {
    return null;
  }

  if (Date.now() - persisted.fetchedAt > CACHE_TTL_MS) {
    return null;
  }

  memoryCache.set(slug, persisted);
  return persisted;
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid site payload received from the backend.');
  }

  if (!payload.tenant || typeof payload.tenant !== 'object') {
    throw new Error('Invalid site payload: missing tenant.');
  }

  return {
    tenant: payload.tenant,
    locations: Array.isArray(payload.locations) ? payload.locations : [],
    menus: Array.isArray(payload.menus) ? payload.menus : [],
    categories: Array.isArray(payload.categories) ? payload.categories : [],
    items: Array.isArray(payload.items) ? payload.items : [],
    featuredItems: Array.isArray(payload.featuredItems) ? payload.featuredItems : [],
    siteContent: payload.siteContent && typeof payload.siteContent === 'object' ? payload.siteContent : {},
  };
}

export function useSiteData(tenantSlug) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async ({ force = false } = {}) => {
      const cached = getCachedPayload(tenantSlug);

      if (cached && !force) {
        setData(cached.data);
        setIsLoading(false);
        return cached.data;
      }

      if (data) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const payload = await api.getPublicSite(tenantSlug);
        const safePayload = validatePayload(payload);
        const cacheEntry = { data: safePayload, fetchedAt: Date.now() };

        memoryCache.set(tenantSlug, cacheEntry);
        writeLocalCache(tenantSlug, safePayload);
        setData(safePayload);
        setError(null);
        return safePayload;
      } catch (requestError) {
        const persisted = readLocalCache(tenantSlug);
        if (persisted?.data) {
          setData(persisted.data);
          setError(null);
          return persisted.data;
        }

        setError(requestError);
        return null;
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [data, tenantSlug]
  );

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const cached = getCachedPayload(tenantSlug);
      if (cached && isMounted) {
        setData(cached.data);
        setIsLoading(false);
      }

      if (isMounted) {
        await load({ force: !cached });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [load, tenantSlug]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    reload: () => load({ force: true }),
  };
}
