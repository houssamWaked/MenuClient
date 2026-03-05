import { useState } from 'react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M7 17L17 7" />
      <path d="M10 7H17V14" />
    </svg>
  );
}

function getAddress(locations) {
  const first = locations?.[0] ?? {};
  const combined = [
    first.addressLine1,
    first.addressLine2,
    first.street,
    first.city,
    first.state,
    first.country,
  ]
    .filter(Boolean)
    .join(' ');

  return combined || first.address || 'Mr. Johnathan Reed Rosew Maplewood Lane';
}

export function ReservationSection({
  reservationRef,
  orderForm,
  onOrderFormChange,
  locations,
  onOrderSubmit,
  orderStatus,
  cartItems,
  currencyFormatter,
  cartTotal,
  onUpdateCartQuantity,
}) {
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const changeField = (field) => (event) => onOrderFormChange(field, event.target.value);
  const panelImage = locations?.[0]?.imageUrl || FALLBACK_IMAGE;
  const address = getAddress(locations);

  return (
    <section className="content-shell section reservation-wrap" ref={reservationRef}>
      <div className="reservation-showcase-header">
        <div className="reservation-showcase-title">
          <span className="reservation-showcase-line" />
          <h2>Reserve Your Experience</h2>
        </div>
        <p>
          Every course ascends toward heaven, &amp; time slows to rhythm of fine wine, &amp;
          unforgettable flavor
        </p>
      </div>

      <div className="reservation-showcase-panel" style={{ backgroundImage: `url(${panelImage})` }}>
        <div className="reservation-showcase-overlay" />
        <article className="reservation-showcase-content">
          <h3>An Evening Of Exquisite Taste, Quiet Luxury</h3>
          <div className="reservation-hours-grid">
            <div>
              <h4>Monday to Friday</h4>
              <p>9:00AM -10:00PM</p>
            </div>
            <div>
              <h4>Saturday and Sunday</h4>
              <p>9:00AM -12:00PM</p>
            </div>
          </div>

          <div className="reservation-address">
            <h4>Address</h4>
            <p>{address}</p>
          </div>

          <button
            type="button"
            className="reservation-cta"
            onClick={() => setShowAdvancedForm((previous) => !previous)}
          >
            <span>Make A Reservation</span>
            <span className="reservation-cta-icon" aria-hidden="true">
              <ArrowIcon />
            </span>
          </button>
          {orderStatus.message ? (
            <p className={`form-state ${orderStatus.type}`}>{orderStatus.message}</p>
          ) : null}
        </article>
      </div>

      {showAdvancedForm ? (
        <div className="reservation-advanced">
          <div className="reservation-grid">
            <form className="reservation-form-card reservation-form" onSubmit={onOrderSubmit}>
              <h3>Make A Reservation</h3>
              <div className="two-columns">
                <input
                  type="text"
                  value={orderForm.name}
                  onChange={changeField('name')}
                  placeholder="Full Name"
                  required
                />
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={changeField('email')}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="two-columns">
                <input
                  type="text"
                  value={orderForm.phone}
                  onChange={changeField('phone')}
                  placeholder="Phone"
                />
                <select value={orderForm.type} onChange={changeField('type')}>
                  <option value="online">Online</option>
                  <option value="delivery">Delivery</option>
                  <option value="takeaway">Takeaway</option>
                </select>
              </div>
              <select value={orderForm.locationId} onChange={changeField('locationId')}>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <textarea
                rows={4}
                value={orderForm.notes}
                onChange={changeField('notes')}
                placeholder="Notes"
              />
              <button type="submit" className="btn-primary">
                Confirm Reservation
              </button>
              {orderStatus.message ? (
                <p className={`form-state ${orderStatus.type}`}>{orderStatus.message}</p>
              ) : null}
            </form>

            <aside className="reservation-cart">
              <h4>Selected Dishes</h4>
              <div className="cart-list">
                {cartItems.map((entry) => (
                  <article key={entry.item.id} className="cart-item">
                    <div>
                      <h5>{entry.item.name}</h5>
                      <p>{currencyFormatter.format(Number(entry.item.basePrice || 0))}</p>
                    </div>
                    <div className="qty-controls">
                      <button type="button" onClick={() => onUpdateCartQuantity(entry.item.id, entry.quantity - 1)}>
                        -
                      </button>
                      <span>{entry.quantity}</span>
                      <button type="button" onClick={() => onUpdateCartQuantity(entry.item.id, entry.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </article>
                ))}
                {!cartItems.length ? <p>No dishes selected yet.</p> : null}
                <div className="cart-total">
                  <span>Total</span>
                  <strong>{currencyFormatter.format(cartTotal)}</strong>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
    </section>
  );
}
