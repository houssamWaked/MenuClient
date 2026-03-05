const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80';

const FALLBACK_CARDS = [
  {
    title: 'Timeless Heritage',
    description: 'Signature dishes that evolve with inspiration and culture',
  },
  {
    title: 'World-Class Beverage',
    description: 'Signature 7-10 course tasting menus are available',
  },
  {
    title: 'Emotion & Elegance',
    description: 'Live piano or ambient jazz, tailored per evening',
  },
  {
    title: 'Exclusivity & Experience',
    description: 'Personalized service from a dedicated host',
  },
];

function buildCards(values) {
  const source = Array.isArray(values) && values.length ? values : FALLBACK_CARDS;
  const cards = source.slice(0, 4).map((entry) => ({
    title: entry?.title || 'Signature Highlight',
    description: entry?.description || 'Curated experiences crafted for memorable evenings',
  }));
  if (cards.length === 4) return cards;

  while (cards.length < 4) {
    cards.push(FALLBACK_CARDS[cards.length % FALLBACK_CARDS.length]);
  }
  return cards;
}

export function AboutHighlightsSection({ about }) {
  const cards = buildCards(about?.values);
  const imageUrl = about?.secondaryImage || about?.primaryImage || FALLBACK_IMAGE;

  return (
    <section className="content-shell section about-highlights">
      <div className="about-highlights-image-wrap">
        <img src={imageUrl} alt="Restaurant highlight" loading="lazy" />
      </div>

      <div className="about-highlights-heading">
        <span className="about-highlights-line" />
        <h2>Our Restaurant Highlights</h2>
        <span className="about-highlights-line" />
      </div>

      <div className="about-highlights-cards">
        {cards.map((card, index) => (
          <article key={`${card.title}-${index}`} className="about-highlights-card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
