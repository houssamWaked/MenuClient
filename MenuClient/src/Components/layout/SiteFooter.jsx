import { buildSocialIcons } from '../../constants/icons.js';
import { useSiteData } from '../../context/site-data-context.js';
import './SiteFooter.css';

export function SiteFooter() {
  const { locations, siteContent, socialLinks } = useSiteData();
  const footer = siteContent?.footer ?? {};
  const footerSocialIcons = buildSocialIcons(socialLinks);

  return (
    <footer className="footer" id="contact">
      <div className="container footer__content">
        <div className="footer__grid" data-stagger>
          {locations.map((location) => (
            <div
              key={location.id}
              className="footer__column footer__column--location"
              data-reveal="up"
            >
              <h3>{location.heading}</h3>
              <p>{location.addressLineOne}</p>
              {location.addressLineTwo ? <p>{location.addressLineTwo}</p> : null}
              {location.email ? (
                <a className="footer__mail" href={`mailto:${location.email}`}>
                  {location.email}
                </a>
              ) : null}
              {location.phone ? (
                <a
                  className="footer__phone"
                  href={`tel:${location.phone.replace(/\s+/g, '')}`}
                >
                  {location.phone}
                </a>
              ) : null}
            </div>
          ))}

          <div className="footer__column footer__column--signup" data-reveal="up">
            <h3>{footer.stayConnectedTitle ?? ''}</h3>
            <form
              className="footer__signup"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder={footer.emailPlaceholder ?? ''}
                aria-label={footer.emailPlaceholder ?? 'Email'}
              />
              <button type="submit">{footer.signupButton ?? ''}</button>
            </form>
            <p className="footer__hint">{footer.stayConnectedText ?? ''}</p>
          </div>
        </div>

        <div className="footer__socials" aria-label="Social links" data-stagger>
          {footerSocialIcons.map((icon) => (
            <a
              key={icon.label}
              className="footer__social-link"
              href={icon.href}
              aria-label={icon.label}
              target="_blank"
              rel="noreferrer"
              data-reveal="zoom"
            >
              <svg viewBox={icon.viewBox} aria-hidden="true">
                <path d={icon.path} />
              </svg>
            </a>
          ))}
        </div>

        <div className="footer__bottom" data-reveal="up" style={{ '--reveal-delay': '180ms' }}>
          <p>
            {footer.copyright ?? ''}
            {footer.creditBrand ? <span>{footer.creditBrand}</span> : null}
          </p>
        </div>
      </div>
    </footer>
  );
}
