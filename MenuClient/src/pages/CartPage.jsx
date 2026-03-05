import { PageBanner } from '../components/common/PageBanner.jsx';

export function CartPage({
  bannerImage,
  pageTitle,
  bannerDescription,
  theme,
  cartItems,
  cartTotal,
  cartCount,
  currencyFormatter,
  onUpdateCartQuantity,
  onClearCart,
  onNavigate,
  onBook,
}) {
  return (
    <>
      <PageBanner
        title={pageTitle}
        description={bannerDescription || 'Review your selected dishes and proceed in seconds.'}
        imageUrl={bannerImage}
      />

      <section className="content-shell section cart-page-wrap">
        <div className="cart-page-layout">
          <article className="cart-page-items-card">
            <div className="cart-page-head">
              <h2>{theme?.cartTitle}</h2>
              {cartItems.length ? (
                <button type="button" className="cart-clear-btn" onClick={onClearCart}>
                  {theme?.cartClearLabel}
                </button>
              ) : null}
            </div>

            {cartItems.length ? (
              <div className="cart-list">
                {cartItems.map((entry) => (
                  <article key={entry.item.id} className="cart-item">
                    <div className="cart-page-item-copy">
                      <h5>{entry.item.name}</h5>
                      <p>
                        {currencyFormatter.format(Number(entry.item.basePrice || 0))} {theme?.cartEachLabel}
                      </p>
                    </div>
                    <div className="cart-page-item-meta">
                      <strong className="cart-page-line-total">
                        {currencyFormatter.format(
                          Number(entry.item.basePrice || 0) * Number(entry.quantity || 0)
                        )}
                      </strong>
                      <div className="qty-controls">
                        <button
                          type="button"
                          onClick={() => onUpdateCartQuantity(entry.item.id, entry.quantity - 1)}
                          aria-label={`Decrease ${entry.item.name}`}
                        >
                          -
                        </button>
                        <span>{entry.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateCartQuantity(entry.item.id, entry.quantity + 1)}
                          aria-label={`Increase ${entry.item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => onUpdateCartQuantity(entry.item.id, 0)}
                      >
                        {theme?.cartRemoveLabel}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="cart-empty-state">
                <p>{theme?.cartEmptyMessage}</p>
                <button type="button" className="btn-primary" onClick={() => onNavigate('/menu')}>
                  {theme?.cartBrowseLabel}
                </button>
              </div>
            )}
          </article>

          <aside className="cart-page-summary-card">
            <h3>{theme?.cartSummaryTitle}</h3>
            <div className="cart-page-summary-row">
              <span>{theme?.cartItemsLabel}</span>
              <strong>{cartCount}</strong>
            </div>
            <div className="cart-page-summary-row total">
              <span>{theme?.cartTotalLabel}</span>
              <strong>{currencyFormatter.format(cartTotal)}</strong>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={onBook}
              disabled={!cartItems.length}
            >
              {theme?.cartContinueLabel}
            </button>
            <button type="button" className="cart-secondary-btn" onClick={() => onNavigate('/menu')}>
              {theme?.cartAddMoreLabel}
            </button>
          </aside>
        </div>
      </section>
    </>
  );
}
