import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/format.js';
import './MenuItemModal.css';

export function MenuItemModal({ item, currency, onClose }) {
  const { increment, decrement, getQuantity } = useCart();

  if (!item) {
    return null;
  }

  const quantity = getQuantity(item.id);

  return (
    <>
      <button aria-label="Close item details" className="item-modal__overlay" onClick={onClose} type="button" />
      <div className="item-modal">
        <button className="item-modal__close" onClick={onClose} type="button">
          x
        </button>
        <img alt={item.name} src={item.imageUrl} />
        <div className="item-modal__content">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <strong>{formatPrice(item.basePrice, currency)}</strong>

          <div className="item-modal__actions">
            {quantity > 0 ? (
              <div className="item-modal__stepper">
                <button onClick={() => decrement(item)} type="button">
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => increment(item)} type="button">
                  +
                </button>
              </div>
            ) : (
              <button className="item-modal__add" onClick={() => increment(item)} type="button">
                Add To Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
