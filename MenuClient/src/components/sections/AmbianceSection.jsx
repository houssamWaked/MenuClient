import { FALLBACK_AMBIANCE_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

function normalizeSlides(items) {
  const sourceItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!sourceItems.length) return [];
  const valid = sourceItems.map((item, index) => ({
    ...item,
    title: item?.title || '',
    imageUrl: getSafeImageUrl(item?.imageUrl, FALLBACK_AMBIANCE_IMAGES[index % FALLBACK_AMBIANCE_IMAGES.length]),
  }));
  if (valid.length >= 4) return valid;

  const expanded = [];
  while (expanded.length < 4) {
    expanded.push(valid[expanded.length % valid.length]);
  }
  return expanded;
}

export function AmbianceSection({ title, description, items }) {
  const slides = normalizeSlides(items);
  if (!slides.length) return null;

  const trackSlides = [...slides, ...slides];

  return (
    <section className="content-shell section ambiance-showcase">
      <div className="ambiance-showcase-header">
        <div className="ambiance-showcase-title">
          <span className="ambiance-showcase-line" />
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="ambiance-slider-shell">
        <div className="ambiance-slider-track">
          {trackSlides.map((entry, index) => (
            <article className="ambiance-slide" key={`${entry.imageUrl}-${index}`}>
              <img src={entry.imageUrl} alt={entry.title || 'Restaurant ambiance'} loading="lazy" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
