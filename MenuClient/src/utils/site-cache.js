const CACHE_VERSION = 1;
const STORAGE_PREFIX = 'menuclient.site-data.';
const COOKIE_PREFIX = 'menuclient.site-cache.';
const CACHE_TTL_MS = 30 * 60 * 1000;
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getStorageKey(slug) {
  return `${STORAGE_PREFIX}${slug}`;
}

function getCookieName(slug) {
  return `${COOKIE_PREFIX}${slug}`.replace(/[^a-z0-9_.-]/gi, '_');
}

function readCookie(name) {
  if (typeof document === 'undefined' || !document.cookie) {
    return '';
  }

  const prefix = `${name}=`;
  return document.cookie
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(prefix))
    ?.slice(prefix.length) ?? '';
}

function expireCookie(name) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function isFreshTimestamp(value, maxAgeMs) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && Date.now() - timestamp <= maxAgeMs;
}

export function hasFreshSiteCache(slug) {
  if (!slug || typeof document === 'undefined') {
    return false;
  }

  return isFreshTimestamp(readCookie(getCookieName(slug)), CACHE_TTL_MS);
}

export function loadSiteCache(slug) {
  if (!slug || !canUseStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(getStorageKey(slug));

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    if (
      parsedValue?.version !== CACHE_VERSION ||
      !parsedValue.data ||
      typeof parsedValue.data !== 'object'
    ) {
      window.localStorage.removeItem(getStorageKey(slug));
      expireCookie(getCookieName(slug));
      return null;
    }

    if (!isFreshTimestamp(parsedValue.cachedAt, MAX_CACHE_AGE_MS)) {
      window.localStorage.removeItem(getStorageKey(slug));
      expireCookie(getCookieName(slug));
      return null;
    }

    return parsedValue.data;
  } catch {
    window.localStorage.removeItem(getStorageKey(slug));
    expireCookie(getCookieName(slug));
    return null;
  }
}

export function persistSiteCache(slug, data) {
  if (!slug || !canUseStorage() || !data || typeof data !== 'object') {
    return;
  }

  const cachedAt = Date.now();
  const payload = {
    version: CACHE_VERSION,
    cachedAt,
    data,
  };

  try {
    window.localStorage.setItem(getStorageKey(slug), JSON.stringify(payload));
    if (typeof document !== 'undefined') {
      document.cookie = `${getCookieName(slug)}=${cachedAt}; Max-Age=${Math.floor(
        CACHE_TTL_MS / 1000
      )}; Path=/; SameSite=Lax`;
    }
  } catch {
    // Ignore storage write failures and keep runtime data in memory.
  }
}
