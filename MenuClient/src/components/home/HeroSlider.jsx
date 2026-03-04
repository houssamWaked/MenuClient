import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';

export function HeroSlider({ hero }) {
  const slides = Array.isArray(hero?.slides) ? hero.slides : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return undefined;
    }

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4800);

    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="hero-slider">
      <div className="hero-slider__stage">
        {slides.map((slide, slideIndex) => (
          <figure
            className={`hero-slider__slide ${slideIndex === index ? 'is-active' : ''}`}
            key={`${slide}-${slideIndex}`}
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}
      </div>

      <div className="hero-slider__content container">
        <p>{hero?.eyebrow}</p>
        <h1>
          <span>{hero?.titleTop}</span>
          <span>{hero?.titleMiddle}</span>
          <strong>{hero?.accent}</strong>
        </h1>

        <div className="hero-slider__actions">
          {hero?.primaryCta?.href ? <Link to={hero.primaryCta.href}>{hero.primaryCta.label}</Link> : null}
          {hero?.secondaryCta?.href ? <Link to={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link> : null}
        </div>

        <div className="hero-slider__dots">
          {slides.map((_, dotIndex) => (
            <button
              aria-label={`Slide ${dotIndex + 1}`}
              className={dotIndex === index ? 'is-active' : ''}
              key={dotIndex}
              onClick={() => setIndex(dotIndex)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
