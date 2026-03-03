import { useEffect, useState } from 'react';
import { SpecialCard } from '../cards/SpecialCard.jsx';
import './SpecialsSection.css';

export function SpecialsSection({ items, currency }) {
  const getCardsPerView = () => {
    if (typeof window === 'undefined') {
      return 3;
    }

    if (window.innerWidth < 720) {
      return 1;
    }

    if (window.innerWidth < 1120) {
      return 2;
    }

    return 3;
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView);
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndex = Math.max(0, items.length - cardsPerView);
  const currentIndex = Math.min(activeIndex, maxIndex);
  const visibleItems =
    items.length <= cardsPerView
      ? items
      : Array.from({ length: cardsPerView }, (_, offset) => items[currentIndex + offset]).filter(Boolean);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (items.length <= cardsPerView) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => {
        const safeIndex = Math.min(current, maxIndex);
        return safeIndex >= maxIndex ? 0 : safeIndex + 1;
      });
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cardsPerView, items.length, maxIndex]);

  const handlePrevious = () => {
    setActiveIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  const handleNext = () => {
    setActiveIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  return (
    <section className="specials-section" id="specials">
      <div className="container specials-section__inner">
        <div className="specials-section__head" data-reveal="up">
          <div>
            <span className="specials-section__eyebrow">Featured Picks</span>
            <h2>More Special Burgers</h2>
          </div>

          <div className="specials-section__controls" aria-label="Specials carousel controls">
            <button type="button" onClick={handlePrevious} aria-label="Show previous specials">
              {'<'}
            </button>
            <button type="button" onClick={handleNext} aria-label="Show next specials">
              {'>'}
            </button>
          </div>
        </div>

        <div className="specials-carousel">
          <div
            className="specials-track"
            style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}
            data-stagger
          >
            {visibleItems.map((item, index) => (
              <div
                key={`${item.title}-${item.imageUrl}-${index}`}
                className="specials-slide"
                data-reveal="up"
              >
                <SpecialCard item={item} currency={currency} />
              </div>
            ))}
          </div>
        </div>

        <div
          className="specials-section__dots"
          aria-label="Specials carousel pagination"
          data-reveal="up"
          style={{ '--reveal-delay': '220ms' }}
        >
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              type="button"
              className={index === currentIndex ? 'is-active' : undefined}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to specials slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
