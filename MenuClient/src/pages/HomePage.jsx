import { AboutShowcaseSection } from '../components/sections/AboutShowcaseSection.jsx';
import { AmbianceSection } from '../components/sections/AmbianceSection.jsx';
import { BlogSection } from '../components/sections/BlogSection.jsx';
import { HomeHero } from '../components/sections/HomeHero.jsx';
import { HomeMenuSection } from '../components/sections/HomeMenuSection.jsx';
import { ReservationSection } from '../components/sections/ReservationSection.jsx';
import { SignatureDishesSection } from '../components/sections/SignatureDishesSection.jsx';
import { TestimonialsSection } from '../components/sections/TestimonialsSection.jsx';

export function HomePage({
  currentSlide,
  view,
  homeMenuSections,
  homeMenuDescription,
  homeMenuImage,
  signatureDishes,
  signatureDescription,
  ambianceItems,
  ambianceDescription,
  aboutDescription,
  testimonialsTitle,
  testimonialsDescription,
  onNavigate,
  onBook,
  reservationProps,
}) {
  return (
    <>
      <HomeHero
        currentSlide={currentSlide}
        hero={view.hero}
        description={view.story.description}
        onBook={onBook}
        onExploreMenu={() => onNavigate('/menu')}
      />

      <HomeMenuSection
        sections={homeMenuSections}
        description={homeMenuDescription}
        imageUrl={homeMenuImage}
        onExploreMenu={() => onNavigate('/menu')}
      />

      <SignatureDishesSection
        title={view.theme.specialsTitle || 'Signature Dishes'}
        description={signatureDescription}
        items={signatureDishes}
      />

      <AmbianceSection
        title={view.theme.galleryTitle || 'The Ambiance'}
        description={ambianceDescription}
        items={ambianceItems}
      />

      <AboutShowcaseSection
        about={view.about}
        description={aboutDescription}
        onExplore={() => onNavigate('/about')}
      />

      <TestimonialsSection
        title={testimonialsTitle}
        description={testimonialsDescription}
        testimonials={view.testimonials}
      />

      <BlogSection theme={view.theme} posts={view.blogPosts} showAll={false} />
      <ReservationSection {...reservationProps} />
    </>
  );
}
