import { Reveal } from '../common/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './GallerySection.css';

export function GallerySection({ gallery, theme }) {
  const entries = Array.isArray(gallery) ? gallery : [];

  return (
    <section className="gallery section-space container">
      <SectionHeading eyebrow={theme?.galleryEyebrow} title={theme?.galleryTitle} />
      <div className="gallery__grid">
        {entries.map((entry, index) => (
          <Reveal as="a" className="gallery__card" delay={index * 80} href={entry.href} key={`${entry.href}-${index}`} rel="noreferrer" target="_blank">
            <img alt={entry.label ?? 'Gallery'} src={entry.imageUrl} />
            <span>{entry.label ?? 'Instagram'}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
