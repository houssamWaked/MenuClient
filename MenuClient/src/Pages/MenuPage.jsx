import { SiteHeader } from '../Components/layout/SiteHeader.jsx';
import { MenuSection } from '../Components/sections/MenuSection.jsx';
import { SiteFooter } from '../Components/layout/SiteFooter.jsx';
import { fallbackMenuItems, mediaLibrary, siteCopy } from '../constants/string.js';
import { useLandingData } from '../hooks/useLandingData.js';
import { buildCategoryIndex, fillCollection, mapMenuItem } from '../utils/landing.js';
import './MenuPage.css';

export function MenuPage() {
  const pageData = useLandingData();
  const categoryIndex = buildCategoryIndex(pageData.categories);
  const liveItems = pageData.items.map((item, index) => mapMenuItem(item, index, categoryIndex));
  const tenantName = pageData.tenant?.name ?? 'Burger Bachelor';
  const tenantCurrency = pageData.tenant?.currency ?? 'USD';

  const fullMenuItems = fillCollection(
    liveItems,
    fallbackMenuItems,
    12,
    (item, index) => mapMenuItem(item, liveItems.length + index, categoryIndex)
  );

  return (
    <div className="site-shell menu-page-shell">
      <header
        className="menu-page-hero"
        style={{ '--menu-banner-image': `url(${mediaLibrary.menuBanner})` }}
      >
        <div className="menu-page-hero__overlay" />
        <div className="container menu-page-hero__container">
          <SiteHeader tenantName={tenantName} />
          <div className="menu-page-hero__body" data-reveal="up">
            <h1>{siteCopy.menuPageHeroTitle}</h1>
          </div>
        </div>
      </header>

      <main>
        <MenuSection
          items={fullMenuItems}
          currency={tenantCurrency}
          categories={pageData.categories}
          groupByCategory
        />
      </main>

      <SiteFooter />
    </div>
  );
}
