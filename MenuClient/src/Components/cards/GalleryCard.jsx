import './GalleryCard.css';

export function GalleryCard({ image, index }) {
  return (
    <a
      className="gallery-card"
      href={image.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open Instagram gallery item ${index + 1}`}
      data-reveal="zoom"
    >
      <img src={image.imageUrl} alt={`Burger gallery ${index + 1}`} loading="lazy" />
      <span className="gallery-card__badge">{image.label ?? 'Instagram'}</span>
    </a>
  );
}
