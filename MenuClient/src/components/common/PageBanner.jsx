import { FALLBACK_IMAGES, getBackgroundImageStyle } from '../../utils/imageUtils.js';

export function PageBanner({ title, description, imageUrl }) {
  return (
    <section className="page-banner" style={getBackgroundImageStyle(imageUrl, FALLBACK_IMAGES.banner)}>
      <div className="page-banner-overlay" />
      <div className="content-shell page-banner-content">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
    </section>
  );
}
