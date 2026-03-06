import { SectionHeading } from '../common/SectionHeading.jsx';
import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

export function TimelineSection({ detailTitle, timeline }) {
  return (
    <section className="content-shell section">
      <SectionHeading
        eyebrow="Our Story"
        title={detailTitle}
        sideText="Devoted to perfection: meet the hands and hearts behind extraordinary experiences."
      />
      <div className="timeline-grid">
        {timeline.map((entry) => (
          <article key={entry.year + entry.title} className="timeline-card">
            <img
              src={getSafeImageUrl(entry?.imageUrl, FALLBACK_IMAGES.ambiance)}
              alt={entry.title}
              loading="lazy"
            />
            <div className="timeline-copy">
              <span className="timeline-year">{entry.year}</span>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
//s
