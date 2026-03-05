import { FALLBACK_SIGNATURE_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

function normalizeSlides(items) {
  const sourceItems = Array.isArray(items) && items.length ? items : [{ title: 'Chef Selection' }];
  const valid = sourceItems.map((item, index) => ({
    ...item,
    title: item?.title || 'Chef Selection',
    imageUrl: getSafeImageUrl(item?.imageUrl, FALLBACK_SIGNATURE_IMAGES[index % FALLBACK_SIGNATURE_IMAGES.length]),
  }));
  if (valid.length >= 4) return valid;

  const expanded = [];
  while (expanded.length < 4) {
    expanded.push(valid[expanded.length % valid.length]);
  }
  return expanded;
}

export function SignatureDishesSection({ title, description, items }) {
  const slides = normalizeSlides(items);
  if (!slides.length) return null;

  const trackSlides = [...slides, ...slides];

  return (
    <section className="content-shell section signature-showcase">
      <div className="signature-showcase-header">
        <div className="signature-showcase-title">
          <span className="signature-showcase-line" />
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="signature-slider-shell">
        <div className="signature-slider-track">
          {trackSlides.map((entry, index) => (
            <article className="signature-slide" key={`${entry.title}-${index}`}>
              <img src={entry.imageUrl} alt={entry.title} loading="lazy" />
              <div className="signature-slide-overlay" />
              <h3>{entry.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
