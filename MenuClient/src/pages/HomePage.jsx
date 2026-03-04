import { AboutPreviewSection } from '../components/home/AboutPreviewSection.jsx';
import { BlogPreviewSection } from '../components/home/BlogPreviewSection.jsx';
import { GallerySection } from '../components/home/GallerySection.jsx';
import { HeroSlider } from '../components/home/HeroSlider.jsx';
import { HomeMenuSection } from '../components/home/HomeMenuSection.jsx';
import { SpecialsCarousel } from '../components/home/SpecialsCarousel.jsx';
import { StorySection } from '../components/home/StorySection.jsx';
import { TestimonialsSection } from '../components/home/TestimonialsSection.jsx';
import { useSiteDataContext } from '../context/SiteDataContext.jsx';

export function HomePage() {
  const { data } = useSiteDataContext();
  const siteContent = data?.siteContent ?? {};
  const currency = data?.tenant?.currency ?? 'USD';

  return (
    <>
      <HeroSlider hero={siteContent.hero} />
      <HomeMenuSection
        categories={data?.categories}
        currency={currency}
        featuredItems={data?.featuredItems}
        items={data?.items}
        menuTheme={siteContent.theme}
      />
      <AboutPreviewSection about={siteContent.about} />
      <StorySection story={siteContent.story} />
      <SpecialsCarousel currency={currency} specials={siteContent.specials} theme={siteContent.theme} />
      <GallerySection gallery={siteContent.gallery} theme={siteContent.theme} />
      <TestimonialsSection testimonials={siteContent.testimonials} theme={siteContent.theme} />
      <BlogPreviewSection posts={siteContent.blogPosts} theme={siteContent.theme} />
    </>
  );
}
