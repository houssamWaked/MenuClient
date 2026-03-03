import { footerSocialIcons } from '../../constants/icons.js';
import { footerLocations, siteCopy } from '../../constants/string.js';
import './SiteFooter.css';

export function SiteFooter() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__content">
        <div className="footer__grid" data-stagger>
          {footerLocations.map((location) => (
            <div
              key={location.city}
              className="footer__column footer__column--location"
              data-reveal="up"
            >
              <h3>{location.city}</h3>
              <p>{location.addressLineOne}</p>
              <p>{location.addressLineTwo}</p>
              <a className="footer__mail" href={`mailto:${location.email}`}>
                {location.email}
              </a>
              <a
                className="footer__phone"
                href={`tel:${location.phone.replace(/\s+/g, '')}`}
              >
                {location.phone}
              </a>
            </div>
          ))}

          <div className="footer__column footer__column--signup" data-reveal="up">
            <h3>{siteCopy.footerStayConnectedTitle}</h3>
            <form
              className="footer__signup"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder={siteCopy.footerEmailPlaceholder}
                aria-label={siteCopy.footerEmailPlaceholder}
              />
              <button type="submit">{siteCopy.footerSignupButton}</button>
            </form>
            <p className="footer__hint">{siteCopy.footerStayConnectedText}</p>
          </div>
        </div>

        <div className="footer__socials" aria-label="Social links" data-stagger>
          {footerSocialIcons.map((icon) => (
            <a
              key={icon.label}
              className="footer__social-link"
              href={icon.href}
              aria-label={icon.label}
              data-reveal="zoom"
            >
              <svg viewBox={icon.viewBox} aria-hidden="true">
                <path d={icon.path} />
              </svg>
            </a>
          ))}
        </div>

        <div className="footer__bottom" data-reveal="up" style={{ '--reveal-delay': '180ms' }}>
          <p>{siteCopy.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
}
