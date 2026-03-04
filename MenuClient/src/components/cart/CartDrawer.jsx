import { useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useSiteDataContext } from '../../context/SiteDataContext.jsx';
import { formatPrice } from '../../utils/format.js';
import './CartDrawer.css';

export function CartDrawer() {
  const { data } = useSiteDataContext();
  const {
    isCartOpen,
    closeCart,
    cartItems,
    totalItems,
    totalPrice,
    increment,
    decrement,
    submitOrder,
    isSubmittingOrder,
  } = useCart();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [feedback, setFeedback] = useState('');

  const currency = data?.tenant?.currency ?? 'USD';

  const isCheckoutDisabled = useMemo(() => {
    if (!cartItems.length || isSubmittingOrder) {
      return true;
    }

    return !formState.name.trim() || !formState.email.trim();
  }, [cartItems.length, formState.email, formState.name, isSubmittingOrder]);

  const submit = async (event) => {
    event.preventDefault();
    setFeedback('');
    try {
      await submitOrder(formState);
      setFormState({ name: '', email: '', phone: '', notes: '' });
      setFeedback('Order placed successfully.');
    } catch (error) {
      setFeedback(error?.message ?? 'Could not submit order.');
    }
  };

  return (
    <>
      <button
        aria-label="Close cart overlay"
        className={`cart-drawer__overlay ${isCartOpen ? 'is-open' : ''}`}
        onClick={closeCart}
        type="button"
      />

      <aside className={`cart-drawer ${isCartOpen ? 'is-open' : ''}`}>
        <header className="cart-drawer__header">
          <h3>Your Cart</h3>
          <button onClick={closeCart} type="button">
            Close
          </button>
        </header>

        {cartItems.length === 0 ? (
          <p className="cart-drawer__empty">Your cart is empty.</p>
        ) : (
          <ul className="cart-drawer__list">
            {cartItems.map((item) => (
              <li className="cart-drawer__item" key={item.id}>
                <img alt={item.name} src={item.imageUrl} />
                <div className="cart-drawer__item-content">
                  <h4>{item.name}</h4>
                  <p>{formatPrice(item.basePrice, currency)}</p>
                  <div className="cart-drawer__stepper">
                    <button onClick={() => decrement(item)} type="button">
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increment(item)} type="button">
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <footer className="cart-drawer__footer">
          <div className="cart-drawer__summary">
            <span>{totalItems} items</span>
            <strong>{formatPrice(totalPrice, currency)}</strong>
          </div>

          <form className="cart-drawer__form" onSubmit={submit}>
            <input
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Name"
              required
              type="text"
              value={formState.name}
            />
            <input
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              required
              type="email"
              value={formState.email}
            />
            <input
              onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
              type="text"
              value={formState.phone}
            />
            <textarea
              onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Order notes (optional)"
              rows={2}
              value={formState.notes}
            />
            <button disabled={isCheckoutDisabled} type="submit">
              {isSubmittingOrder ? 'Submitting...' : 'Place Order'}
            </button>
          </form>
          {feedback ? <p className="cart-drawer__feedback">{feedback}</p> : null}
        </footer>
      </aside>
    </>
  );
}
