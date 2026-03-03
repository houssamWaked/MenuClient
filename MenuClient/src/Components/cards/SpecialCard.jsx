import { formatPrice } from '../../utils/landing.js';
import './SpecialCard.css';

export function SpecialCard({ item, currency }) {
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
          Order the vibe
        </a>
      </div>
    </article>
  );
}
