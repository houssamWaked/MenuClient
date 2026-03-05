import { useState } from 'react';
import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

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
  reservation,
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
  const primaryLocation = locations?.[0] ?? {};
  const panelImage = getSafeImageUrl(
    reservation?.imageUrl || primaryLocation.imageUrl,
    FALLBACK_IMAGES.banner
  );
  const address = getAddress(locations);
  const hours = Array.isArray(reservation?.hours) && reservation.hours.length
    ? reservation.hours
    : Array.isArray(primaryLocation.hours)
      ? primaryLocation.hours
      : [];
  const typeOptions = Array.isArray(reservation?.typeOptions) ? reservation.typeOptions : [];

  return (
    <section className="content-shell section reservation-wrap" ref={reservationRef}>
      <div className="reservation-showcase-header">
        <div className="reservation-showcase-title">
          <span className="reservation-showcase-line" />
          <h2>{reservation?.title}</h2>
        </div>
        <p>{reservation?.description}</p>
      </div>

      <div className="reservation-showcase-panel" style={{ backgroundImage: `url(${panelImage})` }}>
        <div className="reservation-showcase-overlay" />
        <article className="reservation-showcase-content">
          <h3>{reservation?.headline}</h3>
          <div className="reservation-hours-grid">
            {hours.map((entry) => (
              <div key={`${entry.label}-${entry.value}`}>
                <h4>{entry.label}</h4>
                <p>{entry.value}</p>
              </div>
            ))}
          </div>

          <div className="reservation-address">
            <h4>{reservation?.addressLabel}</h4>
            <p>{address}</p>
          </div>

          <button
            type="button"
            className="reservation-cta"
            onClick={() => setShowAdvancedForm((previous) => !previous)}
          >
            <span>{reservation?.ctaLabel}</span>
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
              <h3>{reservation?.formTitle}</h3>
              <div className="two-columns">
                <input
                  type="text"
                  value={orderForm.name}
                  onChange={changeField('name')}
                  placeholder={reservation?.namePlaceholder}
                  required
                />
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={changeField('email')}
                  placeholder={reservation?.emailPlaceholder}
                  required
                />
              </div>
              <div className="two-columns">
                <input
                  type="text"
                  value={orderForm.phone}
                  onChange={changeField('phone')}
                  placeholder={reservation?.phonePlaceholder}
                />
                <select value={orderForm.type} onChange={changeField('type')}>
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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
                placeholder={reservation?.notesPlaceholder}
              />
              <button type="submit" className="btn-primary">
                {reservation?.submitButton}
              </button>
              {orderStatus.message ? (
                <p className={`form-state ${orderStatus.type}`}>{orderStatus.message}</p>
              ) : null}
            </form>

            <aside className="reservation-cart">
              <h4>{reservation?.cartTitle}</h4>
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
                {!cartItems.length ? <p>{reservation?.emptyCartText}</p> : null}
                <div className="cart-total">
                  <span>{reservation?.totalLabel}</span>
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
