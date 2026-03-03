import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/cart-context.js';
import { formatPrice } from '../../utils/landing.js';
import './CartDrawer.css';

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    currency,
    isCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    closeCart,
  } = useCart();

  useEffect(() => {
    if (!isCartOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeCart, isCartOpen]);

  if (!isCartOpen) {
    return null;
  }

  return createPortal(
    <div className="cart-drawer" onClick={closeCart}>
      <div className="cart-drawer__backdrop" />

      <aside
        className="cart-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-drawer__header">
          <div>
            <span className="cart-drawer__eyebrow">Your order</span>
            <h2 id="cart-drawer-title">Cart</h2>
          </div>

          <button
            className="cart-drawer__close"
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
          >
            x
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <strong>Your cart is empty</strong>
            <p>Open a burger detail card and add a few favorites to start your order.</p>
            <button className="button button--primary" type="button" onClick={closeCart}>
              Keep Browsing
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer__summary">
              <span>{`${itemCount} item${itemCount === 1 ? '' : 's'}`}</span>
              <strong>{formatPrice(subtotal, currency)}</strong>
            </div>

            <div className="cart-drawer__items">
              {items.map((item) => (
                <article key={item.id} className="cart-line-item">
                  <img src={item.imageUrl} alt={item.name} loading="lazy" />

                  <div className="cart-line-item__content">
                    <div className="cart-line-item__title-row">
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.categoryName ?? item.badge ?? 'Menu item'}</p>
                      </div>

                      <button
                        className="cart-line-item__remove"
                        type="button"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="cart-line-item__footer">
                      <strong>{formatPrice(item.price * item.quantity, item.currency ?? currency)}</strong>

                      <div className="cart-line-item__quantity">
                        <button
                          type="button"
                          aria-label={`Decrease quantity for ${item.name}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity for ${item.name}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-drawer__totals">
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal, currency)}</strong>
              </div>
              <p>Taxes and delivery options can be finalized when you place the order.</p>
            </div>

            <div className="cart-drawer__actions">
              <button className="button button--primary" type="button" onClick={closeCart}>
                Continue Ordering
              </button>
              <button className="button cart-drawer__clear" type="button" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body
  );
}
