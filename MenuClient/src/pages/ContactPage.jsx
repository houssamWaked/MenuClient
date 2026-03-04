import { ContactSection } from '../components/home/ContactSection.jsx';
import { PageHero } from '../components/layout/PageHero.jsx';
import { useSiteDataContext } from '../context/SiteDataContext.jsx';

export function ContactPage() {
  const { data } = useSiteDataContext();
  const theme = data?.siteContent?.theme ?? {};
  const contact = data?.siteContent?.contact ?? {};

  return (
    <>
      <PageHero imageUrl={theme.pageBanners?.contact} title={theme.pageTitles?.contact ?? 'Contact'} />
      <ContactSection contact={contact} />
    </>
  );
}
