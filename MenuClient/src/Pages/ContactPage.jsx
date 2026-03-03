import { SiteFooter } from '../Components/layout/SiteFooter.jsx';
import { SiteHeader } from '../Components/layout/SiteHeader.jsx';
import { footerLocations, mediaLibrary, siteCopy } from '../constants/string.js';
import { useLandingData } from '../hooks/useLandingData.js';
import './ContactPage.css';

export function ContactPage() {
  const pageData = useLandingData();
  const tenantName = pageData.tenant?.name ?? 'Burger Bachelor';

  return (
    <div className="site-shell contact-page-shell">
      <header
        className="contact-page-hero"
        style={{ '--contact-banner-image': `url(${mediaLibrary.contactBanner})` }}
      >
        <div className="contact-page-hero__overlay" />
        <div className="container contact-page-hero__container">
          <SiteHeader tenantName={tenantName} />
          <div className="contact-page-hero__body" data-reveal="up">
            <h1>{siteCopy.contactPageHeroTitle}</h1>
          </div>
        </div>
      </header>

      <main className="contact-page-main">
        <section className="paper-section contact-section">
          <div className="container contact-section__grid">
            <div className="contact-section__intro" data-reveal="left">
              <span className="section-eyebrow">{siteCopy.contactEyebrow}</span>
              <h2>{siteCopy.contactTitle}</h2>
              <p>{siteCopy.contactDescription}</p>

              <div className="contact-section__locations" data-stagger>
                {footerLocations.map((location) => (
                  <article key={location.city} className="contact-location-card" data-reveal="up">
                    <h3>{location.city}</h3>
                    <p>{location.addressLineOne}</p>
                    <p>{location.addressLineTwo}</p>
                    <a href={`mailto:${location.email}`}>{location.email}</a>
                    <a href={`tel:${location.phone.replace(/\s+/g, '')}`}>{location.phone}</a>
                  </article>
                ))}
              </div>
            </div>

            <div className="contact-form-card" data-reveal="right">
              <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="text"
                  placeholder={siteCopy.contactNamePlaceholder}
                  aria-label={siteCopy.contactNamePlaceholder}
                />
                <input
                  type="email"
                  placeholder={siteCopy.contactEmailPlaceholder}
                  aria-label={siteCopy.contactEmailPlaceholder}
                />
                <input
                  type="text"
                  placeholder={siteCopy.contactSubjectPlaceholder}
                  aria-label={siteCopy.contactSubjectPlaceholder}
                />
                <textarea
                  rows="7"
                  placeholder={siteCopy.contactMessagePlaceholder}
                  aria-label={siteCopy.contactMessagePlaceholder}
                />
                <button className="button button--primary" type="submit">
                  {siteCopy.contactSubmitButton}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
