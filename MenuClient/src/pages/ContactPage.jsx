import { PageBanner } from '../components/common/PageBanner.jsx';
import { ContactSection } from '../components/sections/ContactSection.jsx';

export function ContactPage({
  bannerImage,
  pageTitle,
  bannerDescription,

  contactProps,
}) {
  return (
    <>
      <PageBanner
        title={pageTitle}
        description={bannerDescription}
        imageUrl={bannerImage}
      />

      <ContactSection {...contactProps} />
    </>
  );
}
