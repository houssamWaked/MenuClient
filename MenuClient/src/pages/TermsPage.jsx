import { PageBanner } from '../components/common/PageBanner.jsx';
import { LegalPolicySection } from '../components/sections/LegalPolicySection.jsx';
import { TERMS_CONTENT } from '../legalContent.js';

export function TermsPage({ bannerImage, pageTitle, bannerDescription }) {
  return (
    <>
      <PageBanner
        title={pageTitle}
        description={bannerDescription}
        imageUrl={bannerImage}
      />
      <LegalPolicySection
        eyebrow={TERMS_CONTENT.eyebrow}
        intro={TERMS_CONTENT.intro}
        sections={TERMS_CONTENT.sections}
      />
    </>
  );
}
