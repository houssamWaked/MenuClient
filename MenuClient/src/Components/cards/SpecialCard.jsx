import { formatPrice } from '../../utils/landing.js';
import { useSiteData } from '../../context/site-data-context.js';
import './SpecialCard.css';

export function SpecialCard({ item, currency }) {
  const { siteContent } = useSiteData();
  const theme = siteContent?.theme ?? {};

  return (
    <article
      className="special-card"
      style={{ '--card-image': `url(${item.imageUrl})` }}
      data-reveal="up"
    >
      <div className="special-card__overlay" />
      <div className="special-card__content">
        <span>{formatPrice(item.price, currency)}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <a className="button button--primary" href="#menu">
          {theme.specialsCtaLabel ?? ''}
        </a>
      </div>
    </article>
  );
}
