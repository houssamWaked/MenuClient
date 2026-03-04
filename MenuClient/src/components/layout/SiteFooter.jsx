import { useState } from 'react';
import { api } from '../../api/api.js';
import { useSiteDataContext } from '../../context/SiteDataContext.jsx';
import './SiteFooter.css';

function socialGlyph(platform) {
  switch (platform) {
    case 'instagram':
      return 'IG';
    case 'twitter':
      return 'X';
    case 'facebook':
      return 'f';
    case 'google':
      return 'G+';
    default:
      return 'o';
  }
}

export function SiteFooter() {
  const { data, tenantSlug } = useSiteDataContext();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const locations = data?.locations ?? [];
  const footer = data?.siteContent?.footer ?? {};
  const socials = data?.siteContent?.socialLinks ?? [];

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }

    setStatus('loading');
    try {
      await api.subscribeNewsletter(tenantSlug, { email: email.trim() });
      setEmail('');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        {locations.slice(0, 2).map((location) => (
          <article className="site-footer__location" key={location.id}>
            <h3>{location.name}</h3>
            <p>{location.address}</p>
            {location.email ? (
              <a href={`mailto:${location.email}`} rel="noreferrer">
                {location.email}
              </a>
            ) : null}
            {location.phone ? (
              <a className="site-footer__phone" href={`tel:${location.phone.replace(/\s+/g, '')}`} rel="noreferrer">
                {location.phone}
              </a>
            ) : null}
          </article>
        ))}

        <article className="site-footer__newsletter">
          <h3>{footer.stayConnectedTitle ?? 'Stay Connected'}</h3>
          <form onSubmit={submit}>
            <input
              onChange={(event) => setEmail(event.target.value)}
              placeholder={footer.emailPlaceholder ?? 'Enter your mail'}
              type="email"
              value={email}
            />
            <button disabled={status === 'loading'} type="submit">
              {footer.signupButton ?? 'Sign Up'}
            </button>
          </form>
          <p>{footer.stayConnectedText}</p>
          {status === 'success' ? <small>Subscribed successfully.</small> : null}
          {status === 'error' ? <small>Could not subscribe right now.</small> : null}
        </article>
      </div>

      <div className="site-footer__socials container">
        {socials.map((social) => (
          <a href={social.href} key={`${social.platform}-${social.href}`} rel="noreferrer" target="_blank">
            {socialGlyph(social.platform)}
          </a>
        ))}
      </div>

      <div className="site-footer__copyright container">
        <p>
          {footer.copyright} <span>{footer.creditBrand}</span>
        </p>
      </div>
    </footer>
  );
}
