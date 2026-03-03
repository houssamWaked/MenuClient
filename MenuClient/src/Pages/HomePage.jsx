import { fallbackMenuItems, featureCards } from '../constants/string.js';
import { useLandingData } from '../hooks/useLandingData.js';
import { buildCategoryIndex, fillCollection, mapMenuItem } from '../utils/landing.js';
import { HeroSection } from '../Components/sections/HeroSection.jsx';
import { MenuSection } from '../Components/sections/MenuSection.jsx';
import { SpecialsSection } from '../Components/sections/SpecialsSection.jsx';
import { AboutSection } from '../Components/sections/AboutSection.jsx';
import { StorySection } from '../Components/sections/StorySection.jsx';
import { TestimonialsSection } from '../Components/sections/TestimonialsSection.jsx';
import { GallerySection } from '../Components/sections/GallerySection.jsx';
import { SiteFooter } from '../Components/layout/SiteFooter.jsx';
import './HomePage.css';

export function HomePage() {
  const pageData = useLandingData();
  const categoryIndex = buildCategoryIndex(pageData.categories);

  const liveItems = pageData.items.map((item, index) => mapMenuItem(item, index, categoryIndex));
  const liveFeatured = (
    pageData.featuredItems.length > 0
      ? pageData.featuredItems
      : pageData.items.filter((item) => item?.isFeatured)
  ).map((item, index) => mapMenuItem(item, index, categoryIndex));

  const menuItems = fillCollection(
    liveItems.length > 0 ? liveItems : liveFeatured,
    fallbackMenuItems,
    6,
    (item, index) => mapMenuItem(item, liveItems.length + liveFeatured.length + index, categoryIndex)
  );

  const promoItems = fillCollection(
    liveFeatured.map((item) => ({
      name: item.name,
      title: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
    })),
    featureCards,
    5,
    (item) => ({
      ...item,
      name: item.title,
    })
  );

  const tenantName = pageData.tenant?.name ?? 'Burger Bachelor';
  const tenantSlug = pageData.tenant?.slug ?? null;
  const tenantCurrency = pageData.tenant?.currency ?? 'USD';

  return (
    <div className="site-shell">
      <HeroSection
        tenantName={tenantName}
        tenantSlug={tenantSlug}
        loading={pageData.loading}
        error={pageData.error}
      />

      <main>
        <MenuSection items={menuItems} currency={tenantCurrency} showMoreButton />
        <SpecialsSection items={promoItems} currency={tenantCurrency} />

        <AboutSection />
        <StorySection />
        <TestimonialsSection />
        <GallerySection />
      </main>

      <SiteFooter />
    </div>
  );
}
