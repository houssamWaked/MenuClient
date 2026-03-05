import { useMemo, useState } from 'react';
import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

function getCalories(item) {
  if (Number.isFinite(Number(item?.calories))) return Number(item.calories);
  if (Number.isFinite(Number(item?.kcal))) return Number(item.kcal);
  if (Number.isFinite(Number(item?.energyKcal))) return Number(item.energyKcal);
  return null;
}

export function MenuSection({
  menuSections,
  theme,
  currencyFormatter,
  onAddToCart = () => {},
  cartQuantities = {},
  cartCount = 0,
  cartTotal = 0,
  onUpdateCartQuantity = () => {},
  onGoToCart = () => {},
}) {
  const sections = useMemo(
    () => (Array.isArray(menuSections) ? menuSections.filter(Boolean) : []),
    [menuSections]
  );
  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id ?? '');
  const activeSectionId = sections.some((section) => section.id === selectedSectionId)
    ? selectedSectionId
    : (sections[0]?.id ?? '');

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];
  const activeItems = Array.isArray(activeSection?.items) ? activeSection.items : [];

  if (!sections.length) return null;

  return (
    <section className="content-shell section menu-page-wrap">
      <div className="menu-page-layout">
        <aside className="menu-page-sidebar">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`menu-page-tab ${section.id === activeSection?.id ? 'active' : ''}`}
              onClick={() => setSelectedSectionId(section.id)}
            >
              <span className="menu-page-tab-icon">{section.icon}</span>
              <span>{section.name}</span>
            </button>
          ))}

          {cartCount > 0 ? (
            <div className="menu-page-cart-summary">
              <p className="menu-page-cart-label">{theme?.menuCurrentCartLabel}</p>
              <div className="menu-page-cart-summary-row">
                <span>{cartCount} item{cartCount > 1 ? 's' : ''}</span>
                <strong>{currencyFormatter.format(cartTotal)}</strong>
              </div>
              <button type="button" className="menu-page-cart-btn" onClick={onGoToCart}>
                {theme?.menuViewCartLabel}
              </button>
            </div>
          ) : null}
        </aside>

        <div className="menu-page-content">
          <header className="menu-page-content-header">
            <h2>{activeSection?.name}</h2>
            <span className="menu-page-heading-line" />
          </header>

          <div className="menu-page-items">
            {activeItems.map((item) => {
              const calories = getCalories(item);
              const quantity = Number(cartQuantities[item.id] || 0);

              return (
                <article className="menu-page-item-card" key={item.id || item.name}>
                  <img
                    src={getSafeImageUrl(item.imageUrl, FALLBACK_IMAGES.dish)}
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="menu-page-item-copy">
                    <div className="menu-page-item-top">
                      <div className="menu-page-item-badges">
                        {item.badge ? <span>{item.badge}</span> : null}
                        {calories ? <span>{calories} kcal</span> : null}
                      </div>
                      <strong>{currencyFormatter.format(Number(item.basePrice || 0))}</strong>
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="menu-page-item-actions">
                      {quantity > 0 ? (
                        <div className="menu-item-qty-controls">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.name}`}
                            onClick={() => onUpdateCartQuantity(item.id, quantity - 1)}
                          >
                            -
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.name}`}
                            onClick={() => onUpdateCartQuantity(item.id, quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button type="button" className="menu-add-btn" onClick={() => onAddToCart(item.id)}>
                          {theme?.menuAddToCartLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
            {!activeItems.length ? (
              <article className="menu-page-item-card menu-page-item-empty">
                <div className="menu-page-item-copy">
                  <h3>{theme?.menuEmptySectionTitle}</h3>
                  <p>{theme?.menuEmptySectionText}</p>
                </div>
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
