import { useEffect, useState } from 'react';
import { publicSiteApi } from '../api/publicSite.js';
import { FALLBACK_SLUGS } from '../siteData.js';
import { dedupeStrings, parseError, persistSlug } from '../siteHelpers.js';

export function useSiteLoader(preferredSlug, onSiteLoaded) {
  const [activeSlug, setActiveSlug] = useState('');
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadSite() {
      setLoading(true);
      setLoadError('');
      const candidates = dedupeStrings([preferredSlug, ...FALLBACK_SLUGS]);
      let lastError = null;

      for (const candidate of candidates) {
        try {
          const payload = await publicSiteApi.getSite(candidate);
          if (!mounted) return;
          setSiteData(payload);
          onSiteLoaded?.(payload);
          setActiveSlug(candidate);
          persistSlug(candidate);
          setLoading(false);
          return;
        } catch (error) {
          lastError = error;
        }
      }

      if (!mounted) return;
      setLoadError(parseError(lastError));
      setLoading(false);
    }

    loadSite();
    return () => {
      mounted = false;
    };
  }, [onSiteLoaded, preferredSlug]);

  return {
    activeSlug,
    siteData,
    loading,
    loadError,
    setSiteData,
  };
}
