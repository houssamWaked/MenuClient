import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M7 17L17 7" />
      <path d="M10 7H17V14" />
    </svg>
  );
}

export function HomeMenuSection({
  sections,
  description,
  imageUrl,
  onExploreMenu,
}) {
  return (
    <section className="content-shell section menu-showcase">
      <div className="menu-showcase-header">
        <div className="menu-showcase-title">
          <span className="menu-showcase-line" />
          <h2>Our Menu</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="menu-showcase-body">
        <div className="menu-showcase-list">
          {sections.map((entry) => (
            <article
              key={entry.id || entry.name}
              className="menu-showcase-item"
            >
              <div>
                <h3>{entry.name}</h3>
                <p>
                  {entry.description ||
                    'Discover a curated journey crafted with precision and timeless flavor.'}
                </p>
              </div>
              <span
                className="menu-showcase-item-icon"
                aria-hidden="true"
              >
                <ArrowIcon />
              </span>
            </article>
          ))}

          <button
            type="button"
            className="menu-showcase-btn"
            onClick={onExploreMenu}
          >
            <span>Explore Menu</span>
            <span className="menu-showcase-btn-icon" aria-hidden="true">
              <ArrowIcon />
            </span>
          </button>
        </div>

        <div className="menu-showcase-image-wrap">
          <img
            src={getSafeImageUrl(imageUrl, FALLBACK_IMAGES.dish)}
            alt="Signature menu presentation"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
