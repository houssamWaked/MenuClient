import { useCart } from '../../context/cart-context.js';
import { formatPrice } from '../../utils/landing.js';
import './MenuCard.css';

export function MenuCard({ item, currency, onSelect }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((entry) => entry.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleQuickAdd = () => {
    addItem({ ...item, currency }, 1);
  };

  return (
    <article className="menu-card" data-reveal="up">
      <button
        className="menu-card__media"
        type="button"
        aria-haspopup="dialog"
        aria-label={`View details for ${item.name}`}
        onClick={() => onSelect?.(item)}
      >
        <img src={item.imageUrl} alt={item.name} loading="lazy" />
      </button>

      <div className="menu-card__body">
        <button
          className="menu-card__details-trigger"
          type="button"
          aria-haspopup="dialog"
          aria-label={`Open details for ${item.name}`}
          onClick={() => onSelect?.(item)}
        >
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </button>

        <div className="menu-card__footer">
          <span>{formatPrice(item.price, currency)}</span>
          <div className="menu-card__actions">
            <button
              className="menu-card__detail-link"
              type="button"
              onClick={() => onSelect?.(item)}
            >
              Details
            </button>
            {quantity > 0 ? (
              <div className="menu-card__quantity-picker" aria-label={`${item.name} quantity controls`}>
                <button
                  className="menu-card__quantity-button"
                  type="button"
                  aria-label={`Decrease quantity for ${item.name}`}
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                >
                  -
                </button>
                <span className="menu-card__quantity-value">{quantity}</span>
                <button
                  className="menu-card__quantity-button"
                  type="button"
                  aria-label={`Increase quantity for ${item.name}`}
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="menu-card__add-button"
                type="button"
                aria-label={`Add ${item.name} to cart`}
                onClick={handleQuickAdd}
              >
                Add To Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
