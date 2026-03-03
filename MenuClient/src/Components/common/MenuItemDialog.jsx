import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/cart-context.js';
import { formatPrice } from '../../utils/landing.js';
import './MenuItemDialog.css';

export function MenuItemDialog({ item, currency, onClose }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!item) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const handleAddToCart = () => {
    addItem({ ...item, currency }, quantity);
    onClose();
  };

  return createPortal(
    <div
      className="menu-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-dialog-title"
      onClick={onClose}
    >
      <div className="menu-dialog__backdrop" />

      <div
        className="menu-dialog__card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="menu-dialog__close"
          type="button"
          aria-label="Close item details"
          onClick={onClose}
        >
          x
        </button>

        <div className="menu-dialog__media">
          <img src={item.imageUrl} alt={item.name} loading="lazy" />
          {item.badge ? (
            <span className="menu-dialog__badge">{item.badge}</span>
          ) : null}
        </div>

        <div className="menu-dialog__content">
          <span className="menu-dialog__eyebrow">Menu Spotlight</span>
          <h3 id="menu-dialog-title">{item.name}</h3>
          <p>{item.description}</p>

          <div className="menu-dialog__meta">
            <strong>{formatPrice(item.price, currency)}</strong>
            <span>{item.badge ?? 'House Favorite'}</span>
          </div>

          <div className="menu-dialog__purchase">
            <div className="menu-dialog__quantity-panel">
              <span className="menu-dialog__quantity-label">Quantity</span>
              <div className="menu-dialog__quantity">
                <button
                  type="button"
                  aria-label={`Decrease quantity for ${item.name}`}
                  onClick={() => setQuantity((currentValue) => Math.max(1, currentValue - 1))}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase quantity for ${item.name}`}
                  onClick={() => setQuantity((currentValue) => currentValue + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <strong className="menu-dialog__purchase-total">
              {formatPrice(item.price * quantity, currency)}
            </strong>
          </div>

          <div className="menu-dialog__actions">
            <button className="button button--primary" type="button" onClick={handleAddToCart}>
              Add To Cart
            </button>
            <button className="button menu-dialog__secondary" type="button" onClick={onClose}>
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
