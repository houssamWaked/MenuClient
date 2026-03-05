import { useCallback, useEffect, useState } from 'react';
import { normalizePath } from '../siteHelpers.js';

export function usePathname() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPathname(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback(
    (targetPath) => {
      const nextPath = normalizePath(targetPath);
      if (nextPath === pathname) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      window.history.pushState({}, '', `${nextPath}${window.location.search}`);
      setPathname(nextPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [pathname]
  );

  return { pathname, navigate };
}
