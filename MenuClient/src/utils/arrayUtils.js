export function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export function dedupeStrings(values) {
  return [...new Set(values.filter((value) => typeof value === 'string' && value.trim()))];
}

export function sortByOrderAndName(items) {
  return [...items].sort((a, b) => {
    const orderA = Number.isFinite(Number(a?.sortOrder)) ? Number(a.sortOrder) : 0;
    const orderB = Number.isFinite(Number(b?.sortOrder)) ? Number(b.sortOrder) : 0;
    if (orderA !== orderB) return orderA - orderB;
    return String(a?.name ?? '').localeCompare(String(b?.name ?? ''));
  });
}
