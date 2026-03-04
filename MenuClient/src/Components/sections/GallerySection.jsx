import { useSiteData } from '../../context/site-data-context.js';
import { GalleryCard } from '../cards/GalleryCard.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './GallerySection.css';

export function GallerySection() {
  const { gallery, siteContent } = useSiteData();
  const theme = siteContent?.theme ?? {};

  if (gallery.length === 0) {
    return null;
  }

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <SectionHeading
          eyebrow={theme.galleryEyebrow ?? ''}
          title={theme.galleryTitle ?? ''}
        />
        <div className="gallery-grid" data-stagger>
          {gallery.map((image, index) => (
            <GalleryCard key={image.imageUrl} image={image} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
