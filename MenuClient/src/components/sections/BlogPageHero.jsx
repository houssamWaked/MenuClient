import { FALLBACK_IMAGES, getBackgroundImageStyle } from '../../utils/imageUtils.js';

export function BlogPageHero({ imageUrl, title, subtitle }) {
  return (
    <section className="blog-page-hero" style={getBackgroundImageStyle(imageUrl, FALLBACK_IMAGES.banner)}>
      <div className="blog-page-hero-overlay" />
      <div className="content-shell blog-page-hero-content">
        <div className="blog-page-hero-title-wrap">
          <h1>{title}</h1>
        </div>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
