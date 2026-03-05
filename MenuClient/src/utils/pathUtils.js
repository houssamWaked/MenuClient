export function normalizePath(pathname) {
  const clean = pathname?.trim() || '/';
  if (clean === '/') return '/';
  return clean.endsWith('/') ? clean.slice(0, -1) : clean;
}
