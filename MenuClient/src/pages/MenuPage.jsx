import { PageHero } from '../components/layout/PageHero.jsx';
import { MenuCatalog } from '../components/menu/MenuCatalog.jsx';
import { useSiteDataContext } from '../context/SiteDataContext.jsx';

export function MenuPage() {
  const { data } = useSiteDataContext();
  const theme = data?.siteContent?.theme ?? {};
  const currency = data?.tenant?.currency ?? 'USD';

  return (
    <>
      <PageHero imageUrl={theme.pageBanners?.menu} title={theme.pageTitles?.menu ?? 'Menu'} />
      <MenuCatalog categories={data?.categories} currency={currency} items={data?.items} theme={theme} />
    </>
  );
}
