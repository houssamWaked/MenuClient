import { SiteFooter } from '../Components/layout/SiteFooter.jsx';
import { SiteHeader } from '../Components/layout/SiteHeader.jsx';
import { useSiteData } from '../context/site-data-context.js';
import './ContactPage.css';

export function ContactPage() {
  const { locations, siteContent } = useSiteData();
  const contact = siteContent?.contact ?? {};
  const theme = siteContent?.theme ?? {};

  return (
    <div className="site-shell contact-page-shell">
      <header
        className="contact-page-hero"
        style={{ '--contact-banner-image': `url(${theme.pageBanners?.contact ?? ''})` }}
      >
        <div className="contact-page-hero__overlay" />
        <div className="container contact-page-hero__container">
          <SiteHeader />
          <div className="contact-page-hero__body" data-reveal="up">
            <h1>{theme.pageTitles?.contact ?? 'CONTACT'}</h1>
          </div>
        </div>
      </header>

      <main className="contact-page-main">
        <section className="paper-section contact-section">
          <div className="container contact-section__grid">
            <div className="contact-section__intro" data-reveal="left">
              <span className="section-eyebrow">{contact.eyebrow ?? ''}</span>
              <h2>{contact.title ?? ''}</h2>
              <p>{contact.description ?? ''}</p>

              <div className="contact-section__locations" data-stagger>
                {locations.map((location) => (
                  <article key={location.id} className="contact-location-card" data-reveal="up">
                    <h3>{location.heading}</h3>
                    <p>{location.addressLineOne}</p>
                    {location.addressLineTwo ? <p>{location.addressLineTwo}</p> : null}
                    {location.email ? <a href={`mailto:${location.email}`}>{location.email}</a> : null}
                    {location.phone ? (
                      <a href={`tel:${location.phone.replace(/\s+/g, '')}`}>{location.phone}</a>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>

            <div className="contact-form-card" data-reveal="right">
              <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="text"
                  placeholder={contact.namePlaceholder ?? ''}
                  aria-label={contact.namePlaceholder ?? 'Name'}
                />
                <input
                  type="email"
                  placeholder={contact.emailPlaceholder ?? ''}
                  aria-label={contact.emailPlaceholder ?? 'Email'}
                />
                <input
                  type="text"
                  placeholder={contact.subjectPlaceholder ?? ''}
                  aria-label={contact.subjectPlaceholder ?? 'Subject'}
                />
                <textarea
                  rows="7"
                  placeholder={contact.messagePlaceholder ?? ''}
                  aria-label={contact.messagePlaceholder ?? 'Message'}
                />
                <button className="button button--primary" type="submit">
                  {contact.submitButton ?? ''}
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
