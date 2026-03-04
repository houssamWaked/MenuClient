import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/format.js';
import { Reveal } from '../common/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { MenuItemModal } from '../menu/MenuItemModal.jsx';
import './HomeMenuSection.css';

export function HomeMenuSection({ categories, items, featuredItems, menuTheme, currency }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const { getQuantity, increment, decrement } = useCart();

  const categoryById = useMemo(
    () => new Map((categories ?? []).map((category) => [category.id, category.name])),
    [categories]
  );

  const cards = useMemo(() => {
    const featured = featuredItems?.length ? featuredItems : items;
    return (featured ?? []).slice(0, 6);
  }, [featuredItems, items]);

  return (
    <section className="home-menu section-space container" id="home-menu">
      <SectionHeading eyebrow={menuTheme?.menuEyebrow} title={menuTheme?.menuTitle} />

      <div className="home-menu__grid">
        {cards.map((item, index) => {
          const quantity = getQuantity(item.id);

          return (
            <Reveal className="home-menu__card" delay={index * 70} key={item.id}>
              <button className="home-menu__preview" onClick={() => setSelectedItem(item)} type="button">
                <img alt={item.name} src={item.imageUrl} />
              </button>

              <div className="home-menu__card-content">
                <h3>{item.name}</h3>
                {categoryById.get(item.categoryId) ? <span>{categoryById.get(item.categoryId)}</span> : null}
                <p>{item.description}</p>
                <strong>{formatPrice(item.basePrice, currency)}</strong>
              </div>

              <div className="home-menu__quantity">
                {quantity > 0 ? (
                  <div className="quantity-stepper">
                    <button onClick={() => decrement(item)} type="button">
                      -
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => increment(item)} type="button">
                      +
                    </button>
                  </div>
                ) : (
                  <button onClick={() => increment(item)} type="button">
                    Add
                  </button>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Link className="home-menu__more" to="/menu">
        {menuTheme?.moreItemsLabel ?? 'More Items'}
      </Link>

      <MenuItemModal currency={currency} item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}
