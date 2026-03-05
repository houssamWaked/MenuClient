import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M7 17L17 7" />
      <path d="M10 7H17V14" />
    </svg>
  );
}

export function AboutShowcaseSection({ about, description, onExplore }) {
  const valueCards = Array.isArray(about?.values) ? about.values.slice(0, 4) : [];
  const detailText = Array.isArray(about?.detailParagraphs) ? about.detailParagraphs[0] : '';

  return (
    <section className="content-shell section about-showcase">
      <div className="about-showcase-header">
        <div className="about-showcase-title">
          <span className="about-showcase-line" />
          <h2>{about?.sectionTitle}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="about-showcase-panel">
        <div className="about-showcase-main">
          <div className="about-showcase-image-wrap">
            <img
              src={getSafeImageUrl(about?.primaryImage, FALLBACK_IMAGES.ambiance)}
              alt={about?.title || about?.sectionTitle || ''}
              loading="lazy"
            />
          </div>
          <article className="about-showcase-content">
            <span className="about-showcase-badge">{about?.badge}</span>
            <h3>{about?.detailTitle}</h3>
            <p>{detailText}</p>
            <button type="button" className="about-showcase-btn" onClick={onExplore}>
              <span>{about?.ctaLabel}</span>
              <span className="about-showcase-btn-icon" aria-hidden="true">
                <ArrowIcon />
              </span>
            </button>
          </article>
        </div>

        <div className="about-showcase-values">
          {valueCards.map((entry, index) => (
            <article key={entry.title || index} className="about-showcase-value-card">
              <h4>{entry.title}</h4>
              <p>{entry.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
