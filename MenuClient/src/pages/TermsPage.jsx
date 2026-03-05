import { PageBanner } from '../components/common/PageBanner.jsx';
import { LegalPolicySection } from '../components/sections/LegalPolicySection.jsx';

export function TermsPage({ bannerImage, pageTitle, bannerDescription, legal }) {
  return (
    <>
      <PageBanner
        title={pageTitle}
        description={bannerDescription}
        imageUrl={bannerImage}
      />
      <LegalPolicySection
        eyebrow={legal?.eyebrow}
        intro={legal?.intro}
        sections={legal?.sections}
      />
    </>
  );
}
