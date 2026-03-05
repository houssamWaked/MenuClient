import { PageBanner } from '../components/common/PageBanner.jsx';
import { LegalPolicySection } from '../components/sections/LegalPolicySection.jsx';
import { PRIVACY_CONTENT } from '../legalContent.js';

export function PrivacyPage({ bannerImage, pageTitle, bannerDescription }) {
  return (
    <>
      <PageBanner
        title={pageTitle}
        description={bannerDescription}
        imageUrl={bannerImage}
      />
      <LegalPolicySection
        eyebrow={PRIVACY_CONTENT.eyebrow}
        intro={PRIVACY_CONTENT.intro}
        sections={PRIVACY_CONTENT.sections}
      />
    </>
  );
}
