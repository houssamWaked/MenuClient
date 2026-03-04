import { useState } from 'react';
import { useSiteData } from '../../context/site-data-context.js';
import { MenuCard } from '../cards/MenuCard.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { MenuItemDialog } from '../common/MenuItemDialog.jsx';
import { groupMenuItemsByCategory } from '../../utils/landing.js';
import './MenuSection.css';

export function MenuSection({
  items,
  currency,
  categories = [],
  groupByCategory = false,
  showMoreButton = false,
  moreHref = '/menu',
}) {
  const [activeItem, setActiveItem] = useState(null);
  const { siteContent } = useSiteData();
  const theme = siteContent?.theme ?? {};
  const categoryGroups = groupByCategory ? groupMenuItemsByCategory(items, categories) : [];

  return (
    <>
      <section className="paper-section menu-section" id="menu">
        <div className="container">
          <SectionHeading
            eyebrow={theme.menuEyebrow ?? ''}
            title={theme.menuTitle ?? ''}
          />

          {groupByCategory ? (
            <>
              {categoryGroups.length > 1 ? (
                <div className="menu-category-nav" data-stagger>
                  {categoryGroups.map((group) => (
                    <a
                      key={group.id}
                      className="menu-category-nav__link"
                      href={`#${group.anchorId}`}
                      data-reveal="up"
                    >
                      {group.name}
                    </a>
                  ))}
                </div>
              ) : null}

              <div className="menu-category-list">
                {categoryGroups.map((group) => (
                  <section key={group.id} className="menu-category" id={group.anchorId} data-reveal="up">
                    <div className="menu-category__heading">
                      <div>
                        <span className="menu-category__eyebrow">{theme.menuCategoryEyebrow ?? ''}</span>
                        <h3>{group.name}</h3>
                      </div>
                      <span className="menu-category__count">{`${group.items.length} items`}</span>
                    </div>

                    <div className="menu-grid" data-stagger>
                      {group.items.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          currency={currency}
                          onSelect={setActiveItem}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <div className="menu-grid" data-stagger>
              {items.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  currency={currency}
                  onSelect={setActiveItem}
                />
              ))}
            </div>
          )}

          {showMoreButton ? (
            <div
              className="menu-section__actions"
              data-reveal="up"
              style={{ '--reveal-delay': '320ms' }}
            >
              <a className="menu-section__more-link" href={moreHref}>
                {theme.moreItemsLabel ?? ''}
              </a>
            </div>
          ) : null}
        </div>
      </section>

      <MenuItemDialog
        key={activeItem?.id ?? 'menu-dialog'}
        item={activeItem}
        currency={currency}
        onClose={() => setActiveItem(null)}
      />
    </>
  );
}
