import { galleryImages, siteCopy } from '../../constants/string.js';
import { GalleryCard } from '../cards/GalleryCard.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './GallerySection.css';

export function GallerySection() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <SectionHeading
          eyebrow={siteCopy.galleryEyebrow}
          title={siteCopy.galleryTitle}
        />
        <div className="gallery-grid" data-stagger>
          {galleryImages.map((image, index) => (
            <GalleryCard key={image.imageUrl} image={image} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
