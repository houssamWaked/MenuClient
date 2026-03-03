import { useEffect, useState } from 'react';
import { mediaLibrary, siteCopy } from '../../constants/string.js';
import { SiteHeader } from '../layout/SiteHeader.jsx';
import './HeroSection.css';

export function HeroSection({ tenantName, tenantSlug, loading, error }) {
  const heroImages = mediaLibrary.heroBackgrounds?.length
    ? mediaLibrary.heroBackgrounds
    : [mediaLibrary.heroBackground];
  const [activeSlide, setActiveSlide] = useState(0);
  const heroStatus = loading
    ? 'Syncing live menu'
    : error
      ? 'Preview mode'
      : tenantName
        ? `Live tenant: ${tenantName}`
        : 'Static preview';

  useEffect(() => {
    if (heroImages.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroImages.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [heroImages.length]);

  const goToPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? heroImages.length - 1 : currentSlide - 1
    );
  };

  const goToNextSlide = () => {
    setActiveSlide((currentSlide) => (currentSlide + 1) % heroImages.length);
  };

  return (
    <header className="hero" id="home">
      <div className="hero__media" aria-hidden="true">
        {heroImages.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className={`hero__slide${index === activeSlide ? ' is-active' : ''}`}
            style={{ '--hero-image': `url(${imageUrl})` }}
          />
        ))}
      </div>
      <div className="hero__scrim" />
      <div className="container">
        <SiteHeader tenantName={tenantName} />

        <div className="hero__body">
          <div className="hero__content" data-stagger>
            <span className="paint-badge" data-reveal="zoom">
              {siteCopy.heroEyebrow}
            </span>
            <h1 className="hero__title" data-reveal="up">
              <span>{siteCopy.heroTitleTop}</span>
              <span>{siteCopy.heroTitleMiddle}</span>
              <em>{tenantSlug ?? siteCopy.heroTitleAccent}</em>
            </h1>

            {error ? (
              <p className="hero__notice" data-reveal="up">
                {heroStatus}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <button
        className="hero__arrow hero__arrow--left"
        type="button"
        aria-label="Previous slide"
        onClick={goToPreviousSlide}
        data-reveal="zoom"
        style={{ '--reveal-delay': '280ms' }}
      >
        {'<'}
      </button>
      <button
        className="hero__arrow hero__arrow--right"
        type="button"
        aria-label="Next slide"
        onClick={goToNextSlide}
        data-reveal="zoom"
        style={{ '--reveal-delay': '340ms' }}
      >
        {'>'}
      </button>

      <div
        className="hero__pagination"
        aria-label="Hero image navigation"
        data-reveal="up"
        style={{ '--reveal-delay': '420ms' }}
      >
        {heroImages.map((imageUrl, index) => (
          <button
            key={imageUrl}
            className={`hero__dot${index === activeSlide ? ' is-active' : ''}`}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </header>
  );
}
