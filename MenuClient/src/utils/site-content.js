function slugifyLabel(value, fallback = 'entry') {
  return String(value ?? fallback)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallback;
}

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function asTextArray(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry ?? '').trim()).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
}

export function normalizeNavigation(links = []) {
  return asArray(links)
    .filter((link) => link && typeof link === 'object' && link.href && link.label)
    .map((link) => ({
      label: String(link.label),
      href: String(link.href),
      matchPaths: asArray(link.matchPaths).map((path) => String(path)),
      hasCaret: Boolean(link.hasCaret),
    }));
}

export function normalizeLocations(locations = []) {
  return asArray(locations)
    .filter((location) => location && typeof location === 'object')
    .map((location, index) => {
      const addressLineOne = String(location.addressLineOne ?? location.address ?? '').trim();
      const addressLineTwo = String(
        location.addressLineTwo ??
          [location.city, location.region, location.postalCode].filter(Boolean).join(', ')
      ).trim();

      return {
        ...location,
        id: String(location.id ?? slugifyLabel(location.name ?? location.city, `location-${index + 1}`)),
        heading: String(location.name ?? location.city ?? `Location ${index + 1}`),
        addressLineOne,
        addressLineTwo,
        phone: String(location.phone ?? '').trim(),
        email: String(location.email ?? '').trim(),
      };
    });
}

export function getPrimaryLocation(locations = []) {
  const normalizedLocations = normalizeLocations(locations);
  return normalizedLocations.find((location) => location.isPrimary) ?? normalizedLocations[0] ?? null;
}

export function normalizeSpecials(items = []) {
  return asArray(items)
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => ({
      ...item,
      id: String(item.id ?? slugifyLabel(item.title ?? item.name, `special-${index + 1}`)),
      name: String(item.name ?? item.title ?? `Special ${index + 1}`),
      title: String(item.title ?? item.name ?? `Special ${index + 1}`),
      description: String(item.description ?? '').trim(),
      price: Number(item.price ?? item.basePrice) || 0,
      imageUrl: String(item.imageUrl ?? '').trim(),
    }))
    .filter((item) => item.title && item.imageUrl);
}

export function normalizeTestimonials(items = []) {
  return asArray(items)
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => ({
      id: String(item.id ?? slugifyLabel(item.name, `testimonial-${index + 1}`)),
      name: String(item.name ?? `Guest ${index + 1}`),
      quote: String(item.quote ?? item.description ?? '').trim(),
    }))
    .filter((item) => item.quote);
}

export function normalizeGallery(items = []) {
  return asArray(items)
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => ({
      id: String(item.id ?? slugifyLabel(item.href ?? item.imageUrl, `gallery-${index + 1}`)),
      imageUrl: String(item.imageUrl ?? '').trim(),
      href: String(item.href ?? '').trim(),
      label: String(item.label ?? item.platform ?? 'Instagram'),
    }))
    .filter((item) => item.imageUrl && item.href);
}

export function normalizeBlogPosts(posts = []) {
  return asArray(posts)
    .filter((post) => post && typeof post === 'object')
    .map((post, index) => {
      const id = String(post.id ?? slugifyLabel(post.title, `post-${index + 1}`));

      return {
        ...post,
        id,
        category: String(post.category ?? 'Stories'),
        title: String(post.title ?? `Post ${index + 1}`),
        excerpt: String(post.excerpt ?? '').trim(),
        imageUrl: String(post.imageUrl ?? '').trim(),
        href: String(post.href ?? `/blog/${id}`),
        content: asTextArray(post.content),
      };
    })
    .filter((post) => post.title);
}

export function normalizeTeam(items = []) {
  return asArray(items)
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => ({
      id: String(item.id ?? slugifyLabel(item.name, `team-${index + 1}`)),
      name: String(item.name ?? `Team Member ${index + 1}`),
      role: String(item.role ?? ''),
      bio: String(item.bio ?? item.description ?? '').trim(),
      imageUrl: String(item.imageUrl ?? '').trim(),
    }))
    .filter((item) => item.name);
}

export function normalizeSocialLinks(items = []) {
  return asArray(items)
    .filter((item) => item && typeof item === 'object' && item.href)
    .map((item, index) => ({
      id: String(item.id ?? slugifyLabel(item.platform ?? item.label, `social-${index + 1}`)),
      platform: String(item.platform ?? item.label ?? '').trim().toLowerCase(),
      label: String(item.label ?? item.platform ?? `Social ${index + 1}`),
      href: String(item.href),
    }));
}
