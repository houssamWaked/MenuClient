import { useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/format.js';
import { Reveal } from '../common/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { MenuItemModal } from './MenuItemModal.jsx';
import './MenuCatalog.css';

export function MenuCatalog({ categories, items, theme, currency, showHeading = true }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const { getQuantity, increment, decrement } = useCart();

  const sortedCategories = useMemo(
    () => [...(categories ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [categories]
  );

  const sortedItems = useMemo(
    () => [...(items ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (selectedCategoryId === 'all') {
      return sortedItems;
    }

    return sortedItems.filter((item) => item.categoryId === selectedCategoryId);
  }, [selectedCategoryId, sortedItems]);

  const categoryById = useMemo(() => {
    const map = new Map();
    sortedCategories.forEach((category) => map.set(category.id, category.name));
    return map;
  }, [sortedCategories]);

  return (
    <section className="menu-catalog section-space container">
      {showHeading ? <SectionHeading eyebrow={theme?.menuEyebrow} title={theme?.menuTitle} /> : null}

      <div className="menu-catalog__categories">
        <button
          className={selectedCategoryId === 'all' ? 'is-active' : ''}
          onClick={() => setSelectedCategoryId('all')}
          type="button"
        >
          All
        </button>
        {sortedCategories.map((category) => (
          <button
            className={selectedCategoryId === category.id ? 'is-active' : ''}
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            type="button"
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="menu-catalog__list">
        {filteredItems.map((item, index) => {
          const quantity = getQuantity(item.id);

          return (
            <Reveal className="menu-catalog__card" delay={index * 60} key={item.id}>
              <button className="menu-catalog__image" onClick={() => setSelectedItem(item)} type="button">
                <img alt={item.name} src={item.imageUrl} />
              </button>

              <article className="menu-catalog__content">
                <h3>{item.name}</h3>
                {categoryById.get(item.categoryId) ? <small>{categoryById.get(item.categoryId)}</small> : null}
                <p>{item.description}</p>
                <strong>{formatPrice(item.basePrice, currency)}</strong>
              </article>

              <div className="menu-catalog__actions">
                {quantity > 0 ? (
                  <div className="menu-catalog__stepper">
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

      <MenuItemModal currency={currency} item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}
