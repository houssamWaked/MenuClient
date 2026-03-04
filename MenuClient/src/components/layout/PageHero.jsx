import './PageHero.css';

export function PageHero({ imageUrl, title }) {
  return (
    <section className="page-hero" style={imageUrl ? { '--hero-image': `url(${imageUrl})` } : undefined}>
      <div className="page-hero__overlay" />
      <div className="page-hero__inner container">
        <h1>{title}</h1>
      </div>
    </section>
  );
}
