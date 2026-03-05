import { FALLBACK_IMAGES, getBackgroundImageStyle } from '../../utils/imageUtils.js';

export function MenuPageHero({ imageUrl, title, subtitle }) {
  return (
    <section className="menu-page-hero" style={getBackgroundImageStyle(imageUrl, FALLBACK_IMAGES.banner)}>
      <div className="menu-page-hero-overlay" />
      <div className="content-shell menu-page-hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
