import { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/format.js';
import { Reveal } from '../common/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './SpecialsCarousel.css';

function useCardsPerView() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (width < 680) {
    return 1;
  }
  if (width < 1080) {
    return 2;
  }
  return 3;
}

export function SpecialsCarousel({ specials, theme, currency }) {
  const cardsPerView = useCardsPerView();
  const [index, setIndex] = useState(0);
  const entries = Array.isArray(specials) ? specials : [];
  const maxIndex = Math.max(0, entries.length - cardsPerView);
  const safeIndex = Math.min(index, maxIndex);

  useEffect(() => {
    if (entries.length <= cardsPerView) {
      return undefined;
    }

    const id = setInterval(() => {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 4600);

    return () => clearInterval(id);
  }, [cardsPerView, entries.length, maxIndex]);

  return (
    <section className="specials section-space container">
      <SectionHeading eyebrow={theme?.specialsEyebrow} title={theme?.specialsTitle} />

      <div className="specials__viewport">
        <div
          className="specials__track"
          style={{
            transform: `translateX(calc(${safeIndex} * -1 * ((100% - ((var(--gap) * (${cardsPerView} - 1)))) / ${cardsPerView} + var(--gap))))`,
            '--cards-per-view': cardsPerView,
          }}
        >
          {entries.map((card, cardIndex) => (
            <Reveal className="specials__card" delay={cardIndex * 70} key={`${card.title}-${cardIndex}`}>
              <img alt={card.title} src={card.imageUrl} />
              <div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <strong>{formatPrice(card.price, currency)}</strong>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {entries.length > cardsPerView ? (
        <div className="specials__controls">
          <button onClick={() => setIndex(Math.max(0, safeIndex - 1))} type="button">
            Prev
          </button>
          <button onClick={() => setIndex(Math.min(maxIndex, safeIndex + 1))} type="button">
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}
