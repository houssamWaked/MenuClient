import { useMemo, useState } from 'react';

const MENU_TAB_ICONS = ['🍥', '🥘', '🍣', '🍕', '🍰', '🍹'];
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80';

const FALLBACK_MENU = [
  {
    id: 'starters',
    name: 'Starters Tease',
    icon: '🍥',
    items: [
      {
        id: 'foie-gras-kiss',
        name: 'Foie Gras Kiss',
        description:
          'Silky smooth terrine with sweet fig jam and thin slices of warm, buttered brioche.',
        imageUrl:
          'https://images.unsplash.com/photo-1604908554027-1e8f3a879744?auto=format&fit=crop&w=1400&q=80',
        basePrice: 48,
        calories: 320,
        badge: 'Signature Dessert',
      },
      {
        id: 'caviar-pearls',
        name: 'Caviar Pearls',
        description:
          'Delicate Osetra caviar served atop chilled creme fraiche with miniature toasted blini.',
        imageUrl:
          'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1400&q=80',
        basePrice: 65,
        calories: 200,
        badge: 'Signature Dish',
      },
      {
        id: 'lobster-whisper',
        name: 'Lobster Whisper',
        description:
          'Succulent lobster tail with light avocado mousse and citrus vinaigrette.',
        imageUrl:
          'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?auto=format&fit=crop&w=1400&q=80',
        basePrice: 42,
        calories: 250,
      },
    ],
  },
  { id: 'indian', name: 'Regal Indian Heritage', icon: '🥘', items: [] },
  { id: 'japanese', name: 'Japanese Legacy', icon: '🍣', items: [] },
  { id: 'italian', name: 'Italian Grandeur', icon: '🍕', items: [] },
  { id: 'desserts', name: 'Desserts Sweet Surrender', icon: '🍰', items: [] },
  { id: 'drinks', name: 'Drinks Sip In Style', icon: '🍹', items: [] },
];

function prepareMenuSections(menuSections, items) {
  if (menuSections?.length) {
    const withIcons = menuSections.map((section, index) => ({
      ...section,
      icon: MENU_TAB_ICONS[index % MENU_TAB_ICONS.length],
      items: Array.isArray(section.items) ? section.items : [],
    }));

    if (withIcons.some((section) => section.items.length)) return withIcons;
  }

  if (items?.length) {
    return [
      {
        id: 'starters',
        name: 'Starters',
        icon: '🍥',
        items,
      },
    ];
  }

  return FALLBACK_MENU;
}

function getCalories(item) {
  if (Number.isFinite(Number(item?.calories))) return Number(item.calories);
  if (Number.isFinite(Number(item?.kcal))) return Number(item.kcal);
  if (Number.isFinite(Number(item?.energyKcal))) return Number(item.energyKcal);
  return Math.max(150, Math.round(Number(item?.basePrice || 30) * 6));
}

function getBadge(item) {
  if (item?.badge) return item.badge;
  if (item?.isFeatured) return 'Signature Dish';
  return 'Chef Selection';
}

export function MenuSection({
  menuSections,
  items,
  currencyFormatter,
  onAddToCart = () => {},
  cartQuantities = {},
  cartCount = 0,
  cartTotal = 0,
  onUpdateCartQuantity = () => {},
  onGoToCart = () => {},
}) {
  const sections = useMemo(() => prepareMenuSections(menuSections, items), [items, menuSections]);
  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id ?? '');
  const activeSectionId = sections.some((section) => section.id === selectedSectionId)
    ? selectedSectionId
    : (sections[0]?.id ?? '');

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];
  const activeItems = activeSection?.items?.length ? activeSection.items : FALLBACK_MENU[0].items;

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
              <p className="menu-page-cart-label">Current Cart</p>
              <div className="menu-page-cart-summary-row">
                <span>{cartCount} item{cartCount > 1 ? 's' : ''}</span>
                <strong>{currencyFormatter.format(cartTotal)}</strong>
              </div>
              <button type="button" className="menu-page-cart-btn" onClick={onGoToCart}>
                View Cart
              </button>
            </div>
          ) : null}
        </aside>

        <div className="menu-page-content">
          <header className="menu-page-content-header">
            <h2>{activeSection?.name || 'Starters'}</h2>
            <span className="menu-page-heading-line" />
          </header>

          <div className="menu-page-items">
            {activeItems.map((item) => (
              <article className="menu-page-item-card" key={item.id || item.name}>
                <img src={item.imageUrl || FALLBACK_IMAGE} alt={item.name} loading="lazy" />
                <div className="menu-page-item-copy">
                  <div className="menu-page-item-top">
                    <div className="menu-page-item-badges">
                      <span>{getBadge(item)}</span>
                      <span>{getCalories(item)} kcal</span>
                    </div>
                    <strong>{currencyFormatter.format(Number(item.basePrice || 0))}</strong>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="menu-page-item-actions">
                    {Number(cartQuantities[item.id] || 0) > 0 ? (
                      <div className="menu-item-qty-controls">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name}`}
                          onClick={() =>
                            onUpdateCartQuantity(item.id, Number(cartQuantities[item.id] || 0) - 1)
                          }
                        >
                          -
                        </button>
                        <span>{Number(cartQuantities[item.id] || 0)}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name}`}
                          onClick={() =>
                            onUpdateCartQuantity(item.id, Number(cartQuantities[item.id] || 0) + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="menu-add-btn" onClick={() => onAddToCart(item.id)}>
                        Add To Cart
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
