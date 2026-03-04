/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react';
import { useSiteData } from '../hooks/useSiteData.js';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const tenantSlug = import.meta.env.VITE_TENANT_SLUG?.trim() || 'pizza-palazzo';
  const query = useSiteData(tenantSlug);

  const value = useMemo(
    () => ({
      tenantSlug,
      ...query,
    }),
    [query, tenantSlug]
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteDataContext() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteDataContext must be used inside SiteDataProvider');
  }

  return context;
}
