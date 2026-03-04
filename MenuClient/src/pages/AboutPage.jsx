import { AboutDetailsSection } from '../components/home/AboutDetailsSection.jsx';
import { PageHero } from '../components/layout/PageHero.jsx';
import { useSiteDataContext } from '../context/SiteDataContext.jsx';

export function AboutPage() {
  const { data } = useSiteDataContext();
  const theme = data?.siteContent?.theme ?? {};
  const about = data?.siteContent?.about ?? {};
  const team = data?.siteContent?.team ?? [];

  return (
    <>
      <PageHero imageUrl={theme.pageBanners?.about} title={theme.pageTitles?.about ?? 'About'} />
      <AboutDetailsSection about={about} team={team} />
    </>
  );
}
