import { useEffect, useState } from 'react';
import { api } from '../api/index.js';
import { extractCollection, extractSingle } from '../utils/landing.js';

const initialState = {
  loading: true,
  error: '',
  tenant: null,
  menus: [],
  categories: [],
  items: [],
  featuredItems: [],
};

export function useLandingData() {
  const [pageData, setPageData] = useState(initialState);
  const tenantSlug = import.meta.env.VITE_TENANT_SLUG?.trim();

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      setPageData((current) => ({ ...current, loading: true, error: '' }));

      try {
        let tenant = null;

        if (tenantSlug) {
          try {
            tenant = extractSingle(await api.getTenantBySlug(tenantSlug));
          } catch {
            tenant = null;
          }
        }

        if (!tenant) {
          const tenants = extractCollection(await api.listTenants());
          tenant = tenants.find((entry) => entry.isActive !== false) ?? tenants[0] ?? null;
        }

        let menus = [];
        let categories = [];
        let items = [];
        let featuredItems = [];

        if (tenant?.id) {
          const [menuPayload, itemPayload, featuredPayload] = await Promise.all([
            api.listMenus(tenant.id).catch(() => null),
            api.listItems(tenant.id).catch(() => null),
            api.listFeaturedItems(tenant.id).catch(() => null),
          ]);

          menus = extractCollection(menuPayload);
          items = extractCollection(itemPayload);
          featuredItems = extractCollection(featuredPayload);

          if (menus[0]?.id) {
            categories = extractCollection(await api.listCategories(menus[0].id).catch(() => null));
          }
        }

        if (!cancelled) {
          setPageData({
            loading: false,
            error: '',
            tenant,
            menus,
            categories,
            items,
            featuredItems,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setPageData({
            loading: false,
            error: error?.message ?? 'Unable to reach the backend right now.',
            tenant: null,
            menus: [],
            categories: [],
            items: [],
            featuredItems: [],
          });
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [tenantSlug]);

  return pageData;
}
