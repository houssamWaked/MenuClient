import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

export function TeamShowcaseSection({ title, description, team }) {
  const entries = Array.isArray(team) ? team : [];
  if (!entries.length) return null;

  return (
    <section className="content-shell section team-showcase">
      <div className="team-showcase-header">
        <div className="team-showcase-title">
          <span className="team-showcase-line" />
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="team-showcase-grid">
        {entries.map((entry, index) => (
          <article className="team-card" key={entry.id || `${entry.name}-${index}`}>
            <div className="team-card-image-wrap">
              <img
                src={getSafeImageUrl(entry.imageUrl, FALLBACK_IMAGES.portrait)}
                alt={entry.name}
                loading="lazy"
              />
            </div>
            <h3>{entry.name}</h3>
            <p>{entry.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
