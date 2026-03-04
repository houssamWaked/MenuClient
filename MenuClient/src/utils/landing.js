function slugifyLabel(value, fallback = 'menu-category') {
  return String(value ?? fallback)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallback;
}

export function extractCollection(payload) {
  const value = payload?.data ?? payload;
  return Array.isArray(value) ? value : [];
}

export function extractSingle(payload) {
  const value = payload?.data ?? payload;

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value && typeof value === 'object' ? value : null;
}

export function mapMenuCategory(category, index = 0) {
  const name =
    category?.name ??
    category?.title ??
    category?.categoryName ??
    `Category ${index + 1}`;
  const id =
    category?.id ??
    category?.categoryId ??
    category?.slug ??
    slugifyLabel(name, `category-${index + 1}`);
  const sortOrder = Number(category?.sortOrder ?? category?.order ?? category?.position);

  return {
    id: String(id),
    name,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : index,
    anchorId: `menu-category-${slugifyLabel(name, `category-${index + 1}`)}`,
  };
}

export function buildCategoryIndex(categories = []) {
  const normalizedCategories = categories
    .map((category, index) => mapMenuCategory(category, index))
    .sort((left, right) => left.sortOrder - right.sortOrder);
  const byId = new Map();
  const byName = new Map();

  normalizedCategories.forEach((category) => {
    byId.set(String(category.id), category);
    byName.set(category.name.trim().toLowerCase(), category);
  });

  return {
    ordered: normalizedCategories,
    byId,
    byName,
  };
}

export function resolveMenuItemId(item, index = 0) {
  const rawId =
    item?.id ??
    item?.itemId ??
    item?.productId ??
    item?.menuItemId ??
    item?.slug ??
    null;

  if (rawId != null && String(rawId).trim() !== '') {
    return String(rawId);
  }

  const fingerprint = [
    item?.name,
    item?.categoryName ?? item?.category?.name,
    item?.price ?? item?.basePrice,
    item?.imageUrl,
  ]
    .filter(Boolean)
    .join('-');

  return `menu-item-${slugifyLabel(fingerprint, `fallback-item-${index + 1}`)}`;
}

export function mapMenuItem(item, index, categoryIndex = null) {
  const resolvedName = String(item?.name ?? `Menu Item ${index + 1}`);
  const resolvedDescription = String(item?.description ?? '').trim();
  const price = Number(item?.basePrice ?? item?.price);
  const rawCategoryId =
    item?.categoryId ??
    item?.category?.id ??
    item?.menuCategoryId ??
    item?.sectionId ??
    null;
  const rawCategoryName =
    item?.category?.name ??
    item?.categoryName ??
    item?.category_title ??
    item?.categoryTitle ??
    item?.menuCategory?.name ??
    item?.section?.name ??
    item?.sectionName ??
    'Menu';
  const matchedCategory =
    (rawCategoryId != null
      ? categoryIndex?.byId?.get(String(rawCategoryId))
      : null) ??
    (rawCategoryName
      ? categoryIndex?.byName?.get(String(rawCategoryName).trim().toLowerCase())
      : null) ??
    null;
  const category = matchedCategory ?? {
    id: String(rawCategoryId ?? slugifyLabel(rawCategoryName)),
    name: rawCategoryName,
    anchorId: `menu-category-${slugifyLabel(rawCategoryName)}`,
  };

  return {
    id: resolveMenuItemId(
      {
        id: item?.id,
        itemId: item?.itemId,
        productId: item?.productId,
        menuItemId: item?.menuItemId,
        slug: item?.slug,
        name: resolvedName,
        categoryName: category.name,
        price: Number.isFinite(price) ? price : 0,
        imageUrl: item?.imageUrl ?? '',
      },
      index
    ),
    name: resolvedName,
    description: resolvedDescription,
    price: Number.isFinite(price) ? price : 0,
    imageUrl: String(item?.imageUrl ?? '').trim(),
    badge: item?.badge ?? (item?.isFeatured ? 'Featured' : ''),
    categoryId: category.id,
    categoryName: category.name,
    category,
  };
}

export function groupMenuItemsByCategory(items, categories = []) {
  const categoryIndex = buildCategoryIndex(categories);
  const groups = categoryIndex.ordered.map((category) => ({
    ...category,
    items: [],
  }));
  const groupById = new Map(groups.map((group) => [String(group.id), group]));
  const groupByName = new Map(groups.map((group) => [group.name.trim().toLowerCase(), group]));

  items.forEach((item, index) => {
    const categoryName = item?.category?.name ?? item?.categoryName ?? 'Menu';
    const categoryId = item?.category?.id ?? item?.categoryId ?? slugifyLabel(categoryName, `group-${index + 1}`);
    const matchedGroup =
      groupById.get(String(categoryId)) ??
      groupByName.get(String(categoryName).trim().toLowerCase()) ??
      null;

    if (matchedGroup) {
      matchedGroup.items.push(item);
      return;
    }

    const createdGroup = {
      id: String(categoryId),
      name: categoryName,
      anchorId: `menu-category-${slugifyLabel(categoryName, `group-${index + 1}`)}`,
      items: [item],
    };

    groups.push(createdGroup);
    groupById.set(createdGroup.id, createdGroup);
    groupByName.set(createdGroup.name.trim().toLowerCase(), createdGroup);
  });

  return groups.filter((group) => group.items.length > 0);
}

export function fillCollection(primaryItems, fallbackItems, targetSize, mapper = (value) => value) {
  const merged = [...primaryItems];
  const seen = new Set(primaryItems.map((item) => item.name));

  for (let index = 0; merged.length < targetSize && index < fallbackItems.length; index += 1) {
    const candidate = mapper(fallbackItems[index], index);
    if (seen.has(candidate.name)) {
      continue;
    }

    merged.push(candidate);
    seen.add(candidate.name);
  }

  return merged.slice(0, targetSize);
}

export function formatPrice(value, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  } catch {
    return `$${Number(value || 0).toFixed(0)}`;
  }
}
