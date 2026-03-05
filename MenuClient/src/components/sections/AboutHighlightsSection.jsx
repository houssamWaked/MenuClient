import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

export function AboutHighlightsSection({ about }) {
  const cards = Array.isArray(about?.values) ? about.values : [];
  if (!cards.length) return null;

  return (
    <section className="content-shell section about-highlights">
      <div className="about-highlights-image-wrap">
        <img
          src={getSafeImageUrl(about?.secondaryImage || about?.primaryImage, FALLBACK_IMAGES.ambiance)}
          alt={about?.highlightsTitle || about?.sectionTitle || ''}
          loading="lazy"
        />
      </div>

      <div className="about-highlights-heading">
        <span className="about-highlights-line" />
        <h2>{about?.highlightsTitle}</h2>
        <span className="about-highlights-line" />
      </div>

      <div className="about-highlights-cards">
        {cards.map((card, index) => (
          <article key={`${card.title}-${index}`} className="about-highlights-card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
