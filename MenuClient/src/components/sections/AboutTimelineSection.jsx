import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

function normalizeEntries(timeline, about) {
  const entries = Array.isArray(timeline) ? timeline : [];
  if (entries.length) return entries;

  const process = Array.isArray(about?.process) ? about.process : [];
  if (!process.length) return [];

  return process.map((entry, index) => ({
    id: entry.id || `${entry.title}-${index}`,
    title: entry.title,
    description: entry.description,
    year: entry.year || '',
    imageUrl: entry.imageUrl || about?.primaryImage || '',
  }));
}

export function AboutTimelineSection({ timeline, about }) {
  const entries = normalizeEntries(timeline, about);
  if (!entries.length) return null;

  return (
    <section className="content-shell section about-timeline">
      <div className="about-timeline-list">
        {entries.map((entry, index) => (
          <article className="about-timeline-row" key={entry.id || `${entry.title}-${index}`}>
            <div className="about-timeline-media">
              <img
                src={getSafeImageUrl(entry.imageUrl, FALLBACK_IMAGES.ambiance)}
                alt={entry.title}
                loading="lazy"
              />
            </div>

            <div className="about-timeline-divider" aria-hidden="true">
              <span className="about-timeline-dot" />
            </div>

            <div className="about-timeline-copy">
              <span className="about-timeline-kicker">{entry.title}</span>
              <h3>{entry.year}</h3>
              <p>{entry.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
