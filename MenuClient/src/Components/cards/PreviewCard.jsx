import { formatPrice } from '../../utils/landing.js';
import './PreviewCard.css';

export function PreviewCard({ item, currency }) {
  return (
    <article className="preview-card">
      <img src={item.imageUrl} alt={item.name} loading="lazy" />
      <div>
        <p>{item.name}</p>
        <span>{formatPrice(item.price, currency)}</span>
      </div>
    </article>
  );
}
