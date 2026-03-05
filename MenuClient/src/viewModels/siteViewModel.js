import { DEFAULT_SLUG } from '../siteData.js';
import { sortByOrderAndName, toArray } from '../utils/arrayUtils.js';

function estimateReadTime(post) {
  if (post?.readTime) return post.readTime;
  const excerptWords = typeof post?.excerpt === 'string' ? post.excerpt.split(/\s+/).length : 0;
  const contentWords = toArray(post?.content)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(3, Math.round((excerptWords + contentWords) / 180));
  return `${minutes} Min Read`;
}

function buildTimeline(about, gallery) {
  const processEntries = toArray(about?.process);
  const timelineImages = [
    about?.primaryImage,
    about?.secondaryImage,
    ...gallery.map((entry) => entry?.imageUrl),
  ].filter(Boolean);

  return processEntries.map((entry, index) => ({
    id: entry.id || `${entry.title || 'timeline'}-${index}`,
    year: entry.year || '',
    title: entry.title || '',
    description: entry.description || '',
    imageUrl: entry.imageUrl || timelineImages[index] || timelineImages[0] || '',
  }));
}

export function buildViewModel(siteData) {
  const tenant = siteData?.tenant ?? {
    name: '',
    slug: DEFAULT_SLUG,
    currency: 'USD',
  };

  const content = siteData?.siteContent ?? {};
  const theme = content.theme ?? {};
  const hero = content.hero ?? {};
  const about = content.about ?? {};
  const story = content.story ?? {};
  const contact = content.contact ?? {};
  const reservation = content.reservation ?? {};
  const footer = content.footer ?? {};
  const legal = content.legal ?? {};

  const locations = sortByOrderAndName(toArray(siteData?.locations));
  const categories = sortByOrderAndName(toArray(siteData?.categories));
  const items = sortByOrderAndName(toArray(siteData?.items));
  const featuredItemsRaw = toArray(siteData?.featuredItems);
  const featuredItems =
    featuredItemsRaw.length > 0 ? sortByOrderAndName(featuredItemsRaw) : items.filter((item) => item.isFeatured);

  const menuSections = categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.categoryId === category.id),
  }));

  const specials = toArray(content.specials).length
    ? toArray(content.specials)
    : featuredItems.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        price: Number(item.basePrice ?? 0),
      }));

  const team = toArray(content.team);
  const testimonials = toArray(content.testimonials);
  const gallery = toArray(content.gallery);
  const socialLinks = toArray(content.socialLinks);

  const blogPosts = toArray(content.blogPosts).map((post) => ({
    ...post,
    date: post.date || post.publishedAt || '',
    readTime: estimateReadTime(post),
  }));

  return {
    tenant,
    theme: {
      ...theme,
      navigation: toArray(theme.navigation),
      pageTitles: theme.pageTitles ?? {},
      pageDescriptions: theme.pageDescriptions ?? {},
      pageBanners: theme.pageBanners ?? {},
    },
    hero,
    about,
    story,
    contact,
    reservation,
    footer: {
      ...footer,
      quickLinks: toArray(footer.quickLinks),
      utilityLinks: toArray(footer.utilityLinks),
    },
    legal: {
      terms: legal.terms ?? {},
      privacy: legal.privacy ?? {},
    },
    locations,
    items,
    featuredItems,
    menuSections,
    specials,
    team,
    testimonials,
    gallery,
    blogPosts,
    socialLinks,
    timeline: buildTimeline(about, gallery),
  };
}
