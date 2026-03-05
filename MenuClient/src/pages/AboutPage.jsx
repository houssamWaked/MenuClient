import { AboutHighlightsSection } from '../components/sections/AboutHighlightsSection.jsx';
import { PageBanner } from '../components/common/PageBanner.jsx';
import { AboutTimelineSection } from '../components/sections/AboutTimelineSection.jsx';
import { ReservationSection } from '../components/sections/ReservationSection.jsx';
import { TeamShowcaseSection } from '../components/sections/TeamShowcaseSection.jsx';

export function AboutPage({
  bannerImage,
  pageTitle,
  bannerDescription,
  view,
  reservationProps,
}) {
  return (
    <>
      <PageBanner
        title={pageTitle}
        description={bannerDescription}
        imageUrl={bannerImage}
      />

      <AboutTimelineSection timeline={view.timeline} about={view.about} />
      <AboutHighlightsSection about={view.about} />
      <TeamShowcaseSection team={view.team} />
      <ReservationSection {...reservationProps} />
    </>
  );
}
