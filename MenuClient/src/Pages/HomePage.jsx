import { useSiteData } from '../context/site-data-context.js';
import { buildCategoryIndex, mapMenuItem } from '../utils/landing.js';
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
  const siteData = useSiteData();
  const categoryIndex = buildCategoryIndex(siteData.categories);

  const liveItems = siteData.items.map((item, index) => mapMenuItem(item, index, categoryIndex));
  const liveFeatured = (
    siteData.featuredItems.length > 0
      ? siteData.featuredItems
      : siteData.items.filter((item) => item?.isFeatured)
  ).map((item, index) => mapMenuItem(item, index, categoryIndex));

  const menuItems = (liveItems.length > 0 ? liveItems : liveFeatured).slice(0, 6);
  const promoItems =
    siteData.specials.length > 0
      ? siteData.specials.slice(0, 5)
      : liveFeatured
        .map((item) => ({
          id: item.id,
          name: item.name,
          title: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
        }))
        .slice(0, 5);
  const tenantCurrency = siteData.tenant?.currency ?? 'USD';

  return (
    <div className="site-shell">
      <HeroSection />

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
