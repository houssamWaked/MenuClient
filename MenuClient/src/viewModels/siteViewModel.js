import {
  DEFAULT_NAVIGATION,
  DEFAULT_SLUG,
  FALLBACK_BLOG,
  FALLBACK_CONTENT,
  TIMELINE_YEARS,
} from '../siteData.js';
import { sortByOrderAndName, toArray } from '../utils/arrayUtils.js';

function estimateReadTime(post) {
  if (post?.readTime) return post.readTime;
  const words =
    (post?.excerpt ? post.excerpt.split(/\s+/).length : 0) +
    toArray(post?.content).join(' ').split(/\s+/).length;
  const minutes = Math.max(3, Math.round(words / 180));
  return `${minutes} Min Read`;
}

export function buildViewModel(siteData) {
  const tenant = siteData?.tenant ?? {
    name: 'Savoria',
    slug: DEFAULT_SLUG,
    currency: 'USD',
  };

  const content = siteData?.siteContent ?? {};
  const theme = { ...FALLBACK_CONTENT.theme, ...(content.theme ?? {}) };
  const hero = { ...FALLBACK_CONTENT.hero, ...(content.hero ?? {}) };
  const about = { ...FALLBACK_CONTENT.about, ...(content.about ?? {}) };
  const story = { ...FALLBACK_CONTENT.story, ...(content.story ?? {}) };
  const contact = { ...FALLBACK_CONTENT.contact, ...(content.contact ?? {}) };
  const footer = { ...FALLBACK_CONTENT.footer, ...(content.footer ?? {}) };

  const locations = sortByOrderAndName(toArray(siteData?.locations));
  const categories = sortByOrderAndName(toArray(siteData?.categories));
  const items = sortByOrderAndName(toArray(siteData?.items));
  const featuredItemsRaw = toArray(siteData?.featuredItems);
  const featuredItems =
    featuredItemsRaw.length > 0 ? sortByOrderAndName(featuredItemsRaw) : items.filter((item) => item.isFeatured);

  const menuSections = categories
    .map((category) => ({
      ...category,
      items: items.filter((item) => item.categoryId === category.id),
    }))
    .filter((section) => section.items.length > 0);

  if (!menuSections.length && items.length) {
    menuSections.push({
      id: 'all-items',
      name: 'Chef Selection',
      description: 'A curated list of available dishes.',
      items,
    });
  }

  const specials = toArray(content.specials).length
    ? toArray(content.specials)
    : featuredItems.slice(0, 6).map((item) => ({
        title: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        price: Number(item.basePrice ?? 0),
      }));

  const team = toArray(content.team);
  const testimonials = toArray(content.testimonials).length
    ? toArray(content.testimonials)
    : toArray(FALLBACK_CONTENT.testimonials);
  const gallery = toArray(content.gallery).length ? toArray(content.gallery) : specials;
  const socialLinks = toArray(content.socialLinks);

  const blogPostsRaw = toArray(content.blogPosts).length ? toArray(content.blogPosts) : FALLBACK_BLOG;
  const blogPosts = blogPostsRaw.map((post, index) => ({
    ...post,
    date: post.date || post.publishedAt || FALLBACK_BLOG[index % FALLBACK_BLOG.length].date,
    readTime: estimateReadTime(post),
  }));

  const timelineSource = toArray(about.process).length ? toArray(about.process) : FALLBACK_CONTENT.about.process;
  const timelineImages = [
    about.primaryImage,
    about.secondaryImage,
    ...gallery.map((entry) => entry.imageUrl),
  ].filter(Boolean);
  const timeline = timelineSource.slice(0, 4).map((entry, index) => ({
    year: entry.year || TIMELINE_YEARS[index] || `${1990 + index * 10}`,
    title: entry.title,
    description: entry.description,
    imageUrl: entry.imageUrl || timelineImages[index % Math.max(timelineImages.length, 1)],
  }));

  return {
    tenant,
    theme: {
      ...theme,
      navigation: toArray(theme.navigation).length ? toArray(theme.navigation) : DEFAULT_NAVIGATION,
    },
    hero,
    about,
    story,
    contact,
    footer,
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
    timeline,
  };
}
