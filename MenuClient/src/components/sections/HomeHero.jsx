import {
  FALLBACK_IMAGES,
  FALLBACK_PLATE_IMAGES,
  getBackgroundImageStyle,
  getSafeImageList,
  getSafeImageUrl,
} from '../../utils/imageUtils.js';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M7 17L17 7" />
      <path d="M10 7H17V14" />
    </svg>
  );
}

export function HomeHero({ currentSlide, hero, description, onBook, onExploreMenu }) {
  const plateImages = getSafeImageList(hero?.plateImages, FALLBACK_PLATE_IMAGES);

  return (
    <section className="home-hero">
      <div className="home-hero-left">
        <div className="hero-plates" aria-hidden="true">
          {plateImages.slice(0, 3).map((imageUrl, index) => (
            <img
              key={imageUrl + index}
              src={getSafeImageUrl(imageUrl, FALLBACK_PLATE_IMAGES[index] || FALLBACK_IMAGES.dish)}
              alt=""
              loading="lazy"
              className={`plate-image plate-${index + 1}`}
            />
          ))}
        </div>
        <div className="home-hero-content">
          <h1>
            {hero.titleTop}
            <br />
            {hero.titleMiddle} {hero.accent}
          </h1>
          <p>{description}</p>
          <div className="hero-actions">
            <button type="button" className="hero-btn hero-btn-primary" onClick={onBook}>
              <span>Book A Table</span>
              <span className="hero-btn-icon" aria-hidden="true">
                <ArrowIcon />
              </span>
            </button>
            <button type="button" className="hero-btn hero-btn-secondary" onClick={onExploreMenu}>
              <span>Explore Menu</span>
              <span className="hero-btn-icon" aria-hidden="true">
                <ArrowIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="home-hero-right" style={getBackgroundImageStyle(currentSlide, FALLBACK_IMAGES.hero)}>
        <div className="home-hero-right-overlay" />
      </div>
    </section>
  );
}
