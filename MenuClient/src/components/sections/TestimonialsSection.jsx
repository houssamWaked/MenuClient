import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M12 2.7L14.9 8.6L21.4 9.5L16.7 14.1L17.8 20.6L12 17.6L6.2 20.6L7.3 14.1L2.6 9.5L9.1 8.6L12 2.7Z" />
    </svg>
  );
}

export function TestimonialsSection({ title, description, testimonials }) {
  const items = testimonials.slice(0, 2).map((entry, index) => ({
    ...entry,
    avatarUrl: getSafeImageUrl(entry?.avatarUrl, FALLBACK_IMAGES.avatar),
    imageUrl: getSafeImageUrl(entry?.imageUrl, index === 0 ? FALLBACK_IMAGES.dish : FALLBACK_IMAGES.ambiance),
    rating: Number(entry?.rating || 0),
  }));
  if (!items.length) return null;

  return (
    <section className="content-shell section testimonials-showcase">
      <div className="testimonials-showcase-header">
        <div className="testimonials-showcase-title">
          <span className="testimonials-showcase-line" />
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="testimonials-grid">
        {items.map((entry) => (
          <article key={entry.id || entry.name} className="testimonial-card">
            <header className="testimonial-author">
              <img src={entry.avatarUrl} alt={entry.name} loading="lazy" />
              <div>
                <h3>{entry.name}</h3>
                <p>{entry.role}</p>
              </div>
            </header>

            <div className="testimonial-image-wrap">
              <img src={entry.imageUrl} alt={entry.title} loading="lazy" />
            </div>

            <div className="testimonial-stars" aria-label={`${entry.rating} star rating`}>
              {Array.from({ length: entry.rating }).map((_, index) => (
                <span key={`${entry.id || entry.name}-star-${index}`}>
                  <StarIcon />
                </span>
              ))}
            </div>

            <h4>{entry.title}</h4>
          </article>
        ))}
      </div>
    </section>
  );
}
