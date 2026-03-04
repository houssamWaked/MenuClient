import { SiteDataContext } from './site-data-context.js';

export function SiteDataProvider({ value, children }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}
