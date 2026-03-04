import { SiteHeader } from '../Components/layout/SiteHeader.jsx';
import { MenuSection } from '../Components/sections/MenuSection.jsx';
import { SiteFooter } from '../Components/layout/SiteFooter.jsx';
import { useSiteData } from '../context/site-data-context.js';
import { buildCategoryIndex, mapMenuItem } from '../utils/landing.js';
import './MenuPage.css';

export function MenuPage() {
  const siteData = useSiteData();
  const categoryIndex = buildCategoryIndex(siteData.categories);
  const fullMenuItems = siteData.items.map((item, index) => mapMenuItem(item, index, categoryIndex));
  const tenantCurrency = siteData.tenant?.currency ?? 'USD';
  const theme = siteData.siteContent?.theme ?? {};
  const menuBanner = theme.pageBanners?.menu ?? '';
  const menuTitle = theme.pageTitles?.menu ?? 'MENU';

  return (
    <div className="site-shell menu-page-shell">
      <header
        className="menu-page-hero"
        style={{ '--menu-banner-image': `url(${menuBanner})` }}
      >
        <div className="menu-page-hero__overlay" />
        <div className="container menu-page-hero__container">
          <SiteHeader />
          <div className="menu-page-hero__body" data-reveal="up">
            <h1>{menuTitle}</h1>
          </div>
        </div>
      </header>

      <main>
        <MenuSection
          items={fullMenuItems}
          currency={tenantCurrency}
          categories={siteData.categories}
          groupByCategory
        />
      </main>

      <SiteFooter />
    </div>
  );
}
